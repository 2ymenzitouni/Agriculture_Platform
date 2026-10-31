# 🌾 AgriAI — Smart Agriculture & Hydroponics Management Platform

[![FastAPI](https://img.shields.io/badge/Backend-FastAPI-009688.svg?logo=fastapi&logoColor=white)](https://fastapi.tiangolo.com/)
[![React](https://img.shields.io/badge/Frontend-React_19-61DAFB.svg?logo=react&logoColor=black)](https://react.dev/)
[![Vite](https://img.shields.io/badge/Bundler-Vite_8-646CFF.svg?logo=vite&logoColor=white)](https://vitejs.dev/)
[![PostgreSQL](https://img.shields.io/badge/Database-PostgreSQL_+_pgvector-336791.svg?logo=postgresql&logoColor=white)](https://github.com/pgvector/pgvector)
[![Gemini](https://img.shields.io/badge/AI-Google_Gemini-4285F4.svg?logo=google&logoColor=white)](https://ai.google.dev/)
[![YOLOv8](https://img.shields.io/badge/Vision_AI-YOLOv8-FF6F00.svg)](https://ultralytics.com/)

---

## 📌 Project Overview

**AgriAI** is an intelligent, full-stack agricultural platform designed to monitor, analyze, and optimize hydroponic and soil farming operations. The platform brings together IoT environmental telemetry, computer vision leaf disease diagnosis, document-driven knowledge ingestion, and an AI conversational agent that provides context-aware agronomic advice.

> **Current Project Status**:
> - 🟢 **Backend (FastAPI)**: Fully operational with all database models, security, RAG pipeline, YOLOv8 vision inference, and REST endpoints.
> - 🟡 **Frontend (React + Vite)**: Authentication and plant registration are connected to the backend API; other feature pages may still use mock data.

---

## 🏛️ System Architecture

```mermaid
graph TD
    subgraph Client ["Client (React 19 + TailwindCSS)"]
        UI["Web Dashboard & UI Components"]
        UI_Sim["IoT Simulator / Telemetry Page"]
        UI_Chat["AI Chat & Knowledge Hub"]
        UI_Vision["Disease Detection / Image Upload"]
    end

    subgraph Backend ["Backend API (FastAPI)"]
        API["FastAPI App (app.main:app)"]
        Auth["Auth Service (JWT / bcrypt)"]
        PlantSvc["Plant Management Service"]
        SensorSvc["Sensor Readings Ingestion"]
        VisionSvc["YOLOv8 Disease Detection"]
        RAGSvc["Document Extractor & Embeddings"]
        ChatSvc["Context-Aware Chat Service"]
    end

    subgraph Storage ["Database & Storage"]
        PG[("PostgreSQL 16 + pgvector")]
        StaticFiles["Local File Storage (/static)"]
    end

    subgraph AI_Engines ["AI & External Services"]
        YOLO["YOLOv8 Vision Model (best.pt)"]
        GeminiFlash["Google Gemini (Flash Models)"]
        GeminiEmbed["Gemini Embedding Model"]
    end

    UI -.->|"Future HTTP / REST API"| API
    API --> Auth
    API --> PlantSvc
    API --> SensorSvc
    API --> VisionSvc
    API --> RAGSvc
    API --> ChatSvc

    VisionSvc --> YOLO
    VisionSvc --> StaticFiles
    RAGSvc --> GeminiFlash
    RAGSvc --> GeminiEmbed
    ChatSvc --> GeminiEmbed
    ChatSvc --> GeminiFlash

    Auth --> PG
    PlantSvc --> PG
    SensorSvc --> PG
    VisionSvc --> PG
    RAGSvc --> PG
    ChatSvc --> PG
```

---

## 🌟 Key Features

1. **🌱 Crop & Plant Management**:
   - Register and manage distinct plants, crops, and growth stages.
   - Maintain track of varieties and plantation dates per user.

2. **📡 Real-Time IoT Sensor Telemetry**:
   - Ingestion of vital hydroponic metrics: water temperature, ambient temperature, humidity, water level, pH, TDS (Total Dissolved Solids in ppm), and light levels.
   - Chronological historical querying per plant.

3. **🔍 YOLOv8 Computer Vision Disease Diagnosis**:
   - Image upload pipeline with automated leaf disease classification using a custom-trained YOLOv8 model (`app/ai/vision/best.pt`).
   - Automatically plots and saves annotated bounding box images served directly via `/static/detections`.

4. **📚 RAG (Retrieval-Augmented Generation) Knowledge Base**:
   - Upload agricultural manuals, research papers, and guides (PDF, Word, Text).
   - Automated text extraction and technical synthesis powered by Google Gemini.
   - Semantic text chunking and 768-dimensional vector embedding storage directly inside PostgreSQL using `pgvector`.

5. **🤖 Context-Aware Agronomic Chatbot**:
<<<<<<< HEAD
   - Uses semantic search (`<=>` cosine distance) over the authenticated user's knowledge-base documents and combines retrieved guidance with that user's sensor readings and disease detections.
   - Answers are rendered with formatted headings, bold text, lists, and tables. Sensor questions can show the full readings history in a table.
   - Disease-specific questions return source-grounded guidance; requests for detection images show the user's records, filtered to a named disease when specified.
   - Chat generation uses `gemini-3.1-flash-lite`; query embeddings use `gemini-embedding-2`.
=======
   - Combines semantic similarity search (`<=>` cosine distance) with **real-time plant sensor readings** and **latest disease detection events**.
   - Gemini LLM synthesizes live hardware telemetry, diagnostic history, and official agronomic literature into actionable farming instructions.
>>>>>>> origin/main

6. **🔒 Security & Authentication**:
   - Secure registration and login with bcrypt password hashing and JWT (JSON Web Tokens).

---

## 📁 Repository Structure

```
Agriculture_Platform/
├── .env                       # Root environment configuration
├── docker-compose.yml         # PostgreSQL with pgvector container setup
├── README.md                  # Project documentation
│
├── backend/                   # FastAPI Backend
│   ├── Dockerfile             # Backend container definition
│   ├── requirements.txt       # Python dependencies
│   ├── static/                # Uploaded and annotated media
│   │   ├── detections/        # YOLO annotated output images
│   │   ├── documents/         # Uploaded reference documents
│   │   └── uploads/           # General file uploads
│   └── app/
│       ├── main.py            # FastAPI entry point, CORS & table creation
│       ├── core/              # Core settings, database connection, JWT
│       │   ├── config.py
│       │   ├── database.py
│       │   └── security.py
│       ├── api/router/        # Main route aggregator & dependencies
│       │   ├── router.py
│       │   └── dependencies.py
│       ├── models/            # SQLAlchemy database models
│       │   ├── usersModel.py
│       │   ├── plantModel.py
│       │   ├── sensor_readingsModel.py
│       │   ├── disease_detectionModel.py
│       │   ├── chatModel.py
│       │   └── documentModel.py
│       ├── schemas/           # Pydantic request/response schemas
│       ├── services/          # Business logic, YOLO, Gemini & RAG
│       │   ├── auth / userService.py
│       │   ├── plantService.py
│       │   ├── sensor_readingsService.py
│       │   ├── disease_detectionService.py
│       │   ├── documentExtractorService.py
│       │   └── chatService.py
│       ├── ai/
│       │   └── vision/best.pt # Custom YOLOv8 weights file
│       └── utils/             # Gemini document extraction utilities
│
└── client/                    # React 19 Frontend (Vite)
    ├── package.json
    ├── vite.config.js
    ├── index.html
    └── src/
        ├── App.jsx            # Router and navigation setup
        ├── index.css          # Tailwind CSS styling
        ├── components/        # Reusable UI components (Navbar, MetricCard, etc.)
        └── pages/             # Frontend page views
            ├── AI_Telemetry.jsx       # Chatbot & real-time sensor view
            ├── Image_Upload.jsx       # Disease detection upload & results
            ├── IoT_Simulator.jsx      # Telemetry generator simulator
            ├── Knowledge_Base.jsx     # Document library & upload view
            ├── Plant_Management.jsx   # Crop list and plant creation
            ├── User_Register_Login.jsx# Auth login/signup view
            └── Weather_Dashboard.jsx  # Meteorological conditions overview
```

---

## ⚙️ Prerequisites

Before running the project, make sure you have installed:

- **Docker Desktop** (or Docker Engine + Docker Compose) for PostgreSQL with `pgvector`.
- **Python 3.10+** (tested with Python 3.12 / 3.13; on Windows, use `py` or `python`).
- **Node.js 18+** & **npm** (for the React client).
- **Google Gemini API Key** ([Get a key from Google AI Studio](https://aistudio.google.com/)).

---

## 🚀 Step-by-Step Installation & Run Guide

### Step 1: Clone the Repository

```bash
git clone https://github.com/2ymenzitouni/Agriculture_Platform.git
cd Agriculture_Platform
```

---

### Step 2: Configure Environment Variables

Create or update the `.env` file in the root directory (`Agriculture_Platform/.env`):

```env
# Database connection (matches docker-compose.yml configuration)
DATABASE_URL=postgresql://agriai:agriai_123456789@localhost:54320/agriai

# Application settings
APP_NAME=AgriAI
ENVIRONMENT=development
DEBUG=true

# JWT Authentication Secret Key (generate a secure random 32+ hex character key)
SECRET_KEY=32eac2492425cfd9d1d7f0dab1320eefe9be6e33bd8fab6463ebb135805aa4a3

# Google Gemini API Key for Document Extraction & RAG Assistant
GEMINI_API_KEY=your_gemini_api_key_here
```

---

### Step 3: Start PostgreSQL with `pgvector`

The application requires PostgreSQL with `pgvector` extension support. Use Docker Compose to start it:

```bash
docker compose up -d postgres
```

> **Verification**: Check if the container is running and healthy:
> ```bash
> docker ps
> ```
> The container `agriai_postgres` will be listening on port `54320`.

*(Optional)* If initializing manually or verifying the `vector` extension, run:
```bash
docker exec -it agriai_postgres psql -U agriai -d agriai -c "CREATE EXTENSION IF NOT EXISTS vector;"
```

---

### Step 4: Install and Run the Backend (FastAPI)

1. **Navigate to the backend directory**:
   ```bash
   cd backend
   ```

2. **Create and activate a Python virtual environment**:
   - **Windows (PowerShell)**:
     ```powershell
     py -m venv venv
     .\venv\Scripts\Activate.ps1
     ```
     *(If script execution is restricted: `Set-ExecutionPolicy -Scope Process -ExecutionPolicy Bypass`)*
   - **Windows (Command Prompt)**:
     ```cmd
     py -m venv venv
     venv\Scripts\activate.bat
     ```
   - **Linux / macOS**:
     ```bash
     python3 -m venv venv
     source venv/bin/activate
     ```

3. **Install dependencies**:
   ```bash
   pip install --upgrade pip
   pip install -r requirements.txt
   ```

   > **Note on AI & Computer Vision dependencies**:
   > Ensure `pgvector`, `ultralytics`, and `opencv-python` are installed for the vision and vector search services:
   > ```bash
   > pip install pgvector ultralytics opencv-python
   > ```

4. **Start the FastAPI backend server**:
   ```bash
   uvicorn app.main:app --host 0.0.0.0 --port 8000 --reload
   ```

5. **Verify the backend**:
   - Root Health Check: [http://127.0.0.1:8000/](http://127.0.0.1:8000/)
   - Interactive Swagger API Docs: [http://127.0.0.1:8000/docs](http://127.0.0.1:8000/docs)
   - Alternative ReDoc: [http://127.0.0.1:8000/redoc](http://127.0.0.1:8000/redoc)

---

### Step 5: Install and Run the Client (React + Vite)

In a **new terminal window**, navigate to the `client` directory:

1. **Navigate to the client directory**:
   ```bash
   cd client
   ```

2. **Install npm dependencies**:
   ```bash
   npm install
   ```

3. **Start the Vite development server**:
   ```bash
   npm run dev
   ```

4. **Access the frontend in your browser**:
   - Local URL: [http://localhost:5173/](http://localhost:5173/)

---

## 📡 Complete Backend API Reference

Base URL: `http://localhost:8000` (API routes prefix: `/api`)

### 1. System & Health

| Method | Endpoint | Description | Auth Required |
|---|---|---|:---:|
| `GET` | `/` | API status and version info | No |
| `GET` | `/health` | Health check endpoint | No |
| `GET` | `/api/test` | API sanity check endpoint | No |

---

### 2. Authentication (`/api/auth`)

#### `POST /api/auth/register`
Register a new user account.
- **Request Body** (`application/json`):
  ```json
  {
    "name": "Jane Farmer",
    "email": "jane@example.com",
    "password": "SecretPassword123"
  }
  ```
- **Response** (`201 Created`):
  ```json
  {
    "id": "e4b2d184-48f5-4d76-92cb-5079a4da9b37",
    "name": "Jane Farmer",
    "email": "jane@example.com",
    "created_at": "2026-10-13T18:00:00.000000"
  }
  ```

#### `POST /api/auth/login`
Authenticate a user and receive a Bearer JWT access token.
- **Request Body** (`application/json`):
  ```json
  {
    "email": "jane@example.com",
    "password": "SecretPassword123"
  }
  ```
- **Response** (`200 OK`):
  ```json
  {
    "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6...",
    "token_type": "bearer"
  }
  ```

---

### 3. Plant Management (`/api/plants`)

#### `POST /api/plants/`
Register a new plant or crop profile for a user.
- **Authentication**: Required. Send the access token as `Authorization: Bearer <token>`. The plant is linked to the authenticated user automatically.
- **Request Body** (`application/json`):
  ```json
  {
    "name": "Hydroponic Lettuce Bed 1",
    "crop": "Lettuce",
    "variety": "Butterhead",
    "growth_stage": "Vegetative",
    "planted_at": "2026-10-01"
  }
  ```
- **Response** (`201 Created`):
  ```json
  {
    "id": "8e3fb58a-3e3d-4c7b-b387-99e2b10a4cb2",
    "user_id": "e4b2d184-48f5-4d76-92cb-5079a4da9b37",
    "name": "Hydroponic Lettuce Bed 1",
    "crop": "Lettuce",
    "variety": "Butterhead",
    "growth_stage": "Vegetative",
    "planted_at": "2026-10-01",
    "created_at": "2026-10-13T18:05:00.000000"
  }
  ```

#### `GET /api/plants/mine`
Retrieve all plants belonging to the authenticated user. Requires `Authorization: Bearer <token>`.

#### `GET /api/plants/user/{user_id}`
Retrieve all plants belonging to a user.
- **Path Parameter**: `user_id` (UUID)
- **Query Parameters**: `skip` (default: 0), `limit` (default: 100)
- **Response** (`200 OK`): Array of plant objects.

#### `GET /api/plants/{plant_id}`
Retrieve a specific plant by its unique UUID.
- **Path Parameter**: `plant_id` (UUID)
- **Response** (`200 OK`): Plant object.

#### `PUT /api/plants/{plant_id}`
Update plant information (crop, variety, growth stage, etc.).
- **Path Parameter**: `plant_id` (UUID)
- **Request Body** (`application/json`): Any subset of `PlantUpdate` fields.
- **Response** (`200 OK`): Updated plant object.

#### `DELETE /api/plants/{plant_id}`
Delete a plant and its associated telemetry/detections.
- **Path Parameter**: `plant_id` (UUID)
- **Response** (`200 OK`): Deleted plant object.

---

### 4. IoT Sensor Telemetry (`/api/sensors/sensor-readings`)

#### `POST /api/sensors/sensor-readings/`
Record real-time telemetry metrics for a monitored plant.
- **Authentication**: Required. Send `Authorization: Bearer <token>`. The plant must belong to the authenticated user.
- **Request Body** (`application/json`):
  ```json
  {
    "plant_id": "8e3fb58a-3e3d-4c7b-b387-99e2b10a4cb2",
    "temperature": 23.4,
    "humidity": 62.5,
    "water_temperature": 20.8,
    "water_level": 85.0,
    "ph": 6.1,
    "tds": 720.0,
    "light": 14500.0
  }
  ```
- **Response** (`201 Created`):
  ```json
  {
    "id": 1,
    "plant_id": "8e3fb58a-3e3d-4c7b-b387-99e2b10a4cb2",
    "temperature": 23.4,
    "humidity": 62.5,
    "water_temperature": 20.8,
    "water_level": 85.0,
    "ph": 6.1,
    "tds": 720.0,
    "light": 14500.0,
    "recorded_at": "2026-10-13T18:10:00.000000"
  }
  ```

#### `GET /api/sensors/sensor-readings/plant/{plant_id}`
Retrieve historical sensor readings for a plant in reverse chronological order.
- **Authentication**: Required. Send `Authorization: Bearer <token>`. The plant must belong to the authenticated user.
- **Path Parameter**: `plant_id` (UUID)
- **Query Parameters**: `skip` (default: 0), `limit` (default: 100)
- **Response** (`200 OK`): Array of sensor reading objects.

---

### 5. Computer Vision & Disease Detection (`/api/diseases`)

#### `POST /api/diseases/detect`
Upload a leaf image to execute YOLOv8 inference, draw bounding boxes, and save detection history.
- **Authentication**: Required. Send `Authorization: Bearer <token>`. The selected plant must belong to the authenticated user.
- **Request Format**: `multipart/form-data`
- **Form Fields**:
  - `plant_id` (UUID, required): Plant ID linked to the detection
  - `file` (File, required): Crop leaf image (`.jpg`, `.jpeg`, `.png`, `.webp`)
- **Response** (`201 Created`):
  ```json
  {
    "id": "c1a9f022-7f28-4e89-8d8d-9057864f1d23",
    "plant_id": "8e3fb58a-3e3d-4c7b-b387-99e2b10a4cb2",
    "crop": "Tomato",
    "disease": "Tomato_Early_Blight",
    "confidence": 0.9348,
    "image_path": "/static/detections/detected_c1a9f022.jpg",
    "detected_at": "2026-10-13T18:15:00.000000"
  }
  ```
  *(The annotated image can be viewed directly at `http://localhost:8000/static/detections/detected_c1a9f022.jpg`)*

---

### 6. AI Hydroponic Assistant (`/api/chat`)

#### `POST /api/chat/`
<<<<<<< HEAD
Submit a question to the authenticated user's conversational assistant. The endpoint retrieves relevant chunks from the user's knowledge base, then adds sensor data and disease detections when relevant. Chat generation uses `gemini-3.1-flash-lite`, with `gemini-embedding-2` used for query embeddings.

Disease-treatment answers are organized into Markdown sections and only state treatment details supported by retrieved documents. Requests to see disease detection images return the authenticated user's detection records; when a disease is named, the image results are filtered to that disease. General detection-image requests return the full history. Sensor questions include the user's sensor history for tabular display.
=======
Submit a question to the conversational AI. The engine performs:
1. Embedding of the query via Gemini (`gemini-embedding-001`).
2. Vector similarity search (`pgvector`) against indexed knowledge base chunks.
3. Live fetch of the user's latest IoT sensor readings (pH, TDS, water temp, level).
4. Live fetch of the user's latest YOLO disease detection result.
5. Contextual synthesis using Gemini (`gemini-3.1-flash-lite`).
>>>>>>> origin/main

- **Request Body** (`application/json`):
  ```json
  {
<<<<<<< HEAD
    "session_id": 1,
    "message": "How do I treat Tomato Target Spot?"
  }
  ```
- **Authentication**: Required. The user is identified from the bearer token; do not send a `user_id` in the request body.
- **Response** (`200 OK`): Includes the generated `answer`, document `sources_used`, sensor `sensor_snapshot` and `sensor_readings`, plus disease fields: `detection_snapshot`, `detection_history`, and `disease_detections`. Disease detection records include crop, predicted disease, confidence, image path, plant name, and detection timestamp.
  ```json
  {
    "session_id": 1,
    "answer": "A Markdown-formatted, source-grounded answer.",
    "sources_used": [],
    "sensor_snapshot": {},
    "sensor_readings": [],
    "detection_snapshot": {},
    "detection_history": [],
    "disease_detections": []
=======
    "user_id": "e4b2d184-48f5-4d76-92cb-5079a4da9b37",
    "session_id": 1,
    "message": "My lettuce leaves are starting to show slight browning and the pH is 6.1. What should I adjust?"
  }
  ```
- **Response** (`200 OK`):
  ```json
  {
    "session_id": 1,
    "answer": "Based on your latest sensor readings (pH 6.1, TDS 720 ppm, Water Temp 20.8°C) and documented hydroponic guidelines for Lettuce...",
    "sources_used": [
      {
        "document": "hydroponic_nutrient_management.pdf",
        "chunk_index": 2
      }
    ],
    "sensor_snapshot": {
      "temperature": 23.4,
      "humidity": 62.5,
      "water_temperature": 20.8,
      "water_level": 85.0,
      "ph": 6.1,
      "tds": 720.0,
      "light": 14500.0,
      "timestamp": "2026-10-13T18:10:00"
    },
    "detection_snapshot": {
      "prediction": "Healthy",
      "confidence": 0.98,
      "image_path": "/static/detections/detected_healthy.jpg",
      "detection_time": "2026-10-13T18:15:00"
    }
>>>>>>> origin/main
  }
  ```

---

### 7. Knowledge Base & Document Ingestion (`/api/documents`)

#### `POST /api/documents/documents/upload-ai`
<<<<<<< HEAD
Upload a technical PDF or agronomy manual. The file is extracted using Gemini (`gemini-3.1-flash-lite`), split into overlapping chunks, embedded via Gemini embeddings, and stored in PostgreSQL using `pgvector`.
=======
Upload a technical PDF or agronomy manual. The file is extracted using Gemini (`gemini-3.8-flash`), split into overlapping chunks, embedded via Gemini embeddings, and stored in PostgreSQL using `pgvector`.
>>>>>>> origin/main
- **Request Format**: `multipart/form-data`
- **Form Fields**:
  - `user_id` (UUID, required): Owner of the document
  - `file` (File, required): PDF or text file
- **Response** (`201 Created`):
  ```json
  {
    "id": "5fa23d11-bb1e-42ef-889a-0e920d3f2319",
    "user_id": "e4b2d184-48f5-4d76-92cb-5079a4da9b37",
    "filename": "hydroponic_nutrient_management.pdf",
    "file_path": "static/documents/5fa23d11.pdf",
    "file_type": "pdf",
    "file_size": 348210,
    "created_at": "2026-10-13T18:20:00.000000"
  }
  ```

---

## 🧪 Testing the API via cURL

Here is an end-to-end test flow using `curl`:

```bash
# 1. Test health check
curl http://localhost:8000/health

# 2. Register user
curl -X POST http://localhost:8000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"name":"Aymen","email":"aymen@test.com","password":"mypassword123"}'

# 3. Log in
curl -X POST http://localhost:8000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"aymen@test.com","password":"mypassword123"}'

# 4. Create a plant (send the access token returned by login)
curl -X POST http://localhost:8000/api/plants/ \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN" \
  -d '{"name":"Cherry Tomato Plant 1","crop":"Tomato","variety":"Cherry","growth_stage":"Flowering"}'

# List plants owned by the logged-in user
curl http://localhost:8000/api/plants/mine \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN"

# 5. Ingest sensor reading (replace plant_id with your plant UUID)
curl -X POST http://localhost:8000/api/sensors/sensor-readings/ \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN" \
  -d '{"plant_id":"YOUR_PLANT_ID","temperature":25.0,"humidity":60.0,"ph":6.0,"tds":750.0,"water_level":90.0,"water_temperature":21.5}'

# 6. Ask the AI assistant
curl -X POST http://localhost:8000/api/chat/ \
  -H "Content-Type: application/json" \
<<<<<<< HEAD
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN" \
  -d '{"session_id":1,"message":"Is my pH and TDS optimal for cherry tomatoes?"}'
=======
  -d '{"user_id":"YOUR_USER_ID","session_id":1,"message":"Is my pH and TDS optimal for cherry tomatoes?"}'
>>>>>>> origin/main
```

---

<<<<<<< HEAD
## 🔌 Frontend Integrations

The shared Axios client is configured in `client/src/services/app.js` and attaches the JWT from `localStorage`. Authentication, plant registration, IoT telemetry, disease detection, and the AI chat page are connected. The chat page calls `/api/chat/` and displays formatted answers, sensor tables, and disease detection images when requested. The knowledge-base page connects to document upload:

- Map `Knowledge_Base.jsx` to `/api/documents/documents/upload-ai`.

The backend allows requests from `http://localhost:5173` via `CORSMiddleware` in `backend/app/main.py`.
=======
## 🔌 Remaining Frontend Integrations

The shared Axios client is configured in `client/src/services/app.js` and attaches the JWT from `localStorage`. Authentication, plant registration, IoT telemetry, and disease detection are connected. Remaining feature integrations:

- Map `AI_Telemetry.jsx` to `/api/chat/`.
- Map `Knowledge_Base.jsx` to `/api/documents/documents/upload-ai`.
3. **CORS Configuration**:
   The backend already allows requests from `http://localhost:5173` via `CORSMiddleware` in `backend/app/main.py`.
>>>>>>> origin/main

---

## 🛠️ Tech Stack Summary

| Layer | Technologies |
|---|---|
| **Frontend** | React 19, Vite 8, React Router v7, TailwindCSS v4 |
| **Backend API** | FastAPI, Uvicorn, Pydantic v2, Python-Jose (JWT), Passlib (bcrypt) |
| **Database & ORM** | PostgreSQL 16, pgvector, SQLAlchemy 2.0, asyncpg, psycopg |
<<<<<<< HEAD
| **Artificial Intelligence** | Google Gemini SDK (`gemini-3.1-flash-lite`, `gemini-embedding-2`), YOLOv8 (`ultralytics`), OpenCV |
=======
| **Artificial Intelligence** | Google Gemini SDK (`gemini-3.1-flash-lite`, `gemini-3.8-flash`, `gemini-embedding-001`), YOLOv8 (`ultralytics`), OpenCV |
>>>>>>> origin/main
| **Containerization** | Docker, Docker Compose |

---

## 📄 License

This project is licensed under the MIT License.
