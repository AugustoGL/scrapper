# Backend API - MVP

API construida con FastAPI.


## Cómo correr el proyecto
### 1. Clonar repo

### 2. Crear entorno virtual e instalacion de dependencias
Es necesario pipenv.
Usamos python 3.12
Entramos a backend
pipenv install
pipenv shell

### 3. Correr servidor
fastapi dev app/main.py
o
fastapi run app.main.py

## Base URL

---

## Documentación API

- Swagger UI: http://localhost:8000/docs
- Redoc: http://localhost:8000/redoc

---

## 🔐 Autenticación

Usa JWT (Bearer Token)

Header:
Authorization: Bearer <token>

---

## 📦 Endpoints principales

- POST /auth/login
- GET /users/me

---

## ⚙️ Variables de entorno

Crear archivo `.env`:

SECRET_KEY=tu_clave
DATABASE_URL=sqlite:///./test.db

---

## 🐳 Docker (opcional)

docker build -t backend .
docker run -p 8000:8000 backend

---

## 📌 Notas

- Proyecto en etapa MVP
- Puede cambiar la estructura