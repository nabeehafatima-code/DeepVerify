# DeepVerify FastAPI backend

This backend owns upload validation, image preprocessing, inference orchestration, and response shaping. The React app calls it through `VITE_API_BASE_URL`.

## Start

From the project root (`deepverify`), run:

```powershell
python -m uvicorn app.main:app --app-dir backend --reload --port 8000
```

Alternatively, when the `backend` folder is the current directory, omit `--app-dir backend`:

```powershell
cd backend
python -m uvicorn app.main:app --reload --port 8000
```

For a new environment, install dependencies first with `python -m pip install -r backend/requirements.txt`. Set `DEEPFAKE_MODEL_ID` after reviewing the checkpoint and its labels/license.

Check `GET http://localhost:8000/health`. `POST /api/analyze/image` returns `503` until `DEEPFAKE_MODEL_ID` is configured. This is intentional: the API never invents confidence values when no detector is available.

## Model boundary

`app/services/inference_service.py` loads a configured Hugging Face image-classification checkpoint on CPU and maps its class scores to the stable DeepVerify response. The route does not contain model logic. The checkpoint must expose labels that clearly map to `real`/`authentic` and `fake`/`deepfake`/`synthetic`/`manipulated`; otherwise the service fails instead of guessing.

The current recommendation is to evaluate a detector-specific ViT/ConvNeXt checkpoint from a reputable source, such as a Hugging Face deepfake-vs-real image classifier, only after verifying its model card, training/evaluation datasets, preprocessing resolution, CPU behavior, and license. No checkpoint is bundled or downloaded by this repository, so no performance or license claim is made here. Detector confidence is a model score, not proof of authenticity, and is sensitive to dataset shift, compression, image provenance, and out-of-distribution content.

## Endpoints

- `GET /health`
- `POST /api/analyze/image` with multipart field `file`
- `GET /api/reports`
- `GET /api/reports/{verification_id}`
- `GET /api/reports/{verification_id}/download` returns a generated PDF
- `DELETE /api/reports/{verification_id}`
- `POST /api/analyze/video` currently returns `501`
- `POST /api/analyze/audio` currently returns `501`
