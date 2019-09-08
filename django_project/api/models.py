from django.db import models
from django.core.validators import MinLengthValidator


class User(models.Model):
    name = models.CharField(max_length=32)
    mail = models.EmailField()
    number = models.CharField(
        max_length=32,
        validators=[MinLengthValidator(6)]
    )
    passwd = models.CharField(max_length=20)
