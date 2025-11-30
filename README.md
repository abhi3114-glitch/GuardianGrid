# GuardianGrid

GuardianGrid is a decentralized, offline-first communication platform designed for emergency situations where traditional internet infrastructure has failed. By creating a dynamic mesh network using available devices, it ensures that critical messages, SOS signals, and situational data can be routed reliably to aid responders.

## Project Overview

When disaster strikes, communication is often the first casualty. GuardianGrid aims to restore this lifeline by turning devices into relay nodes.

*   **No Internet Required**: Operates over local connections (simulated via WebSockets for the current version).
*   **Self-Healing**: Automatically reroutes around failed nodes to ensure message delivery.
*   **AI-Powered Analysis**: Monitors network health and suggests optimizations in real-time.
*   **Risk Classification**: Categorizes network stability (Low, Medium, Critical) based on performance metrics.

## Architecture

*   **Backend**: Node.js, Express, Socket.io
    *   Handles mesh management, routing logic, and metric aggregation.
*   **Frontend**: React, TypeScript, TailwindCSS, Recharts
    *   Provides a dashboard for visualization, node control, and system monitoring.
*   **Simulation**: In-memory graph structure for topology and routing logic.

## Prerequisites

*   Node.js 18 or higher
*   npm (Node Package Manager)

## Installation

1.  Clone the repository.
2.  Install dependencies for both backend and frontend:

    **Backend:**
    ```bash
    cd backend
    npm install
    ```

    **Frontend:**
    ```bash
    cd frontend
    npm install --legacy-peer-deps
    ```

## Running the Application

To run the application locally, you must start both the backend and frontend servers.

### 1. Start the Backend

The backend server runs on port 3001.

```bash
cd backend
npm run dev
```

### 2. Start the Frontend

The frontend server runs on port 5173.

```bash
cd frontend
npm run dev
```

**Important Note on HTTPS:**
The frontend application is configured to use HTTPS to support Progressive Web App (PWA) features and secure context requirements.
*   Access the application at: **https://localhost:5173**
*   You may encounter a security warning regarding a self-signed certificate. You must proceed past this warning (typically via "Advanced" > "Proceed") to access the dashboard.

## Usage Guide

### Dashboard Overview
The dashboard serves as the central command center, offering the following views:
*   **Home**: Displays high-level network statistics (Active Nodes, Success Rate, Latency).
*   **Mesh**: Visualizes the network topology and allows for node management.
*   **Chat**: Facilitates group communication across the mesh.
*   **Tools**: Provides emergency utilities and installation options.

### Simulating Network Activity
Since this is a simulation environment, you can control the mesh topology directly from the dashboard:
1.  Navigate to the **Mesh** tab.
2.  Use **Add Random Node** to populate the network.
3.  Use **Simulate Traffic** to generate message flow between nodes.
4.  Use **Broadcast SOS** to test emergency alert propagation.

### AI Network Analysis
The system continuously analyzes network performance metrics such as packet drop rates and latency. It provides a narrative report with actionable suggestions, such as deploying additional relay nodes or optimizing route paths, to improve network stability.

## Project Structure

*   `backend/`: Server-side code, API endpoints, and mesh logic.
    *   `src/services/`: Core logic for MeshManager, Routing, and Insights.
*   `frontend/`: Client-side React application.
    *   `src/components/`: Reusable UI components.
    *   `src/context/`: State management (SocketContext).
    *   `src/pages/`: Main application views (Dashboard).

## License

This project is licensed under the ISC License.
