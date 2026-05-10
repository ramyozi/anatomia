# syntax=docker/dockerfile:1.6
#
# Production image for the Anatomia FastAPI backend.
#
# Two stages:
#  1. ``builder`` installs Python deps into a wheel cache so the runtime
#     stage doesn't carry compiler toolchains.
#  2. ``runtime`` ships a slim image with the wheels, the ``app`` package,
#     the static seed data and the migration / seed scripts. Uvicorn is
#     launched as a non-root user and a healthcheck pings ``/api/health``.

############################
# Stage 1 — build wheels   #
############################
FROM python:3.11-slim AS builder

ENV PYTHONDONTWRITEBYTECODE=1 \
    PYTHONUNBUFFERED=1 \
    PIP_NO_CACHE_DIR=1 \
    PIP_DISABLE_PIP_VERSION_CHECK=1

WORKDIR /build

# libpq-dev / gcc are only needed when ``psycopg2-binary`` falls back to a
# source install on exotic platforms. We don't carry them into the runtime
# image.
RUN apt-get update \
 && apt-get install -y --no-install-recommends gcc libpq-dev \
 && rm -rf /var/lib/apt/lists/*

COPY requirements.txt ./
RUN pip wheel --wheel-dir /wheels -r requirements.txt


############################
# Stage 2 — runtime        #
############################
FROM python:3.11-slim AS runtime

ENV PYTHONDONTWRITEBYTECODE=1 \
    PYTHONUNBUFFERED=1 \
    PIP_NO_CACHE_DIR=1 \
    PIP_DISABLE_PIP_VERSION_CHECK=1 \
    APP_ENV=production \
    DATABASE_URL=sqlite:///./anatomia.db

WORKDIR /app

# ``curl`` is used by the healthcheck below. It's small enough to keep.
RUN apt-get update \
 && apt-get install -y --no-install-recommends curl \
 && rm -rf /var/lib/apt/lists/* \
 && addgroup --system --gid 1001 anatomia \
 && adduser --system --uid 1001 --ingroup anatomia anatomia

COPY --from=builder /wheels /wheels
COPY requirements.txt ./
RUN pip install --no-index --find-links /wheels -r requirements.txt \
 && rm -rf /wheels

COPY app ./app
# Ship the pre-seeded SQLite catalogue with the image so a cold start on
# the free tier (no persistent disk) already has all organs / diseases /
# countries / glossary loaded. The .dockerignore explicitly allows
# anatomia.db through.
COPY anatomia.db ./anatomia.db
COPY docker-entrypoint.sh /usr/local/bin/docker-entrypoint.sh

# Persistent SQLite database can live under /data when a Disk is attached
# (paid plan); the entrypoint copies the baked-in seed there on first run.
RUN mkdir -p /data \
 && chmod +x /usr/local/bin/docker-entrypoint.sh \
 && chown -R anatomia:anatomia /app /data

USER anatomia

EXPOSE 8000

HEALTHCHECK --interval=30s --timeout=5s --start-period=20s --retries=3 \
  CMD curl -fsS http://127.0.0.1:8000/api/health || exit 1

ENTRYPOINT ["/usr/local/bin/docker-entrypoint.sh"]
CMD ["uvicorn", "app.main:app", \
     "--host", "0.0.0.0", \
     "--port", "8000", \
     "--proxy-headers", \
     "--forwarded-allow-ips", "*", \
     "--access-log", \
     "--log-level", "info"]
