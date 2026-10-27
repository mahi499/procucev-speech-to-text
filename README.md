# Procucev AI Speech-to-Text

A web application that converts spoken language into text and allows users to save, search, edit, filter, and manage their transcriptions.

## Live Demo

* **Frontend:** https://procucev-speech-to-text-five.vercel.app/
* **Backend:** https://procucev-speech-to-text-1.onrender.com
* **Source Code:** https://github.com/mahi499/procucev-speech-to-text

> **Note:** Opening the backend's root URL may display a 404 Whitelabel Error Page because the application exposes API endpoints rather than a homepage. This does not necessarily mean the backend is unavailable.

## Overview

Procucev AI Speech-to-Text is a full-stack web application with a React frontend and a Java Spring Boot backend.

The frontend uses the browser's Web Speech API (`SpeechRecognition`) to recognize speech and convert it into text. Users can review the recognized text and save their transcriptions through the backend REST API.

The backend stores transcription records in a MySQL database hosted on Aiven.

The application is deployed using three services:

* **Vercel:** Hosts the frontend.
* **Render:** Hosts the Spring Boot backend using Docker.
* **Aiven:** Hosts the MySQL database.

## Architecture

```text
                 User
                   |
                   v
       React + Vite Frontend
             (Vercel)
                   |
                   | HTTPS / REST API
                   v
        Spring Boot Backend
             (Render)
                   |
                   | JDBC + SSL
                   v
            MySQL Database
               (Aiven)
```

### Application Workflow

1. The user opens the frontend and selects a supported language.
2. The browser requests microphone permission when needed.
3. Browser-based speech recognition converts speech into text.
4. The user reviews the transcription.
5. The frontend sends API requests to the Spring Boot backend.
6. The backend saves or retrieves transcription records from MySQL.
7. The frontend displays the saved transcription history.

## Features

* Speech-to-text using browser-based speech recognition.
* Language selection for supported languages:

  * English (US)
  * English (India)
  * Hindi
  * Telugu
  * Kannada
  * Tamil
  * Spanish
  * French
* Start and stop speech recognition.
* Review recognized text before saving.
* Save transcriptions to a MySQL database.
* View saved transcription history.
* Search and filter saved transcriptions.
* Edit existing transcriptions.
* Delete saved transcriptions.
* Persistent storage through a backend REST API.
* Cloud deployment with a separate frontend, backend, and database.

> Feature availability depends on the current implementation. Language support and recognition accuracy depend on the browser and its speech-recognition service.

## Technology Stack

### Frontend

* React
* Vite
* JavaScript
* CSS
* Web Speech API

### Backend

* Java 21
* Spring Boot
* Spring Web
* Spring Data JPA
* Hibernate
* Maven
* MySQL Connector/J

### Database

* MySQL
* Aiven managed MySQL

### Deployment and Infrastructure

* Vercel — frontend hosting
* Render — backend hosting
* Docker — backend containerization
* Aiven — managed database hosting
* Git and GitHub — version control and source code hosting

## Project Structure

```text
procucev-speech-to-text/
├── frontend/
│   ├── src/
│   ├── public/
│   ├── package.json
│   └── package-lock.json
│
├── backend/
│   ├── src/
│   │   └── main/
│   │       ├── java/
│   │       │   └── com/
│   │       │       └── procucev/
│   │       │           └── speech/
│   │       └── resources/
│   │           └── application.properties
│   ├── .mvn/
│   ├── mvnw
│   ├── mvnw.cmd
│   ├── pom.xml
│   └── Dockerfile
│
└── README.md
```

The separate Python Whisper speech service was removed from this version. Speech recognition is handled by the browser's Web Speech API.

## Prerequisites

To run the application locally, install:

* Node.js and npm
* Java Development Kit (JDK) 21
* MySQL Server
* Git
* Google Chrome or another browser that supports the Web Speech API

The backend includes a Maven wrapper, so installing Maven separately is generally unnecessary.

## Configuration

### 1. Configure the database

For local development, you can use a local MySQL database. For the deployed application, the backend connects to Aiven MySQL.

The database connection is configured through environment variables.

| Environment variable | Purpose             |
| -------------------- | ------------------- |
| `DB_URL`             | JDBC connection URL |
| `DB_USERNAME`        | Database username   |
| `DB_PASSWORD`        | Database password   |

Never commit real database credentials to GitHub.

### 2. Configure `application.properties`

The backend configuration uses environment variables with local development defaults:

```properties
spring.application.name=speech-to-text

spring.datasource.url=${DB_URL:jdbc:mysql://localhost:3306/speech_to_text}
spring.datasource.username=${DB_USERNAME:root}
spring.datasource.password=${DB_PASSWORD:}
spring.datasource.driver-class-name=com.mysql.cj.jdbc.Driver

spring.jpa.hibernate.ddl-auto=update
spring.jpa.show-sql=false
```

For local development, make sure your MySQL server is running and the `speech_to_text` database exists.

For deployment, configure `DB_URL`, `DB_USERNAME`, and `DB_PASSWORD` in the Render environment settings.

The deployed database name and connection URL must match the database created in Aiven.

> The configuration above contains no actual database password. Keep credentials in environment variables rather than in source code.

### 3. Configure the frontend API URL

The deployed frontend communicates with the Render backend.

The API base URL should point to:

```text
https://procucev-speech-to-text-1.onrender.com/api/transcriptions
```

For local development, the frontend can use:

```text
http://localhost:8080/api/transcriptions
```

Make sure the API URL in your frontend matches the environment in which the application is running.

