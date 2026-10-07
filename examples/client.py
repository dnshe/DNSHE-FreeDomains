import json
import urllib.error
import urllib.parse
import urllib.request


class DNSHEError(RuntimeError):
    def __init__(self, status, payload):
        super().__init__(payload.get("message") or payload.get("error") or f"HTTP {status}")
        self.status = status
        self.code = payload.get("error_code")
        self.details = payload.get("details")


class DNSHEClient:
    def __init__(self, base_url, api_key, api_secret, timeout=15):
        if urllib.parse.urlsplit(base_url).scheme != "https":
            raise ValueError("HTTPS is required")
        if not api_key or not api_secret:
            raise ValueError("API credentials are required")
        self.base_url = base_url
        self.api_key = api_key
        self.api_secret = api_secret
        self.timeout = timeout

    def request(self, endpoint, action=None, method="GET", data=None):
        parts = urllib.parse.urlsplit(self.base_url)
        query = dict(urllib.parse.parse_qsl(parts.query))
        query.update(m="domain_hub", endpoint=endpoint)
        query.pop("action", None)
        if action is not None:
            query["action"] = action
        headers = {"X-API-Key": self.api_key, "X-API-Secret": self.api_secret}
        body = None
        if method == "GET":
            query.update(data or {})
        else:
            headers["Content-Type"] = "application/json"
            body = json.dumps(data or {}).encode("utf-8")
        url = urllib.parse.urlunsplit(parts._replace(query=urllib.parse.urlencode(query)))
        request = urllib.request.Request(url, data=body, headers=headers, method=method)
        try:
            class NoRedirect(urllib.request.HTTPRedirectHandler):
                def redirect_request(self, req, fp, code, msg, headers, newurl):
                    return None

            with urllib.request.build_opener(NoRedirect()).open(request, timeout=self.timeout) as response:
                status, raw = response.status, response.read()
        except urllib.error.HTTPError as error:
            with error:
                status, raw = error.code, error.read()
        try:
            result = json.loads(raw)
        except (ValueError, UnicodeError) as error:
            raise RuntimeError(f"Invalid JSON response (HTTP {status})") from error
        if not isinstance(result, dict):
            raise RuntimeError(f"Expected a JSON object (HTTP {status})")
        if not 200 <= status < 300 or result.get("success") is False:
            raise DNSHEError(status, result)
        return result
