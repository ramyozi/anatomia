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
FROM node:20-alpine AS deps

WORKDIR /app
RUN corepack enable && corepack prepare pnpm@9.12.2 --activate

COPY package.json pnpm-lock.yaml* ./
RUN --mount=type=cache,id=pnpm,target=/root/.local/share/pnpm/store \
    pnpm install --frozen-lockfile || pnpm install


############################
# Stage 2 — build          #
############################
FROM node:20-alpine AS build

ENV NODE_ENV=production \
    VITE_API_BASE_URL=/api

WORKDIR /app
RUN corepack enable
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
