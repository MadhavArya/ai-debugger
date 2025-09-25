# 🤖 AI-Powered Code Debugger

## ✨ Project Overview

This is a full-stack web application that uses Google Gemini 1.5 Pro to analyze and debug code. Users can submit code snippets and receive immediate, AI-generated explanations and fixes. The application stores a history of all interactions in a MongoDB database, accessible via a dynamic, collapsible sidebar.

The UI is designed to be modern and minimalistic, inspired by the Google Gemini interface, providing a smooth and intuitive user experience.

## 🌟 Key Features

* **Real-time AI Analysis**: Integrates with the Google Gemini 1.5 Pro API for instant code debugging.
* **Full-Stack Architecture**: Built with a React frontend and a Java/Spring Boot backend.
* **Data Persistence**: All requests and responses are saved to a MongoDB database for chat history.
* **Dynamic UI**: Features a collapsible sidebar, an auto-resizing input area, and dynamic chat bubbles that render both text and syntax-highlighted code.
* **User-Friendly Design**: An aesthetically pleasing dark theme with a clean, conversational layout.

## 🛠️ Tech Stack

**Frontend:**
* **React** - UI Library
* **Vite** - Frontend Tooling
* **React Icons** - For modern icons
* **React Markdown** - To render AI's formatted output

**Backend:**
* **Java 24** - Programming Language
* **Spring Boot** - Web Framework
* **Maven** - Dependency Management

**Database & AI:**
* **MongoDB** - NoSQL Database
* **Google Gemini 1.5 Pro** - Large Language Model

## ⚙️ How to Run the Project

### Prerequisites

Make sure you have the following installed on your machine:

-   **Java 24**
-   **Node.js (LTS)**
-   **Maven**
-   **MongoDB**: A running instance (local or via Docker).

### Backend Setup

1.  Clone this repository:
    `git clone https://github.com/YOUR_GITHUB_USERNAME/ai-powered-code-debugger.git`
2.  Navigate to the backend directory:
    `cd ai-powered-code-debugger/ai-debugger-backend`
3.  Create an `application.properties` file inside `src/main/resources/`.
4.  Add your Google Gemini API key to this file:
    `google.api.key=YOUR_API_KEY_HERE`
    (This file is in `.gitignore` for security.)
5.  Start the Spring Boot application:
    `mvn spring-boot:run`

### Frontend Setup

1.  Navigate to the frontend directory:
    `cd ../ai-debugger-frontend`
2.  Install the required packages:
    `npm install`
3.  Start the development server:
    `npm run dev`

The frontend will be available at `http://localhost:5173`. It will automatically proxy API calls to the backend.

## 📈 Project Workflow Diagram

The diagram below illustrates the complete data flow from the frontend to the backend, the LLM, and the database.

_**[A description of the data flow diagram would go here, like this:]**_

```mermaid
graph TD
    A[Frontend: User Input] -->|POST /api/gemini/analyze| B(Backend: GeminiController)
    B --> C{Backend Service: GeminiService}
    C -->|HTTP POST| D(Google Gemini 1.5 API)
    D -->|Response| C
    C -->|Save to DB| E[MongoDB: debug_history]
    C -->|Return Response| B
    B --> A
    A -->|GET /api/history| C
    C -->|Retrieve Data| E
    E -->|Return Data| C
    C --> A
