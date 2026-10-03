from django.shortcuts import render

from rest_framework.generics import ListAPIView 
from rest_framework.permissions import AllowAny

from .serializers import MerchSerializer
from .models import Merch

class MerchListView(ListAPIView):
    queryset = Merch.objects.all()
    serializer_class = MerchSerializer
    permission_classes = [AllowAny]