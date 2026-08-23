# Image detector selection record

## Recommendation before download

Use a detector-specific image-classification checkpoint with an explicit `real` and `fake` (or equivalent) label mapping. A ViT or ConvNeXt checkpoint published with a complete model card is a reasonable starting architecture because the adapter can consume standard image-classification logits and run on CPU.

Selected checkpoint: `dima806/deepfake_vs_real_image_detection` from Hugging Face. Its model card identifies it as an Apache-2.0 licensed image-classification model fine-tuned from `google/vit-base-patch16-224-in21k`; its config maps label `0` to `Real` and label `1` to `Fake`. The model has 85.8M FP32 parameters and uses a 224 x 224 RGB input.

## Required review checklist

1. Confirm the checkpoint is pretrained and detector-specific, not a generic ImageNet classifier.
2. Record the exact datasets and evaluation protocol from the model card; do not transfer reported accuracy to this application.
3. Confirm image preprocessing, channel order, crop, and resolution.
4. Run a CPU smoke test with representative images and measure latency.
5. Confirm the license permits a student hackathon demonstration and retain the license text.
6. Disclose dataset shift, compression, post-processing, unknown generators, and false-positive/false-negative risk.
7. Treat the returned score as calibrated evidence only if calibration was demonstrated for the target distribution. Otherwise it is a relative model score, not a probability of truth.

The model card reports evaluation on 76,161 examples with a 0.9927 accuracy, but that is the publisher's benchmark result and is not a guarantee for DeepVerify. It explicitly warns that the data is about three years old and subject to concept drift. Scores are model scores, not proof of authenticity, and performance may degrade on newer generators, non-face imagery, compression, edits, or distribution shift.

The checkpoint is pretrained/fine-tuned for real-vs-fake AI-generated image detection, supports CPU inference through Transformers/PyTorch, and is suitable for a student prototype under Apache-2.0. Set `DEEPFAKE_MODEL_ID` and `MODEL_VERSION` in `backend/.env`.
