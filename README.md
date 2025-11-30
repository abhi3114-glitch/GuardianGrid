# GuardianGrid

GuardianGrid is a decentralized, offline-first communication platform designed for emergency situations where traditional internet infrastructure has failed. By creating a dynamic mesh network using available devices, it ensures that critical messages, SOS signals, and situational data can be routed reliably to aid responders.

## Project Overview

When disaster strikes, communication is often the first casualty. GuardianGrid aims to restore this lifeline by turning devices into relay nodes.

*   **No Internet Required**: Operates over local connections (simulated via WebSockets for the current version).
*   **Self-Healing**: Automatically reroutes around failed nodes to ensure message delivery.
*   **AI-Powered Analysis**: Monitors network health and suggests optimizations in real-time.
*   **Risk Classification**: Categorizes network stability (Low, Medium, Critical) based on performance metrics.

## Key Features

*   **Offline-First Mesh Network**: Enables communication in dead zones by creating a dynamic peer-to-peer network.
*   **Smart Routing Algorithm**: Uses Breadth-First Search (BFS) to find the most efficient path for messages, automatically rerouting if a node fails.
*   **Emergency Broadcast System**: Instantly send high-priority SOS alerts that override standard traffic with visual and audio indicators.
*   **Real-Time Visualization**: Interactive dashboard to view network topology, active nodes, and message flow.
*   **AI Network Insights**: Analyzes latency and packet drop rates to provide actionable recommendations for network stability.
*   **Cross-Platform Support**: Built as a Progressive Web App (PWA) to run on laptops, tablets, and smartphones.

## Architecture

*   **Backend**: Node.js, Express, Socket.io
    *   Handles mesh management, routing logic, and metric aggregation.
*   **Frontend**: React, TypeScript, TailwindCSS, Recharts
    *   Provides a dashboard for visualization, node control, and system monitoring.
*   **Simulation**: In-memory graph structure for topology and routing logic.

## Prerequisites

Before you begin, ensure you have the following installed on your machine:

*   [Node.js](https://nodejs.org/) (Version 18 or higher)
*   [Git](https://git-scm.com/) (for cloning the repository)
*   npm (Node Package Manager, comes with Node.js)

## Installation

Follow these steps to set up the project locally on your laptop:

1.  **Clone the Repository**
    Open your terminal or command prompt and run:
    ```bash
    git clone https://github.com/abhi3114-glitch/GuardianGrid.git
    cd GuardianGrid
    ```

2.  **Install Dependencies**
    You need to install dependencies for both the backend and frontend.

    **Backend:**
    ```bash
    cd backend
    npm install
    ```

    **Frontend:**
    Open a new terminal tab or navigate back to the root and then to frontend:
    ```bash
    cd ../frontend
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
### Dashboard Overview
The dashboard serves as the central command center, offering the following views:

*   **Home**: Displays high-level network statistics (Active Nodes, Success Rate, Latency) and critical emergency tools.
    *   **Emergency Status**: Quickly broadcast your status (Safe, Help Needed, Critical) to the network.
    *   **Battery Monitor**: Tracks device battery levels to ensure node longevity.
    *   **Resource Request**: Request specific aid items like Water, Medical Supplies, or Food.
*   **Mesh**: Visualizes the network topology and allows for node management.
    *   **Map View**: Real-time geographical tracking of nodes using GPS coordinates.
    *   **Location Sharing**: Share your precise location with other nodes in the mesh.
*   **Chat**: Facilitates group communication across the mesh.
*   **Tools**: Provides emergency utilities and installation options.
    *   **Emergency Contacts**: Manage and notify designated contacts in case of an alert.
    *   **Broadcast SOS**: Trigger a high-priority alarm across the entire mesh network.

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
