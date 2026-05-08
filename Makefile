.PHONY: dev front back seed test build up down clean

dev:
	@echo "Lancer 'make front' et 'make back' dans deux terminaux."

front:
	cd frontend && pnpm install && pnpm dev

back:
	cd backend && pip install -r requirements.txt && uvicorn app.main:app --reload --port 8000

seed:
	cd backend && python -m app.scripts.seed

test:
	cd backend && pytest -q

build:
	cd frontend && pnpm build

up:
	docker compose up --build -d

down:
	docker compose down

clean:
	cd frontend && rm -rf node_modules dist
	cd backend && rm -rf __pycache__ .pytest_cache *.db
