from django.db import models
from django.utils import timezone
from django.core.validators import MinLengthValidator
from django.core.validators import MinValueValidator, MaxValueValidator


class User(models.Model):
    name = models.CharField(max_length=32)
    number = models.CharField(
        max_length=32,
        validators=[MinLengthValidator(6)]
    )
    passwd = models.CharField(max_length=20)
    coin = models.IntegerField(default=0)

    def __repr__(self):
        return "{}: {}".format(self.pk, self.name)

    __str__ = __repr__


class Subject(models.Model):
    name = models.CharField(max_length=20)
    grade = models.IntegerField(
        validators=[MinValueValidator(1),
                    MaxValueValidator(4)]
        )
    quarter = models.IntegerField(
        validators=[MinValueValidator(1),
                    MaxValueValidator(4)]
        )

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
            self.sender.name,
            self.exam)

    __str__ = __repr__
