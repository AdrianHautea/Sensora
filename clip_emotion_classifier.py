import os
import torch
import numpy as np
import joblib
from PIL import Image
from tqdm import tqdm
from transformers import CLIPProcessor, CLIPModel
from sklearn.linear_model import LogisticRegression
from sklearn.model_selection import train_test_split
from sklearn.metrics import classification_report, confusion_matrix

# Load CLIP
model = CLIPModel.from_pretrained('openai/clip-vit-base-patch32')
processor = CLIPProcessor.from_pretrained('openai/clip-vit-base-patch32')

model.eval()

# Dataset path
DATASET_PATH = 'dataset'

# Emotion labels
EMOTIONS = [
    'confused',
    'focused',
    'frustrated',
    'bored',
    'drowsy',
    'looking_away'
]

emotion_to_index = {e: i for i, e in enumerate(EMOTIONS)}

# CLIP embedding extraction
def get_embeddings_batch(image_paths, batch_size=32):

    embeddings = []

    for i in tqdm(range(0, len(image_paths), batch_size)):

        batch_paths = image_paths[i:i+batch_size]
        images = [Image.open(p).convert('RGB') for p in batch_paths]
        inputs = processor(images=images, return_tensors='pt')

        with torch.no_grad():
            features = model.get_image_features(**inputs)

        if not isinstance(features, torch.Tensor):
            features = features.pooler_output

        # normalize CLIP embeddings
        features = features / features.norm(dim=-1, keepdim=True)
        embeddings.extend(features.cpu().numpy())

    return np.array(embeddings)

# Load dataset
print('Scanning dataset...')

image_paths = []
labels = []

for root, dirs, files in os.walk(DATASET_PATH):

    label_name = root.split(os.sep)[-1]
    if label_name not in emotion_to_index:
        continue

    for file in files:
        if not file.lower().endswith(('png', 'jpg', 'jpeg')):
            continue

        path = os.path.join(root, file)
        image_paths.append(path)
        labels.append(emotion_to_index[label_name])

labels = np.array(labels)
print('Total images:', len(image_paths))

# Extract CLIP embeddings
print('Extracting CLIP embeddings...')

X = get_embeddings_batch(image_paths, batch_size=32)
y = labels

print('Embedding shape:', X.shape)

# Train / test split
X_train, X_test, y_train, y_test = train_test_split(
    X,
    y,
    test_size=0.2,
    random_state=42,
    stratify=y
)

# Train classifier
print('Training emotion classifier...')

clf = LogisticRegression(
    max_iter=4000,
    C=1.5,
    solver='lbfgs',
    class_weight='balanced'
)

clf.fit(X_train, y_train)

# Evaluation
pred = clf.predict(X_test)

print('\nEmotion Classification Report')
print('--------------------------------')

print(classification_report(
    y_test,
    pred,
    target_names=EMOTIONS
))

print('\nConfusion Matrix')
print(confusion_matrix(y_test, pred))

# Save classifier
os.makedirs('models', exist_ok=True)

joblib.dump(clf, 'models/emotion_classifier.pkl')

print('\nEmotion classifier saved to models/emotion_classifier.pkl')