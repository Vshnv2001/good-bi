# Setup Guide
## Prereqs
nodejs, npm, python 3.10, Docker, docker-compose and WSL2. 

## Backend Setup
Run
```
cd backend/
```
Create a virtual environment
```
python -m venv venv
```
Install Dependencies:
```
pip install -r requirements.txt
```

## Set up local testing environment
Make sure you have Docker and docker-compose installed.
```
docker-compose up --build -d
```

