from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from typing import Dict

from app.api.routes.analyze import router as analyze_router
from app.api.routes.reports import router as reports_router
from app.core.config import settings

app = FastAPI(title=settings.app_name, version='0.1.0')
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.allowed_origins,
    allow_credentials=True,
    allow_methods=['*'],
    allow_headers=['*'],
)

app.mount('/uploads', StaticFiles(directory=str(settings.uploads_dir)), name='uploads')


@app.get('/health')
async def health() -> Dict[str, str]:
    return {'status': 'ok', 'service': settings.app_name}


app.include_router(analyze_router, prefix=settings.api_prefix)
app.include_router(reports_router, prefix=settings.api_prefix)