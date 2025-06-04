# Adverly Project

This project contains a **frontend** and **backend** service managed using Docker and `docker-compose`. It can be run in a local development mode using Node.js or in a fully containerized environment.

---

## 📌 Prerequisites

- [Docker](https://www.docker.com/get-started)
- [Docker Compose](https://docs.docker.com/compose/install/)
- [Node.js](https://nodejs.org/)

---

## 🏗️ Setup & Build

### 1. Clone and Install Dependencies

Clone the repository and install the dependencies for both the root project and its individual services:

```sh
# Clone the repository
git clone https://github.com/it-dinara/adverly.git
cd adverly

# Install dependencies in the root (if applicable)
npm install

# Install dependencies for the frontend service
cd frontend
npm install
cd ..

# Install dependencies for the backend service
cd backend
npm install
cd ..

#run the application
npm run dev

```

### 2. Run in Development Mode

Start the local development environment using Node.js:

```sh
npm run dev
```

If your application does not load on http://localhost:8081/form or returns a 404 error, check whether the port is in use by running:

```sh
netstat -ano | findstr :8081
```

If another process is using port 8081, stop the conflicting process or update the port settings in your application configuration.

## 🚀 Running with Docker

### 1. Build the Containers (Optional)

Although Docker Compose will build missing containers automatically, you can rebuild the images manually if needed:

```sh
docker-compose build
```

### 2. Start the Services

```sh
docker-compose up -d
```

### 3. Verify the Services

- View Active Containers:

```sh
docker ps
```

- Check if Port 8081 is in Use:

```sh
netstat -ano | findstr :8081
```

This confirms that the frontend service is accessible.
