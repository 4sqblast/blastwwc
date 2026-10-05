from django.db import models
from merch.models import Merch
from user.models import User

class Order(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='user_orders')
    recipient = models.CharField(max_length=100)
    contact = models.CharField(max_length=20, null=True)
    receipt = models.URLField()
    timestamp = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"Order #{self.id} - {self.recipient} - {self.contact}"

class OrderItem(models.Model):
    order = models.ForeignKey(Order, on_delete=models.CASCADE, related_name='items')
    merch = models.ForeignKey(Merch, on_delete=models.CASCADE, related_name='order_items')
    size = models.CharField(max_length=50)
    color = models.CharField(max_length=50)
    quantity = models.IntegerField(default=1)

    def __str__(self):
        return f"{self.quantity} × {self.merch.name} ({self.size}, {self.color})"