# Docker Guide

This repository includes containerized workflows for production, development, and test execution.

## Files

- `Dockerfile` — production multi-stage build that compiles the Angular app and serves it with Nginx on port `8080`.
- `Dockerfile.dev` — development container that installs dependencies and launches the Angular dev server on port `4200`.
- `compose.yaml` — local Compose configuration for production, development, and test services.

## Services

### ng-arch-prod

Builds the production image from `Dockerfile` and serves the compiled app using Nginx.

- Port: `8080:8080`
- Recommended command:

```bash
docker compose -f compose.yaml up --build ng-arch-prod
```

- Open: `http://localhost:8080`

### ng-arch-dev

Starts a live development container using `Dockerfile.dev`.

- Port: `4200:4200`
- Recommended command:

```bash
docker compose -f compose.yaml up --build ng-arch-dev
```

- The container runs `npm start -- --host=0.0.0.0` so the dev server is accessible from the host.

### angular-test

Runs the Angular test command inside the development container.

- Recommended command:

```bash
docker compose -f compose.yaml run --rm angular-test
```

## How the Dockerfiles work

### `Dockerfile`

- Uses `node:25.8.2-alpine` for a small build environment.
- Installs dependencies with `npm ci` and caches the npm folder.
- Builds the Angular application into `dist/ng-arch/browser`.
- Copies the compiled output into the `dhi.io/nginx:1.28.0-alpine3.21-dev` image.
- Serves the application with a custom `nginx.conf` on port `8080`.

### `Dockerfile.dev`

- Uses `node:25.8.2-alpine` in development mode.
- Installs dependencies with `npm install`.
- Starts the Angular dev server with live reload.
- Exposes port `4200` and binds to `0.0.0.0`.

## Notes

- Use `docker compose` rather than the deprecated `docker-compose` command.
- Ensure you are in the repository root when running commands.
- If the development service supports file sync, source changes should be reflected automatically in the running container.

## Cleanup

Stop and remove containers created by Compose:

```bash
docker compose -f compose.yaml down
```
