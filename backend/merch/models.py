from django.db import models

class Merch(models.Model):
    name = models.CharField(max_length=100)
    adult_price_normal = models.PositiveIntegerField()
    adult_price_stonewash = models.PositiveIntegerField(default=16000)
    child_price_1_5 = models.PositiveIntegerField(default=5000)
    child_price_6_10 = models.PositiveIntegerField(default=6000)
    image = models.URLField()
    color = models.CharField(max_length=50)

    def __str__(self):
        return f"{self.name} - {self.color}"