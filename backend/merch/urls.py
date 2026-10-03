from django.urls import path

from .views import MerchListView

urlpatterns = [
    path('list/', MerchListView.as_view(), name='merch-list')
]