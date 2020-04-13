Write-Host "Hang on while we are setting up your Hat..."

if (Test-Path venv) {
    Write-Host "Deleting previous venv/"
    Remove-Item venv -Force -Recurse
}

Write-Host "Setting up new python venv/"
python -m venv venv

Write-Host "Activating virtual env"
venv\Scripts\activate

Write-Host "Installing pipenv"
pip install pipenv

Write-Host "Installing all package dependencies from Pipfile, including dev dependencies"
pipenv install --dev
