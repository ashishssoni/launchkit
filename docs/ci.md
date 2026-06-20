# CI Workflow

LaunchKit includes a GitHub Actions workflow at `.github/workflows/ci.yml`.

## What it does

- installs dependencies
- generates Prisma client
- pushes schema to PostgreSQL
- seeds demo data
- runs typecheck
- runs production build

## Why it matters

This gives clients and collaborators confidence that the repository is:

- reproducible
- buildable in CI
- structured for team workflows
- ready for iterative development on `dev` and `main`
