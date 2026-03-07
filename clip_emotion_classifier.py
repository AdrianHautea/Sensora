import os
from PIL import Image
import torch
from transformers import CLIPProcessor, CLIPModel
from sklearn.linear_model import LogisticRegression
from sklearn.model_selection import train_test_split
from sklearn.metrics import classification_report
from sklearn.metrics import accuracy_score, f1_score, precision_score, recall_score, confusion_matrix
import numpy as np
import joblib
from tqdm import tqdm

# load CLIP model
model = CLIPModel.from_pretrained('openai/clip-vit-base-patch32')
processor = CLIPProcessor.from_pretrained('openai/clip-vit-base-patch32')

model.eval()

# dataset path
DATASET_PATH = 'dataset'

# label mapping
ENGAGED = ['confused', 'focused', 'frustrated']
NOT_ENGAGED = ['bored', 'drowsy', 'looking_away']


# function to extract CLIP embeddings
def get_embeddings_batch(image_paths, batch_size=32):
    embeddings = []
    for i in tqdm(range(0, len(image_paths), batch_size)):
        batch_paths = image_paths[i:i+batch_size]

        images = []
        for path in batch_paths:
            img = Image.open(path).convert('RGB')
            images.append(img)

        inputs = processor(images=images, return_tensors='pt')
        with torch.no_grad():
            features = model.get_image_features(**inputs)

        # handle transformers returning a model output object
        if not isinstance(features, torch.Tensor):
            features = features.pooler_output

        # normalize CLIP embeddings
        features = features / features.norm(dim=-1, keepdim=True)
        batch_embeddings = features.cpu().numpy()
        embeddings.extend(batch_embeddings)

    return np.array(embeddings)

# load dataset
X = []
y = []

image_paths = []
labels = []

# assign labels
for root, dirs, files in os.walk(DATASET_PATH):
    for file in files:

        if not file.lower().endswith(('png','jpg','jpeg')):
            continue

        path = os.path.join(root, file)
        label_name = root.split(os.sep)[-1]

        if label_name in ENGAGED:
            label = 1
        elif label_name in NOT_ENGAGED:
            label = 0
        else:
            continue
        image_paths.append(path)
        labels.append(label)

print('Extracting CLIP embeddings...')
X = get_embeddings_batch(image_paths, batch_size=32)
y = np.array(labels)
print('Dataset size:', X.shape)

# train/test split
X_train, X_test, y_train, y_test = train_test_split(
    X, y, test_size=0.2, random_state=42
)

# train classifier
clf = LogisticRegression(max_iter=2000)

print('Training classifier...')
clf.fit(X_train, y_train)

# evaluate model
pred = clf.predict(X_test)
print(classification_report(y_test, pred))

pred = clf.predict(X_test)

acc = accuracy_score(y_test, pred)
f1 = f1_score(y_test, pred)
precision = precision_score(y_test, pred)
recall = recall_score(y_test, pred)
cm = confusion_matrix(y_test, pred)

print('\nModel Evaluation')
print('----------------')
print('Accuracy:', acc)
print('F1 Score:', f1)
print('Precision:', precision)
print('Recall:', recall)

print('\nConfusion Matrix')
print(cm)

# save model
joblib.dump(clf, 'engagement_classifier.pkl')
print('Model saved.')