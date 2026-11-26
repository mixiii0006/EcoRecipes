# EcoRecipes

Low-carbon recipe recommendation web app. Users enter the ingredients they already have, and the app suggests matching recipes together with an estimate of each recipe's carbon footprint.

Capstone project of **Coding Camp powered by DBS Foundation 2025** (team project). I worked as a fullstack developer, connecting the web app to the team's machine learning model through a REST API.

## Features

- Ingredient input and recipe recommendations from the ML model
- Carbon footprint estimate per recipe and total carbon saved
- User accounts with favorite recipes and cooking history

## Tech Stack

![Vue.js](https://img.shields.io/badge/Vue.js-4FC08D?style=flat-square&logo=vuedotjs&logoColor=white)
![Vite](https://img.shields.io/badge/Vite-646CFF?style=flat-square&logo=vite&logoColor=white)
![Express.js](https://img.shields.io/badge/Express.js-000000?style=flat-square&logo=express&logoColor=white)
![MongoDB](https://img.shields.io/badge/MongoDB-47A248?style=flat-square&logo=mongodb&logoColor=white)
![Axios](https://img.shields.io/badge/Axios-5A29E4?style=flat-square&logo=axios&logoColor=white)

| Part | Technology | Hosting |
|---|---|---|
| Frontend | Vue.js, Vite, Axios | Netlify |
| Backend | Express.js REST API, MongoDB | Railway |
| ML | Recommendation model by the ML team, consumed via REST API | |

## Project Structure

```
backend/    Express.js REST API (controllers, models, routes, middlewares)
frontend/   Vue.js + Vite client
```

## Getting Started

```bash
# backend
cd backend
npm install
node app.js

# frontend
cd frontend
npm install
npm run dev
```

Configure the MongoDB connection string and API base URL in the respective `.env` files before running.
