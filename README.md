# Procucev AI Speech-to-Text

A web application that converts spoken language into text and lets users
save and manage their transcriptions.

## Overview

The application has a React frontend and a Java Spring Boot backend.
Transcription uses the browser's Web Speech API (`SpeechRecognition`),
so the separate Python Whisper speech service is not required for this
version.

## Features

-   Speech-to-text using browser speech recognition
-   Language selection for supported languages:
    -   English (US)
    -   English (India)
    -   Hindi
    -   Telugu
    -   Kannada
    -   Tamil
    -   Spanish
    -   French
-   Start and stop speech recognition
-   View recognized text before saving
-   Save transcriptions to a MySQL database through the backend API
-   View transcription history
-   Search and filter saved transcriptions
-   Edit and delete saved transcriptions

> **Browser note:** Speech recognition support varies by browser. Google
> Chrome is recommended. Recognition may require an internet connection,
> and language availability or accuracy depends on the browser's speech
> service.

## Technology Stack

### Frontend

-   React
-   Vite
-   JavaScript
-   CSS
-   Web Speech API

### Backend

-   Java
-   Spring Boot
-   REST API

### Database

-   MySQL

## Project Structure

``` text
procucev-speech-to-text/
├── frontend/       # React + Vite application
└── backend/        # Java Spring Boot REST API
```

The Python `speech-service/` folder was removed from this version
because the frontend uses browser-based speech recognition.

## Prerequisites

Install the following before running the project:

-   Node.js and npm
-   Java Development Kit (JDK), compatible with the backend project
-   Maven, if the backend project does not include the Maven wrapper
-   MySQL Server
-   Google Chrome or another browser that supports the Web Speech API

## Configuration

### 1. Configure MySQL

1.  Start MySQL Server.
2.  Create the database configured for your backend.
3.  Open the backend configuration file, commonly
    `backend/src/main/resources/application.properties`.
4.  Confirm the database URL, username, password, and driver settings
    match your local MySQL setup.

Example configuration (replace the example values with your own):

``` properties
spring.datasource.url=jdbc:mysql://localhost:3306/speech_to_text
spring.datasource.username=YOUR_MYSQL_USERNAME
spring.datasource.password=YOUR_MYSQL_PASSWORD
spring.datasource.driver-class-name=com.mysql.cj.jdbc.Driver
```

Do not commit real database passwords or other secrets to a public
repository.

### 2. Backend API

The frontend is configured to call:

``` text
http://localhost:8080/api/transcriptions
```

Make sure the Spring Boot backend is configured to run on port `8080`
and that its CORS settings allow requests from the Vite frontend origin,
usually `http://localhost:5173`.

## Run Locally

### 1. Start the backend

Open a terminal in the backend directory:

``` cmd
cd backend
```

If the project includes the Maven wrapper on Windows, run:

``` cmd
mvnw.cmd spring-boot:run
```

Otherwise, if Maven is installed, run:

``` cmd
mvn spring-boot:run
```

Wait for Spring Boot to start. The API should be available at
`http://localhost:8080`.

### 2. Start the frontend

Open a second terminal:

``` cmd
cd frontend
npm install
npm run dev
```

Open the local URL printed by Vite, usually:

``` text
http://localhost:5173
```

Keep both the backend and frontend terminals running while using the
application.

## How to Use

1.  Open the application in a supported browser.
2.  Select a language from the language dropdown.
3.  Allow microphone access when prompted.
4.  Select **Start** (or the equivalent recording button) and speak
    clearly.
5.  Stop recognition when finished.
6.  Review the recognized text.
7.  Save the transcription to store it in the database.
8.  Use the history section to search, filter, edit, or delete saved
    records.

Button labels may vary depending on the current frontend implementation.

## Troubleshooting

### Speech recognition is not supported

-   Try Google Chrome.
-   Check that the browser is up to date.
-   Browser speech recognition is not supported consistently across all
    browsers.

### Microphone access is denied

-   Allow microphone access in the browser's site settings.
-   Check that the correct microphone is selected and working.

### Transcription history does not load

-   Confirm the Spring Boot backend is running on port `8080`.
-   Check the browser console and backend terminal for errors.
-   Confirm the frontend API URL matches the backend URL.
-   Check backend CORS settings.

### Saving a transcription fails

-   Confirm MySQL is running.
-   Verify the database name and credentials in the backend
    configuration.
-   Check that the backend database table/schema is initialized as
    expected.

## Important Notes

-   This version uses browser-based speech recognition, not a
    self-hosted Whisper model.
-   Browser recognition quality and supported languages vary by browser
    and speech service.
-   If an assignment explicitly requires a self-deployed, open-source
    speech-to-text service, confirm that browser-based recognition
    satisfies the requirement before submitting.

## Future Improvements

-   Add authentication and user-specific transcription history
-   Improve error handling and accessibility
-   Add export options for saved transcriptions
-   Add automated tests for frontend and backend features
-   Integrate a self-hosted speech-to-text engine if required

## License

Add the license required for your project before publishing or
distributing it.
