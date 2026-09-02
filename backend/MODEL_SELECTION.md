# Image detector selection record

## Recommendation before download

Use a detector-specific image-classification checkpoint with an explicit `real` and `fake` (or equivalent) label mapping. A ViT or ConvNeXt checkpoint published with a complete model card is a reasonable starting architecture because the adapter can consume standard image-classification logits and run on CPU.

Selected checkpoint: `umm-maybe/AI-image-detector` from Hugging Face. Its model card identifies it as a CC BY-ND 4.0 Swin image-classification model with labels `artificial` and `human`. It uses a 224 x 224 RGB input with ImageNet normalization. The model card warns that it was created in 2022 for artistic imagery and does not cover newer generators such as SDXL or DALL-E 3, so this selection is based on DeepVerify's controlled benchmark rather than the publisher's score.

## Required review checklist

1. Confirm the checkpoint is pretrained and detector-specific, not a generic ImageNet classifier.
2. Record the exact datasets and evaluation protocol from the model card; do not transfer reported accuracy to this application.
3. Confirm image preprocessing, channel order, crop, and resolution.
4. Run a CPU smoke test with representative images and measure latency.
5. Confirm the license permits a student hackathon demonstration and retain the license text.
6. Disclose dataset shift, compression, post-processing, unknown generators, and false-positive/false-negative risk.
7. Treat the returned score as calibrated evidence only if calibration was demonstrated for the target distribution. Otherwise it is a relative model score, not a probability of truth.

The selected model's published validation metrics are not a guarantee for DeepVerify. The model card warns that its 2022 training data does not include newer generators such as SDXL or DALL-E 3. Scores are model scores, not proof of authenticity, and performance may degrade on newer generators, non-artistic imagery, compression, edits, or distribution shift.

The checkpoint is pretrained/fine-tuned for AI-generated-versus-human image detection, supports CPU inference through Transformers/PyTorch, and is used under its CC BY-ND 4.0 terms. Set `DEEPFAKE_MODEL_ID` and `MODEL_VERSION` in `backend/.env`.

## Controlled comparison baseline

The current and candidate checkpoints were compared with compatible Hugging Face image classifiers on the same 60-image Tiny-GenImage subset (30 real and 30 generated images), using each model's native processor and an explicit label mapping. The production threshold remains 0.5.

| Checkpoint | Architecture | Accuracy | Fake recall | F1 | FP | FN |
| --- | --- | ---: | ---: | ---: | ---: | ---: |
| `umm-maybe/AI-image-detector` | Swin | 65% | 60% | 63.16% | 9 | 12 |
| `dima806/deepfake_vs_real_image_detection` | ViT | 53.33% | 43.33% | 48.15% | 11 | 17 |
| `Ateeqq/ai-vs-human-image-detector` | SigLIP | 56.67% | 33.33% | 43.48% | 6 | 20 |
| `NYUAD-ComNets/NYUAD_AI-generated_images_detector` | ViT, `dalle`/`sd` aggregated as fake | 60% | 30% | 42.86% | 3 | 21 |

The Swin checkpoint is now selected because it reduced false negatives from 17 to 12 and improved fake recall from 43.33% to 60% on the expanded benchmark. Its scores are direct softmax model scores, not calibrated probabilities or proof of authenticity. Run `python diagnose_image_model.py` to save raw logits and production-path predictions to `results/image_model_diagnostic.json`.
