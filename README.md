# GoodBI

GoodBI is the ultimate AI business intelligence platform, and can be found at [https://good-bi.vercel.app](https://good-bi.vercel.app).

## Our group

| Group Member          | Matriculation No. | Contributions                                                                     |
|-----------------------|-------------------|-----------------------------------------------------------------------------------|
| Lok Jian Ming         | A0236537Y         | Full-stack engineering on dashboard page, report writing                          |
| Ong Pei Cong Lester   | A0245751A         | UI/UX design, front-end engineering on landing and datasets pages, report writing |
| Shirshajit Sen Gupta  | A0244147H         | LLM research, report writing                                                      |
| Vaishnav Muralidharan | A0235268Y         | Full-stack engineering on user authentication and datasets page                   |

## Setup Guide

### Prereqs

nodejs, npm, python 3.10, Docker, docker-compose and WSL2.

### Backend Setup

Run

```
cd backend/
```

Create a virtual environment

```
python -m venv venv
```

Install Dependencies

```
pip install -r requirements.txt
```

### Frontend Setup

Run

```
cd frontend/
```

Install dependencies using npm

```
npm install
```

Serve locally

```
npm run dev
```

### Set up local testing environment

Make sure you have Docker and docker-compose installed.

```
docker-compose up --build -d
```

## Resources Used

1. [shadcn/ui](https://ui.shadcn.com/)
2. [Figma mockup](https://www.figma.com/design/5sKpfUDsNlWmzsxW7uLExM/GoodBI?node-id=0-1&t=rNu0vSMoAvC5vLdD-1) 

## Known issues

- Our application does not function correctly on Safari and incognito tabs in Chrome, due to third-party cookies utilised by authentication on our platform. See [https://github.com/supertokens/supertokens-core/issues/280](https://github.com/supertokens/supertokens-core/issues/280).
