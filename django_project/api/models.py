from django.db import models
from django.utils import timezone
from django.core.validators import MinLengthValidator
from django.core.validators import MinValueValidator, MaxValueValidator
from django.contrib.auth.hashers import check_password


class User(models.Model):
    name = models.CharField(
        max_length=15,
        validators=[MinLengthValidator(1)]
    )
    number = models.CharField(
        unique=True,
        max_length=8,
        validators=[MinLengthValidator(8)]
    )
    passwd = models.CharField(
        max_length=30,
        validators=[MinLengthValidator(5)]
    )
    coin = models.IntegerField(default=0)

    def __repr__(self):
        return "{}: {}".format(self.pk, self.name)

    def auth(self, passwd):
        return check_password(passwd, self.passwd)

    __str__ = __repr__


class Subject(models.Model):
    name = models.CharField(
        unique=True,
        max_length=20,
        validators=[MinLengthValidator(1)]
    )
    grade = models.CharField(
        max_length=10,
        validators=[MinLengthValidator(1)]
    )
    quarter = models.CharField(
        max_length=10,
        validators=[MinLengthValidator(1)]
    )

    def set_grades_from_text_list(self, origin):
        _ = origin.replace("'", "").replace("[", "")
        _ = _.replace("]", "").replace(" ", "")
        self.grade = _

    def __repr__(self):
        return "{}: {}".format(self.pk, self.name)

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
        blank=False)
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


class Like(models.Model):
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


class Share(models.Model):
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
