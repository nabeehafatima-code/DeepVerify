from pathlib import Path

from pydantic_settings import BaseSettings, SettingsConfigDict


BACKEND_DIR = Path(__file__).resolve().parents[2]
ENV_FILE = BACKEND_DIR / '.env'


class Settings(BaseSettings):
    model_config = SettingsConfigDict(env_file=ENV_FILE, extra='ignore')

    app_name: str = 'DeepVerify API'
    api_prefix: str = '/api'
    cors_origins: str = 'http://localhost:3000'
    max_image_size_mb: int = 25
    max_video_size_mb: int = 100
    max_audio_size_mb: int = 25
    deepfake_model_id: str = ''
    model_version: str = 'unconfigured'
    uploads_dir: Path = BACKEND_DIR / 'uploads'
    model_dataset_label: str = (
        "Not independently verified by DeepVerify — see backend/MODEL_SELECTION.md "
        "for the checkpoint publisher's reported training data."
    )

    @property
    def allowed_origins(self) -> list[str]:
        return [origin.strip() for origin in self.cors_origins.split(',') if origin.strip()]


settings = Settings()
settings.uploads_dir.mkdir(parents=True, exist_ok=True)