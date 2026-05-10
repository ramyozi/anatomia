import logging
from contextlib import asynccontextmanager

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.middleware.gzip import GZipMiddleware

from app.api import (
    admin,
    countries,
    diseases,
    glossary,
    organs,
    quiz,
    search,
    stats,
    world,
)
from app.config import get_settings
from app.db import init_db


log = logging.getLogger("anatomia")


@asynccontextmanager
async def lifespan(app: FastAPI):  # noqa: ARG001
    settings = get_settings()
    logging.basicConfig(
        level=logging.INFO if settings.app_env == "production" else logging.DEBUG,
        format="%(asctime)s %(levelname)s %(name)s %(message)s",
    )
    log.info("anatomia starting up (env=%s)", settings.app_env)
    init_db()
    log.info("database initialized")
    yield
    log.info("anatomia shutting down")


def create_app() -> FastAPI:
    settings = get_settings()
    app = FastAPI(
        title="Anatomia API",
        description="API du corps humain, des maladies et de la santé mondiale.",
        version="0.1.0",
        lifespan=lifespan,
    )
    app.add_middleware(
        CORSMiddleware,
        allow_origins=settings.cors_origin_list,
        allow_credentials=True,
        allow_methods=["*"],
        allow_headers=["*"],
    )
    # Compress JSON responses past 1 KB — saves a lot on /diseases,
    # /stats, /organs which return larger payloads.
    app.add_middleware(GZipMiddleware, minimum_size=1024)

    app.include_router(organs.router, prefix="/api/organs", tags=["organs"])
    app.include_router(diseases.router, prefix="/api/diseases", tags=["diseases"])
    app.include_router(countries.router, prefix="/api/countries", tags=["countries"])
    app.include_router(world.router, prefix="/api/world", tags=["world"])
    app.include_router(stats.router, prefix="/api/stats", tags=["stats"])
    app.include_router(glossary.router, prefix="/api/glossary", tags=["glossary"])
    app.include_router(quiz.router, prefix="/api/quiz", tags=["quiz"])
    app.include_router(search.router, prefix="/api/search", tags=["search"])
    app.include_router(admin.router, prefix="/api/admin", tags=["admin"])

    @app.get("/api/health", tags=["meta"])
    def health() -> dict[str, str]:
        return {"status": "ok", "version": "0.1.0"}

    return app


app = create_app()
