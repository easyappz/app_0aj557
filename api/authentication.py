from typing import Optional, Tuple

from django.utils.translation import gettext_lazy as _
from rest_framework import authentication, exceptions

from .models import Member, Token


class MemberTokenAuthentication(authentication.BaseAuthentication):
    """Token-based authentication using the custom Member and Token models.

    Expected Authorization header format::

        Token <token_key>
    """

    keyword = "Token"

    def authenticate(self, request) -> Optional[Tuple[Member, None]]:
        auth_header = request.headers.get("Authorization")
        if not auth_header or not isinstance(auth_header, str):
            return None

        auth_header = auth_header.strip()
        if not auth_header:
            return None

        parts = auth_header.split(" ", 1)
        if len(parts) != 2:
            return None

        keyword, key = parts[0], parts[1].strip()
        if keyword != self.keyword or not key:
            return None

        try:
            token = Token.objects.select_related("member").get(key=key)
        except Token.DoesNotExist:
            raise exceptions.AuthenticationFailed(_("Invalid authentication token."))

        # DRF will treat the returned member as request.user
        return (token.member, None)

    def authenticate_header(self, request) -> str:
        """Return value for the WWW-Authenticate header on 401 responses."""

        return self.keyword
