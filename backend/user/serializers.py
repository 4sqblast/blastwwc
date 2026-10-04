from rest_framework import serializers

from .models import User, PushSubscription

class UserSerializer(serializers.ModelSerializer):

    class Meta:
        model = User
        fields = ['uuid']

    def create(self, validated_data):

        user, created = User.objects.get_or_create(
            uuid=validated_data['uuid']
        )

        if not created:
            print(f"User {user.uuid} already exists.")

        return user

class PushSubscriptionSerializer(serializers.Serializer):
    subscription = serializers.JSONField()