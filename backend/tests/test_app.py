import sys
from pathlib import Path

sys.path.append(str(Path(__file__).resolve().parents[1]))

from app import app  # noqa: E402


def test_get_requests_endpoint():
    client = app.test_client()
    response = client.get("/requests")

    assert response.status_code == 200
