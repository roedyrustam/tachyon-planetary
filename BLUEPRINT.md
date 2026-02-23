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
- Standardized props for variant and icon management.

## 4. State Management
- Currently utilizes React `useState` and `useEffect` for local component state.
- Data is mocked in component constants (`GO_LIVE_DATA`, etc.).

## 5. Design Tokens (CSS Variables)
Defined in `src/index.css`:
- `--primary`: #6366f1 (Indigo)
- `--secondary`: #10b981 (Emerald)
- `--danger`: #ef4444
- `--bg-dark`: Deep space themed colors.
- `--glass-bg`: Semi-transparent overlays.

## 6. Future Data Integration
- Integration with streaming APIs (RTMP/WebRTC).
- WebSocket connection for Unified Chat.
- Backend services for user persistence and analytics storage.
