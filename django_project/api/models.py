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
        )
    type = models.IntegerField(
        validators=[MinValueValidator(0),
                    MaxValueValidator(2)]
        )
    # とりあえず文字列
    data = models.TextField()
    posted_at = models.DateTimeField(default=timezone.now)

    def __repr__(self):
        _type = {
            0: '問題',
            1: '解答',
            2: 'その他'
        }[self.type]
        return "{}: {}<{}>".format(self.pk, self.exam.subject.name, _type)

    __str__ = __repr__


class Comment(models.Model):
    content = models.ForeignKey(
        Content,
        related_name='comments',
        on_delete=models.CASCADE
        )
    posted_at = models.DateTimeField(default=timezone.now)
    data = models.TextField()
    sender = models.ForeignKey(
        User,
        related_name='senders',
        on_delete=models.SET_NULL,
        null=True
        )
    receiver = models.ForeignKey(
        User,
        related_name='receivers',
        on_delete=models.SET_NULL,
        null=True
        )

    def __repr__(self):
        return "{}: {} -> {}".format(self.pk, self.sender, self.receiver)

    __str__ = __repr__
