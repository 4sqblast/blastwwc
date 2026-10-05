from django.db import models

class Merch(models.Model):
    name = models.CharField(max_length=100)
    adult_price = models.PositiveIntegerField()
    child_price = models.PositiveIntegerField()
    image = models.URLField()
    color = models.CharField(max_length=50)

    def __str__(self):
        return f"{self.name} - {self.color}"