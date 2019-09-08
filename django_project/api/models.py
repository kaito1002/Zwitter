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


class Exam(models.Model):
    subject = models.ForeignKey(
        Subject,
        related_name='exams',
        on_delete=models.CASCADE
        )
    year = models.IntegerField()


class Content(models.Model):
    """
    type
    0. 問題
    1. 解答
    2. その他
    """
    type = models.IntegerField(
        validators=[MinValueValidator(0),
                    MaxValueValidator(2)]
        )
    # とりあえず文字列
    data = models.CharField(max_length=1000)
    posted_at = models.DateTimeField(default=timezone.now)


class Comment(models.Model):
    content = models.ForeignKey(
        Content,
        related_name='contents',
        on_delete=models.CASCADE
        )
    posted_at = models.DateTimeField(default=timezone.now)
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