If you change the frontend API URL, rebuild and redeploy the frontend.

### 4. Configure CORS

The backend must allow requests from the frontend origin.

Production frontend origin:

```text
https://procucev-speech-to-text-five.vercel.app
```

Local Vite frontend origin:

```text
http://localhost:5173
```

Configure CORS in Spring Boot and Spring Security so that the necessary API requests and browser preflight requests are permitted.

Avoid allowing every origin unnecessarily.

## Run Locally

### 1. Clone the repository

```bash
git clone https://github.com/mahi499/procucev-speech-to-text.git
cd procucev-speech-to-text
```

### 2. Prepare the MySQL database

Start your local MySQL server and create the database:

```sql
CREATE DATABASE speech_to_text;
```

Configure the local database username and password using your environment or your local Spring Boot configuration.

### 3. Start the backend

Open a terminal in the repository root and run:

```bash
cd backend
```

On Windows Command Prompt:

```cmd
mvnw.cmd spring-boot:run
```

On Linux or macOS:

```bash
./mvnw spring-boot:run
```

Alternatively, if Maven is installed:

```bash
mvn spring-boot:run
```

The backend should start on:

```text
http://localhost:8080
```

### 4. Start the frontend

Open a second terminal in the repository root:

```bash
cd frontend
npm install
npm run dev
```

Vite will display the local development URL, usually:

```text
http://localhost:5173
```

Open that address in your browser.

Keep both the frontend and backend running while using the local application.

## Deployment

### Frontend — Vercel

The React frontend is deployed on Vercel.

Live URL:

https://procucev-speech-to-text-five.vercel.app/

The frontend must use the deployed Render backend URL when running in production.

### Backend — Render

The Spring Boot backend is deployed on Render using Docker and Java 21.

Backend URL:

https://procucev-speech-to-text-1.onrender.com

The Dockerfile builds the application and starts the Spring Boot executable JAR.

Configure these environment variables in Render:

```text
DB_URL
DB_USERNAME
DB_PASSWORD
```

Do not put database passwords in the Dockerfile or GitHub repository.

Render may take some time to start a service after it has been idle, depending on the service plan.

### Database — Aiven

The application uses a managed MySQL database hosted on Aiven.

The backend connects to the database using JDBC and the connection settings supplied through environment variables.

The connection must use the host, port, database name, username, password, and SSL settings provided by Aiven.

Database credentials should remain private.

## How to Use

1. Open the application in a supported browser.
2. Select a language from the language selector.
3. Allow microphone access if prompted.
4. Start speech recognition.
5. Speak clearly into the microphone.
6. Stop recognition when finished.
7. Review the recognized text.
8. Save the transcription.
9. Open the transcription history to view saved records.
10. Use the available search, filtering, editing, and deletion features to manage records.

You can also enter text manually if the application supports direct text entry.

## API

The frontend communicates with the Spring Boot backend using REST API requests.

The transcription API base path is:

```text
/api/transcriptions
```

The deployed base URL is:

```text
https://procucev-speech-to-text-1.onrender.com/api/transcriptions
```

The local base URL is:

```text
http://localhost:8080/api/transcriptions
```

The exact HTTP methods, request bodies, response formats, and individual endpoint paths are defined by the backend controller.

Refer to the controller implementation for the authoritative API contract.

## Troubleshooting

### Speech recognition is not supported

* Try Google Chrome.
* Make sure the browser is up to date.
* Confirm that the browser supports the Web Speech API.
* Check whether speech recognition requires an internet connection.

### Microphone access is denied

* Allow microphone access in your browser settings.
* Check that the correct microphone is selected.
* Verify that the microphone works in other applications.

### Transcription history does not load

* Check whether the Render backend is running.
* Verify the frontend API URL.
* Inspect the browser console and Network tab.
* Check CORS configuration in Spring Boot and Spring Security.
* Review Render logs for backend errors.
* Verify the database connection and environment variables.

### Saving a transcription fails

* Confirm that the backend is running.
* Check the failed API request in the browser's Network tab.
* Verify the request URL, method, and request body.
* Check for CORS or Spring Security errors.
* Review Render logs for exceptions.
* Verify that the Aiven database connection is available.

### Database connection fails

* Verify `DB_URL`, `DB_USERNAME`, and `DB_PASSWORD`.
* Confirm that the hostname, port, and database name are correct.
* Check the SSL requirements specified by Aiven.
* Ensure that the database service is available.

### Backend root URL returns 404

Opening the backend root URL may return a Whitelabel Error Page with status 404 if no controller is mapped to `/`.

This does not necessarily indicate a deployment failure. Test the actual API endpoint or inspect the Render logs to determine whether the backend is running correctly.

## Important Notes and Limitations

* This version uses browser-based speech recognition rather than a self-hosted Whisper model.
* Speech-recognition support varies by browser.
* Language availability and recognition accuracy depend on the browser and its speech-recognition service.
* The application requires a working backend connection to save and retrieve transcription records.
* Local database records are not automatically copied to the cloud database.
* Database credentials must not be committed to source control.
* A self-hosted, open-source speech-recognition engine would be a separate enhancement if required by the project specification.

## Future Improvements

* Add authentication and user-specific transcription history.
* Improve accessibility and error handling.
* Add export options for saved transcriptions.
* Add automated frontend and backend tests.
* Add pagination for large transcription histories.
* Improve deployment monitoring and health checks.
* Integrate a self-hosted speech-to-text engine if required.

## License

No license has been specified yet.

Choose and add an appropriate open-source license before distributing the project under an open-source license.
