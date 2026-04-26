# Scrapper

## 🐳 Backend and Database Execution

### Requirements

* Docker
* Docker Compose

---
### 🔐 Environment Configuration

You must create a `.env` file inside the `backend/` directory with the following variables:

```env
DEBUG=1
SECRET_KEY=secreykey
DB_USER=user
DB_PASSWORD=pass
DB_HOST=db
DB_PORT=5432
DB_NAME=scrapper
ACCESS_TOKEN_EXPIRE_MINUTES=120
REFRESH_TOKEN_EXPIRE_DAYS=7
```
---
### 🚀 Running the services

From the project root directory:

```bash
docker compose up --build
```

This will initialize:

* **Backend** (API built with FastAPI)
* **Database** PostgreSQL

---

### 🌐 API Access

The API will be available at:

```text
http://localhost:8000
```

---

### 🗄️ Database

By default, the database:

* is **NOT exposed to the host**
* is only accessible through Docker’s internal network

This is a deliberate design decision to improve isolation and security.

---

### 🔧 Exposing the database (optional)

If you need to access the database from your host machine (e.g., using `psql` or a GUI client), you can expose the port by modifying `docker-compose.yml`:

```yaml
db:
  ports:
    - "5432:5432"
```

Then restart the services:

```bash
docker compose down
docker compose up --build -d
```

---

## 💬 Note for “el gordo”

For proper integration with this backend:

1. **Dockerize your client application (frontend or consumer service)**
   This is required so it can join the same internal Docker Compose network.

2. **Remove backend port exposure** (`ports`)
   The backend should not be accessible from the host. Communication must occur exclusively through the internal network.

   Expected communication pattern:

   ```text
   http://backend:8000
   ```

This ensures:

* service isolation
* reduced attack surface
* an architecture aligned with production environments

If your application is not running inside Docker, you are forcing unnecessary port exposure and breaking the intended network model of this project.
