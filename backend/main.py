from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"], 
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
def read_root():
    return {"message" : "Root Message"}

@app.get("/health_check")
def health_check():
    print("Health Check Passed, API is up and running!")
    return {"data" : "Health Check Passed, API is up and running!"}