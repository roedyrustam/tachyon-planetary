# Project Blueprint - StreamPulse

## 1. Tech Stack
- **Frontend Framework**: React 19 (Vite)
- **Language**: TypeScript
- **Routing**: React Router 7
- **Styling**: Vanilla CSS (Modern, Variables-based)
- **Icons**: Lucide React
- **Charts**: Recharts
- **Build Tool**: Vite

## 2. Architecture Overview
The application follows a standard React SPA architecture with a centralized layout and modular components.

### 2.1 Directory Structure
- `src/components`: UI-related components.
    - `/layout`: Base structural components (Sidebar, Header, Layout).
    - `/ui`: Atomic UI elements (Button, Card, Badge, Input).
- `src/pages`: Feature-specific top-level pages.
- `src/assets`: Static resources.

## 3. Component Architecture

### 3.1 Layout System (`src/components/layout`)
- **Layout.tsx**: The parent wrapper integrating Sidebar and Header.
- **Sidebar.tsx**: Main navigation component.
- **Header.tsx**: Contextual information and user actions.

### 3.2 UI System (`src/components/ui`)
- Uses a "Glassmorphism" design system defined in `index.css`.
- **AddDestinationModal.tsx**: Handles adding new destinations with a glassmorphism overlay and slide-up animation.
- Standardized props for variant and icon management (Button, Card, Badge, Input).

## 4. State & Logic
- Currently utilizes React `useState` and `useEffect` for local component state.
- **Chat Simulation**: Employs `setInterval` loops in `GoLive.tsx` to simulate incoming messages when the stream is active.
- **Destination Management**: Stateful array management for adding and toggling broadcast targets.
- Data is mocked in component constants (`initialDestinations`, etc.).

## 5. Design Tokens (CSS Variables)
Defined in `src/index.css`:
- `--primary`: #6366f1 (Indigo)
- `--secondary`: #10b981 (Emerald)
- `--glass-border`: Subtle white border for glass effects.
- **Modal System**: Custom styles for `.modal-overlay` (blur/fade) and `.modal-content` (slide animation).

## 6. Future Data Integration
- Integration with streaming APIs (RTMP/WebRTC).
- WebSocket connection for Unified Chat.
- Backend services for user persistence and analytics storage.
