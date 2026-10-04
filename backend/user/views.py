from django.shortcuts import render
from django.conf import settings

import json

from rest_framework.permissions import AllowAny
from rest_framework.decorators import api_view
from rest_framework.generics import CreateAPIView
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status

from pywebpush import webpush, WebPushException

from .serializers import UserSerializer, PushSubscriptionSerializer
from .models import PushSubscription, User





class CreateUserView(CreateAPIView):
    serializer_class = UserSerializer
    permission_classes = [AllowAny]


class PushSubscriptionView(APIView):

    permission_classes = [AllowAny]

    def post(self, request):

        serializer = PushSubscriptionSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        subscription = serializer.validated_data["subscription"]

        user = User.objects.get(uuid=request.data.get("user_id"))

        PushSubscription.objects.update_or_create(
            endpoint=subscription["endpoint"],
            defaults={
                "user": user,
                "p256dh": subscription["keys"]["p256dh"],
                "auth": subscription["keys"]["auth"],
                "active": True,
            },
        )

        return Response(
            {
                "message": "Push subscription saved."
            },
            status=status.HTTP_201_CREATED,
        )



def send_push_notification(subscription, title, body, url="https://blastwwc.vercel.app/", icon="/icon-192.png", badge="/badge-72.png"):
    payload = {
        "title": title,
        "body": body,
        "icon": icon,
        "badge": badge,
        "url": url,
    }

    subscription_info = {
        "endpoint": subscription.endpoint,
        "keys": {
            "p256dh": subscription.p256dh,
            "auth": subscription.auth,
        },
    }

    webpush(
        subscription_info=subscription_info,
        data=json.dumps(payload),
        vapid_private_key=settings.VAPID_PRIVATE_KEY,
        vapid_claims={"sub": settings.VAPID_SUBJECT},
    )


@api_view(["POST"])
def send_push_to_users(request, url="/"):
    title = request.data.get("title")
    body = request.data.get("body")

    if not title or not body:
        return Response(
            {"error": "title and body are required"},
            status=status.HTTP_400_BAD_REQUEST,
        )

    subscriptions = PushSubscription.objects.filter(active=True)

    for subscription in subscriptions:
        try:
            send_push_notification(
                subscription=subscription,
                title=title,
                body=body,
                url=url,
            )

        except WebPushException as error:
            if error.response is not None:
                status_code = error.response.status_code

                if status_code in [404, 410]:
                    subscription.active = False
                    subscription.save(update_fields=["active"])

    return Response(
        {"message": "Push notifications sent."},
        status=status.HTTP_200_OK,
    )