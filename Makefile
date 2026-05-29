.PHONY: install format lint test check run

PYTHON=backend/.venv/bin/python
PIP=backend/.venv/bin/pip
BLACK=backend/.venv/bin/black
ISORT=backend/.venv/bin/isort
FLAKE8=backend/.venv/bin/flake8
PYTEST=backend/.venv/bin/pytest

install:
	$(PIP) install -r backend/requirements.txt

format:
	$(BLACK) backend
	$(ISORT) backend

lint:
	$(FLAKE8) --max-line-length=88 --extend-ignore=E203,W503 backend/app.py backend/tests

test:
	cd backend && ../$(PYTEST)

check:
	$(ISORT) --check-only backend
	$(BLACK) --check backend
	$(FLAKE8) --max-line-length=88 --extend-ignore=E203,W503 backend/app.py backend/tests
	cd backend && ../$(PYTEST)

run:
	cd backend && ../$(PYTHON) app.py