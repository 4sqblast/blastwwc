import json

from rest_framework import serializers

from .models import Order, OrderItem
from user.models import User


class OrderItemSerializer(serializers.ModelSerializer):

    class Meta:
        model = OrderItem
        fields = ['merch', 'quantity', 'size', 'color']


class OrderSerializer(serializers.ModelSerializer):

    user = serializers.CharField(source='user.uuid')
    items = serializers.CharField()

    class Meta:
        model = Order
        fields = ['user', 'items', 'recipient', 'receipt']

    def create(self, validated_data):
        items_json = validated_data.pop('items')

        try:
            items_data = json.loads(items_json)
        except json.JSONDecodeError:
            raise serializers.ValidationError({
                'items': 'Invalid JSON.'
            })

        if not isinstance(items_data, list):
            raise serializers.ValidationError({
                'items': 'Items must be a list.'
            })

        user_uuid = validated_data.pop('user')['uuid']

        try:
            user = User.objects.get(uuid=user_uuid)
        except User.DoesNotExist:
            raise serializers.ValidationError({
                'user': 'User does not exist.'
            })

        validated_items = []

        for item_data in items_data:
            item_serializer = OrderItemSerializer(data=item_data)

            if not item_serializer.is_valid():
                raise serializers.ValidationError({
                    'items': item_serializer.errors
                })

            validated_items.append(item_serializer.validated_data)

        order = Order.objects.create(
            user=user,
            **validated_data
        )

        for item_data in validated_items:
            OrderItem.objects.create(
                order=order,
                **item_data
            )

        return order