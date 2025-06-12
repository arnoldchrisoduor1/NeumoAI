## Creating the migrations.

alembic revision --autogenerate -m "Initial migration"

## To start the server.

uvicorn app.main:app --reload