import torch
import numpy as np
from transformers import CLIPProcessor, CLIPModel
from PIL import Image

# load CLIP
model = CLIPModel.from_pretrained('openai/clip-vit-base-patch32')
processor = CLIPProcessor.from_pretrained('openai/clip-vit-base-patch32')

model.eval()

def get_clip_embedding(image):
    if isinstance(image, np.ndarray):
        image = Image.fromarray(image)

    inputs = processor(images=image, return_tensors='pt')
    with torch.no_grad():
        features = model.get_image_features(**inputs)

    if not isinstance(features, torch.Tensor):
        features = features.pooler_output

    # normalize embeddings
    features = features / features.norm(dim=-1, keepdim=True)
    embedding = features.cpu().numpy().flatten()

    return embedding