from django.db import models
from django.utils import timezone
from django.core.validators import MinLengthValidator
from django.core.validators import MinValueValidator, MaxValueValidator
from django.contrib.auth.hashers import check_password
from django.contrib.auth.models import AbstractBaseUser, BaseUserManager
from django.contrib.auth.models import PermissionsMixin
from django.utils.translation import gettext_lazy as _
from rest_framework.authtoken.models import Token
from datetime import datetime


class UserManager(BaseUserManager):
    def create_user(self, number, password, name="", email=None):
        if email is None:
            email = f"{number}@u-aizu.ac.jp"
        user = User(
            name=name,
            number=number,
            email=BaseUserManager.normalize_email(email),
            coin=0,
        )
        user.set_password(password)
        user.save(using=self._db)

        # Create Auth Token
        Token.objects.create(user=user)
        return user

    def create_superuser(self, number, password, email=None):
        u = self.create_user(number,
                             password=password,
                             email=email)
        u.is_staff = True
        u.is_superuser = True
        u.save(using=self._db)
        return u


class User(AbstractBaseUser, PermissionsMixin):
    name = models.CharField(
        max_length=15,
        validators=[MinLengthValidator(1)]
    )
    number = models.CharField(
        unique=True,
        max_length=8,
        validators=[MinLengthValidator(8)]
    )
    email = models.EmailField(
        unique=True,
        blank=False
        )
    password = models.CharField(
        _('password'),
        max_length=128,
        validators=[MinLengthValidator(5)]
        )
    image_path = models.CharField(
        max_length=1024,
        null=True,
        blank=True,
    )
    is_staff = models.BooleanField(
        default=False
    )
    is_superuser = models.BooleanField(
        default=False
    )
    coin = models.IntegerField(default=0)

    EMAIL_FIELD = 'email'
    USERNAME_FIELD = 'number'
    REQUIRED_FIELDS = []

    objects = UserManager()

    def __repr__(self):
        return "{}: {}".format(self.pk, self.name)

    def auth(self, password):
        return check_password(password, self.password)

    @property
    def grade(self):
        now = datetime.now()
        grade = now.year - int(self.number[1:5]) - 766
        return grade - 1 if now.month in [1, 2, 3] else grade

    __str__ = __repr__


class Subject(models.Model):
    name = models.CharField(
        unique=True,
        max_length=80,
        validators=[MinLengthValidator(1)]
    )

    @property
    def related_grades(self):
        return [_.grade for _ in Grade.objects.filter(subject=self).all()]

    @property
    def related_quarters(self):
        return [_.quarter for _ in Quarter.objects.filter(subject=self).all()]

    def __repr__(self):
        return "{}: {}".format(self.pk, self.name)

    __str__ = __repr__


class Grade(models.Model):
    subject = models.ForeignKey(
        Subject,
        related_name='grades',
        on_delete=models.CASCADE
        )
    grade = models.IntegerField()

    def __repr__(self):
        return "{}: {} => {}".format(self.pk, self.subject.name, self.grade)

    __str__ = __repr__


class Quarter(models.Model):
    subject = models.ForeignKey(
        Subject,
        related_name='quarters',
        on_delete=models.CASCADE
        )
    quarter = models.CharField(
        max_length=255
    )

    def __repr__(self):
        return "{}: {} => {}".format(self.pk, self.subject.name, self.quarter)

    __str__ = __repr__


class Exam(models.Model):
    subject = models.ForeignKey(
        Subject,
        related_name='exams',
        on_delete=models.CASCADE
        )
    year = models.IntegerField()

    def __repr__(self):
        return "{}: {}({})".format(self.pk, self.subject.name, self.year)

    __str__ = __repr__


class Content(models.Model):
    """
    type
    0. 問題
    1. 解答
    2. その他
    """
    exam = models.ForeignKey(
        Exam,
        related_name='contents',
        on_delete=models.CASCADE,
        blank=False,
        null=False
        )
    type = models.IntegerField(
        validators=[MinValueValidator(0),
                    MaxValueValidator(2)]
        )
    # とりあえず文字列
    data = models.TextField()
    poster = models.ForeignKey(
        User,
        on_delete=models.SET_NULL,
        blank=False,
        null=True
    )
    posted_at = models.DateTimeField(default=timezone.now)

    def __repr__(self):
        _type = {
            0: '問題',
            1: '解答',
            2: 'その他'
        }[self.type]
        _subname = self.exam.subject.name
        _year = self.exam.year
        return "{}: {}({})<{}>".format(self.pk, _subname, _year, _type)

    __str__ = __repr__


class File(models.Model):
    file_path = models.CharField(
        max_length=140,
        validators=[MinLengthValidator(1)],
        blank=True,
        null=True,
    )
    content = models.ForeignKey(
        Content,
        related_name='files',
        on_delete=models.CASCADE,
    )

    def __repr__(self):
        return "{}: {}, {}".format(self.pk, self.content.exam, self.file_path)

    __str__ = __repr__


class Comment(models.Model):
    exam = models.ForeignKey(
        Exam,
        related_name='comments',
        on_delete=models.CASCADE,
        blank=False,
        null=False
        )
    posted_at = models.DateTimeField(default=timezone.now)
    bef_comment = models.ForeignKey(
        'self',
        related_name='aft_comments',
        on_delete=models.CASCADE,
        blank=True,
        null=True
        )
    data = models.TextField()
    sender = models.ForeignKey(
        User,
        related_name='senders',
        on_delete=models.SET_NULL,
        blank=False,
        null=True
        )

    def __repr__(self):
        return "{}: {} on {}".format(
            self.pk,
            self.sender,
            self.exam)

    __str__ = __repr__


class Post(models.Model):
    user = models.ForeignKey(
        User,
        related_name='users',
        on_delete=models.CASCADE,
        blank=False
    )
    posted_at = models.DateTimeField(default=timezone.now)
    bef_post = models.ForeignKey(
        'self',
        related_name='aft_comments',
        on_delete=models.SET_NULL,
        blank=True,
        null=True)
    content = models.CharField(
        max_length=140,
        validators=[MinLengthValidator(1)]
    )

    def __repr__(self):
        return "{}: {} says {}".format(
            self.pk,
            self.user,
            self.content)

    __str__ = __repr__


class Like(models.Model):
    class Meta:
        unique_together = (('user', 'post'), )

    user = models.ForeignKey(
        User,
        on_delete=models.CASCADE,
        blank=False
    )
    post = models.ForeignKey(
        Post,
        related_name='likes',
        on_delete=models.CASCADE,
        blank=False
    )
    liked_at = models.DateTimeField(default=timezone.now)

    def __repr__(self):
        return "{}: {} likes ({} says {})".format(
            self.pk,
            self.user.name,
            self.post.user.name,
            self.post.content
            )

    __str__ = __repr__


class Share(models.Model):
    class Meta:
        unique_together = (('user', 'post'), )

    user = models.ForeignKey(
        User,
        on_delete=models.CASCADE,
        blank=False
    )
    post = models.ForeignKey(
        Post,
        # related_name='shares',
        on_delete=models.CASCADE,
        blank=False
    )
    shared_at = models.DateTimeField(default=timezone.now)

    def __repr__(self):
        return "{}: {} shares ({} says {})".format(
            self.pk,
            self.user.name,
            self.post.user.name,
            self.post.content
        )

    __str__ = __repr__
