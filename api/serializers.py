from django.contrib.auth.hashers import make_password
from rest_framework import serializers

from .models import Member, Message


class MemberSerializer(serializers.ModelSerializer):
    """Basic serializer for the Member model.

    Used for exposing public member information. Does not expose password hashes.
    """

    class Meta:
        model = Member
        fields = ["id", "username", "created_at"]
        read_only_fields = ["id", "created_at"]


class MessageSerializer(serializers.ModelSerializer):
    """Serializer for chat messages in the group chat."""

    sender_username = serializers.CharField(
        source="sender.username",
        read_only=True,
    )

    class Meta:
        model = Message
        fields = ["id", "text", "created_at", "sender_username"]
        read_only_fields = ["id", "created_at", "sender_username"]


class RegistrationSerializer(serializers.Serializer):
    """Serializer used to register a new member."""

    username = serializers.CharField(max_length=150)
    password = serializers.CharField(write_only=True, trim_whitespace=False)

    def validate_username(self, value: str) -> str:
        if Member.objects.filter(username=value).exists():
            raise serializers.ValidationError(
                "A member with this username already exists."
            )
        return value

    def create(self, validated_data):
        username = validated_data["username"]
        raw_password = validated_data["password"]
        hashed_password = make_password(raw_password)
        member = Member.objects.create(username=username, password=hashed_password)
        return member


class LoginSerializer(serializers.Serializer):
    """Serializer used to authenticate an existing member."""

    username = serializers.CharField()
    password = serializers.CharField(write_only=True, trim_whitespace=False)

    def validate(self, attrs):
        username = attrs.get("username")
        password = attrs.get("password")

        if not username or not password:
            raise serializers.ValidationError(
                "Both username and password are required."
            )

        try:
            member = Member.objects.get(username=username)
        except Member.DoesNotExist:
            raise serializers.ValidationError("Invalid username or password.")

        if not member.check_password(password):
            raise serializers.ValidationError("Invalid username or password.")

        # Attach the member instance for use in the view
        attrs["member"] = member
        return attrs


class MemberProfileSerializer(serializers.ModelSerializer):
    """Read-only serializer for the current authenticated member profile."""

    class Meta:
        model = Member
        fields = ["id", "username", "created_at"]
        read_only_fields = ["id", "username", "created_at"]
