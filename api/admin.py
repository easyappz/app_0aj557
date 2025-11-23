from django.contrib import admin

from .models import Member, Token, Message


@admin.register(Member)
class MemberAdmin(admin.ModelAdmin):
    """Admin configuration for the custom Member model."""

    list_display = ("id", "username", "created_at")
    search_fields = ("username",)
    ordering = ("-created_at",)


@admin.register(Token)
class TokenAdmin(admin.ModelAdmin):
    """Admin configuration for API authentication tokens."""

    list_display = ("key", "member", "created_at")
    search_fields = ("key", "member__username")
    ordering = ("-created_at",)


@admin.register(Message)
class MessageAdmin(admin.ModelAdmin):
    """Admin configuration for chat messages."""

    list_display = ("id", "sender", "created_at")
    search_fields = ("sender__username", "text")
    ordering = ("-created_at",)
