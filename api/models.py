from django.db import models
from django.contrib.auth.hashers import check_password as django_check_password
from django.contrib.auth.hashers import make_password as django_make_password


class Member(models.Model):
    """Custom member model used for authentication and chat.

    This model is intentionally separate from Django's built-in User model.
    Passwords must always be stored as Django-hashed values.
    """

    username = models.CharField(max_length=150, unique=True)
    password = models.CharField(
        max_length=128,
        help_text="Hashed password, generated using Django's password hashing utilities.",
    )
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ["id"]

    def __str__(self) -> str:  # pragma: no cover - trivial representation
        return self.username

    def set_password(self, raw_password: str) -> None:
        """Set the member password using Django's password hashing utilities."""
        self.password = django_make_password(raw_password)

    def check_password(self, raw_password: str) -> bool:
        """Validate a raw password against the stored hash."""
        return django_check_password(raw_password, self.password)


class Token(models.Model):
    """Simple token model used for authenticating API requests for a Member."""

    key = models.CharField(max_length=64, unique=True)
    member = models.ForeignKey(
        Member,
        on_delete=models.CASCADE,
        related_name="tokens",
    )
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ["-created_at"]

    def __str__(self) -> str:  # pragma: no cover - trivial representation
        return f"Token for {self.member.username}"


class Message(models.Model):
    """Chat message posted by a member into the global group chat."""

    sender = models.ForeignKey(
        Member,
        on_delete=models.CASCADE,
        related_name="messages",
    )
    text = models.TextField()
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ["created_at"]

    def __str__(self) -> str:  # pragma: no cover - trivial representation
        preview = self.text[:30]
        if len(self.text) > 30:
            preview += "..."
        return f"Message from {self.sender.username}: {preview}"


# Migrations for these models can be generated with:
#   python manage.py makemigrations api
#   python manage.py migrate
