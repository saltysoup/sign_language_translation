# SLR Alphabet Recognizer

This project is a sign language alphabet recognizer using Python, openCV and tensorflow for training InceptionV3 model, a convolutional neural network model for classification.

The framework used for the CNN implementation can be found here:

[Simple transfer learning with an Inception V3 architecture model](https://github.com/xuetsing/image-classification-tensorflow) by xuetsing

The project contains the dataset (1Go). If you are only interested in code, you better copy/paste the few files than cloning the entire project.

# Update - Demo Link
## Demo
You can [find the demo here](#)

[![Demo](#)](#)

## Requirements

This project uses python 3.5 and the PIP following packages:
* opencv
* tensorflow
* matplotlib
* numpy
* flask

See requirements.txt and Dockerfile for versions and required APT packages

# Update - Docker instructions
### Using Docker
```
docker build -t hands-classifier .
docker run -it hands-classifier bash
```
### Install using PIP
```
pip3 install -r requirements.txt
```

# Update - Training
## Training

To train the model, use the following command (see framework github link for more command options):
```
python3 train.py \
  --bottleneck_dir=logs/bottlenecks \
  --how_many_training_steps=2000 \
  --model_dir=inception \
  --summaries_dir=logs/training_summaries/basic \
  --output_graph=logs/trained_graph.pb \
  --output_labels=logs/trained_labels.txt \
  --image_dir=./dataset
```
If you're using the provided dataset, it may take up to three hours.

# Update - Flask instructions
## Classifying
  
To test classification, use the following command:
```
python3 classify.py path/to/image.jpg
```


