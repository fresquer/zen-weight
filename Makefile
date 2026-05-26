.PHONY: dev dev-backend dev-frontend stop logs check-env

dev: dev-backend dev-frontend

dev-backend: check-env
	docker compose up -d --scale zenweight=0

dev-frontend:
	npm run dev

stop:
	docker compose down

logs:
	docker compose logs -f

check-env:
	@test -f .env || (echo "Missing .env. Create it with: cp .env.example .env"; exit 1)
