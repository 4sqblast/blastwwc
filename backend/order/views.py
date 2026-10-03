from django.shortcuts import render

from rest_framework.generics import CreateAPIView
from rest_framework.permissions import AllowAny

from .serializers import OrderSerializer

class CreateOrderView(CreateAPIView):
    serializer_class = OrderSerializer
    permission_classes = [AllowAny]

