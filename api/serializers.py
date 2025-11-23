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
