# syntax=docker/dockerfile:1.6
#
# Production image for the Anatomia frontend.
#
# Vite is built once in a Node image then the static bundle (and the
# BodyParts3D ``.glb`` assets) are copied into a tiny nginx-alpine
# runtime. The runtime nginx mounts the prod ``nginx.conf`` so it can
# reverse-proxy ``/api`` to the backend service inside the same compose
# network and serve the SPA fallback.

############################
# Stage 1 — dependencies   #
############################
# Node 22 (current LTS): the build toolchain (rollup / vite / tsc)
# references the ``node:sqlite`` builtin, which only exists on Node
# >= 22.5. Building on node:20 fails early with
# ``ERR_UNKNOWN_BUILTIN_MODULE: No such built-in module: node:sqlite``.
# Local dev and CI both run Node 22, so the image must match.
FROM node:22-alpine AS deps

WORKDIR /app
RUN corepack enable && corepack prepare pnpm@9.12.2 --activate

COPY package.json pnpm-lock.yaml* ./
# Strict install: the lockfile must be in sync. The previous
# ``|| pnpm install`` fallback silently produced non-reproducible builds
# whenever the lockfile drifted — fail loudly instead.
RUN --mount=type=cache,id=pnpm,target=/root/.local/share/pnpm/store \
    pnpm install --frozen-lockfile


############################
# Stage 2 — build          #
############################
FROM node:22-alpine AS build

# CI=true stops pnpm from prompting for an interactive node_modules
# purge (ERR_PNPM_ABORTED_REMOVE_MODULES_DIR_NO_TTY) inside the build.
ENV NODE_ENV=production \
    VITE_API_BASE_URL=/api \
    CI=true

WORKDIR /app
# Pin the SAME pnpm as the deps stage. Without an explicit prepare,
# corepack would fetch the latest pnpm (11.x); a pnpm-11 run against a
# node_modules tree created by pnpm-9 triggers a full purge + reinstall.
RUN corepack enable && corepack prepare pnpm@9.12.2 --activate
COPY --from=deps /app/node_modules ./node_modules
COPY . .
RUN pnpm build


############################
# Stage 3 — runtime nginx  #
############################
FROM nginx:1.27-alpine AS runtime

# Drop the default config and rely on ours (mounted by compose so we can
# tweak headers / hosts without rebuilding the image).
RUN rm /etc/nginx/conf.d/default.conf \
 && apk add --no-cache curl

# Pre-bake the bundle. compose can still override ``/usr/share/nginx/html``
# with a bind mount if we want to swap builds without rebuilding.
COPY --from=build /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80

HEALTHCHECK --interval=30s --timeout=5s --start-period=10s --retries=3 \
  CMD curl -fsS http://127.0.0.1/ -o /dev/null || exit 1

CMD ["nginx", "-g", "daemon off;"]
