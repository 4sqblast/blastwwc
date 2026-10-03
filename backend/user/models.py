from django.db import models

class User(models.Model):
    uuid = models.CharField(max_length=150, unique=True)