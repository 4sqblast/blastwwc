from django.urls import path

from .views import CreateUserView, PushSubscriptionView, send_push_to_users

urlpatterns = [
    path('create/', CreateUserView.as_view(), name='create-user'),
    path('push/subscribe/', PushSubscriptionView.as_view(), name='create-sub'),
    path('push/send/', send_push_to_users, name='send-push'),
]