from __future__ import annotations

import secrets

from django.utils import timezone
from rest_framework import permissions, serializers, status
from rest_framework.response import Response
from rest_framework.views import APIView
from drf_spectacular.utils import extend_schema

from .models import Token
from .serializers import LoginSerializer, MemberProfileSerializer, RegistrationSerializer


class HelloMessageSerializer(serializers.Serializer):
    """Serializer used only for the hello endpoint."""

    message = serializers.CharField(max_length=200)
    timestamp = serializers.DateTimeField(read_only=True)


class HelloView(APIView):
    """A simple API endpoint that returns a greeting message."""

    @extend_schema(
        responses={200: HelloMessageSerializer}, description="Get a hello world message"
    )
    def get(self, request):
        data = {"message": "Hello!", "timestamp": timezone.now()}
        serializer = HelloMessageSerializer(data)
        return Response(serializer.data)


def _generate_unique_token_key() -> str:
    """Generate a unique token key for the Token model."""

    while True:
        key = secrets.token_hex(20)  # 40-character hexadecimal token
        if not Token.objects.filter(key=key).exists():
            return key


class RegistrationView(APIView):
    """Register a new member and return an authentication token."""

    permission_classes = [permissions.AllowAny]

    @extend_schema(
        request=RegistrationSerializer,
        description="Register a new member and obtain an authentication token.",
    )
    def post(self, request):
        serializer = RegistrationSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        member = serializer.save()

        token_key = _generate_unique_token_key()
        token = Token.objects.create(member=member, key=token_key)

        profile_data = MemberProfileSerializer(member).data
        response_data = {
            "token": token.key,
            "member": profile_data,
        }
        return Response(response_data, status=status.HTTP_201_CREATED)


class LoginView(APIView):
    """Authenticate an existing member and return an authentication token."""

    permission_classes = [permissions.AllowAny]

    @extend_schema(
        request=LoginSerializer,
        description="Log in an existing member and obtain an authentication token.",
    )
    def post(self, request):
        serializer = LoginSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        member = serializer.validated_data["member"]

        # Reuse the latest token if it exists, otherwise create a new one
        token = Token.objects.filter(member=member).order_by("-created_at").first()
        if token is None:
            token_key = _generate_unique_token_key()
            token = Token.objects.create(member=member, key=token_key)

        profile_data = MemberProfileSerializer(member).data
        response_data = {
            "token": token.key,
            "member": profile_data,
        }
        return Response(response_data, status=status.HTTP_200_OK)


class LogoutView(APIView):
    """Log out the current member by deleting their authentication tokens."""

    # Uses default IsAuthenticated permission from REST_FRAMEWORK.

    def post(self, request):
        Token.objects.filter(member=request.user).delete()
        return Response(
            {"detail": "Successfully logged out."},
            status=status.HTTP_200_OK,
        )


class CurrentMemberView(APIView):
    """Return profile information for the currently authenticated member."""

    # Uses default IsAuthenticated permission from REST_FRAMEWORK.

    def get(self, request):
        serializer = MemberProfileSerializer(request.user)
        return Response(serializer.data)
