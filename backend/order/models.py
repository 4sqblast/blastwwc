from django.db import models
from merch.models import Merch
from user.models import User

class Order(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='user_orders')
    recipient = models.CharField(max_length=100)
    receipt = models.URLField()
    timestamp = models.DateField(auto_now_add=True)

class OrderItem(models.Model):
    order = models.ForeignKey(Order, on_delete=models.CASCADE, related_name='items')
    merch = models.ForeignKey(Merch, on_delete=models.CASCADE, related_name='order_items')
    size = models.CharField(max_length=50)
    color = models.CharField(max_length=50)
    quantity = models.IntegerField(default=1)