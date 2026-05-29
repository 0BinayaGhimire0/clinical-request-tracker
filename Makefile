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
	$(FLAKE8) backend/app.py backend/tests

test:
	cd backend && ../$(PYTEST)

check:
	$(BLACK) --check backend
	$(ISORT) --check-only backend
	$(FLAKE8) backend/app.py backend/tests
	cd backend && ../$(PYTEST)

run:
	cd backend && ../$(PYTHON) app.py