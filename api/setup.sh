#!/bin/bash

echo "Hang on while we are setting up your Hat..."

if [ -d "venv" ]
then
    echo "Deleting previous venv/"
    rm -rf venv 
fi

echo "Setting up new python venv/"
python3 -m venv venv

echo "Activating virtual env"
source venv/bin/activate

echo "Installing pipenv"
pip install pipenv

echo "Installing all package dependencies from Pipfile, including dev dependencies"
pipenv install --dev
