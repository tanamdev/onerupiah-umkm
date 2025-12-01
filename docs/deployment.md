# Deployment Guide

This project now ships a production-ready Docker image plus a GitHub Actions workflow that publishes to GitHub Container Registry (GHCR). Follow the sections below to go from source to Dokploy.

## 1. Build overview

- `Dockerfile` builds the Next.js app through multi-stage steps (dependency install, build, slim runtime).
- Variables that start with `NEXT_PUBLIC_` are injected at build time through docker build arguments.
- Server-only variables (database, JWT, Duitku, etc.) are kept out of the image and must be supplied by Dokploy as runtime environment variables.

## 2. GitHub Actions workflow

1. Open **Settings -> Secrets and variables -> Actions** in GitHub.
2. Add repository **Variables** for values that can be public at build time:
   - `NEXT_PUBLIC_API_URL`
   - `NEXT_PUBLIC_BASE_URL`
3. Add repository **Secrets** for sensitive client-side values:
   - `NEXT_PUBLIC_GEMINI_API_KEY`
4. Commit to `main` or trigger the workflow manually (`Actions -> Build and Push Docker Image -> Run workflow`). The workflow:
   - Checks out the code and sets up Docker Buildx.
   - Logs in to GHCR using the built-in `GITHUB_TOKEN`.
   - Builds the image with the three build args above and pushes tags `latest` and the commit SHA.

Image reference pattern: `ghcr.io/<github-username>/<repository>:<tag>`. You can confirm pushes under the **Packages** tab in GitHub.

## 3. Dokploy configuration

1. **Registry access**
   - Add a new registry entry in Dokploy pointing to `ghcr.io`.
   - Use your GitHub username and a Personal Access Token that has the `read:packages` scope (create it under GitHub personal settings).

2. **Create the service**
   - Choose "Deploy from Docker image".
   - Enter the GHCR image URI (for example `ghcr.io/onerupiah/onerupiah-umkm:latest`).
   - Set the internal container port to `3000` and expose it behind the desired domain.

3. **Environment variables**
   - Open the service -> **Environment** tab and either paste values manually or use the **Import .env** button.
   - Copy every key/value from your local `.env` except `NODE_ENV` (Dokploy will set `production` automatically).
   - Ensure sensitive entries (`DATABASE_URL`, `JWT_SECRET`, `DUITKU_*`, etc.) live in Dokploy as secrets so they do not ship inside the image.
   - Keep the `NEXT_PUBLIC_*` values in sync with whatever you passed to the GitHub Action build args. If they change, rebuild the image.

4. **Deploy**
   - Trigger a redeploy in Dokploy after each successful image push (Dokploy can auto-pull or you can press "Deploy" manually).
   - Check the logs tab to verify the Next.js server starts and Prisma connects to the database.

Tip: server-side environment values can be updated in Dokploy and take effect on the next deploy without rebuilding the container. Client-side values require a new GitHub Action build so the assets are re-generated with the new strings.
