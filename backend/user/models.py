from django.db import models

class User(models.Model):
    uuid = models.CharField(max_length=150, unique=True)


class PushSubscription(models.Model):
    user = models.ForeignKey( User, on_delete=models.CASCADE, related_name="push_subscriptions")
    endpoint = models.URLField(unique=True)
    p256dh = models.TextField()
    auth = models.TextField()
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    active = models.BooleanField(default=True)

    def __str__(self):
        return f"{self.user} - {self.endpoint[:50]}"