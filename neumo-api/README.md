## Creating the migrations.

alembic revision --autogenerate -m "description of the new changes"

## Reviewing the generating the swl without executing it.

alembic upgrade head --sql

## applying the migration file after reviewing.

alembic upgrade head

## To start the server.

uvicorn app.main:app --reload

updates