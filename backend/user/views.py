from django.shortcuts import render

from rest_framework.permissions import AllowAny
from rest_framework.generics import CreateAPIView

from .serializers import UserSerializer

class CreateUserView(CreateAPIView):
    serializer_class = UserSerializer
    permission_classes = [AllowAny]