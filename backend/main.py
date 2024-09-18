from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from supertokens_python.recipe.session.framework.fastapi import verify_session
from supertokens_python import init, InputAppInfo, SupertokensConfig
from supertokens_python.recipe import emailpassword, session, emailverification, usermetadata
from supertokens_python.framework.fastapi import get_middleware
from supertokens_python.recipe.emailpassword.types import (
    InputFormField,
)


init(
    app_info=InputAppInfo(
        app_name="Goodbi",
        api_domain="http://localhost:3000",
        website_domain="http://localhost:3000",
        api_base_path="/api/auth"
    ),
    supertokens_config=SupertokensConfig(
        connection_uri="http://localhost:3567",
    ),
    framework='fastapi',
    recipe_list=[
        emailpassword.init(
            sign_up_feature=emailpassword.InputSignUpFeature(
                form_fields=[
                        InputFormField(id="first_name"),
                        InputFormField(id="last_name"),
                        InputFormField(id="password"),
                    ]
                ),
                override=emailpassword.InputOverrideConfig(
                    apis=override_email_password_apis
                ),
            ),
        session.init(),
        usermetadata.init(),
    ],
    mode='asgi'
)

app = FastAPI()
app.add_middleware(get_middleware())
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
    print("Health Check Passed, API is up and running LOLLLL!")
    return {"data" : "Health Check Passed, API is up and running!"}