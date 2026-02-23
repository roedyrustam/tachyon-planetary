# Project Documentation - StreamPulse

## 1. Getting Started

### Prerequisites
- Node.js (v18+)
- npm

### Installation
```bash
git clone <repository-url>
cd tachyon-planetary
npm install
```

### Development
```bash
npm run dev
```
The application will be available at `http://localhost:5173`.

### Building for Production
```bash
npm run build
```

## 2. Project Structure
- `/src`: Application source code.
    - `/components`: Reusable components.
    - `/pages`: Page-level components matching routes.
    - `/assets`: Images and global styles.

## 3. Component Guidelines
- Use **TypeScript** for all new components.
- Prefer **Functional Components** with hooks.
- Follow the existing **Glassmorphism** design system in `src/index.css`.
- Use **Lucide React** for icons.
- **Modals**: Implementation should use the `.modal-overlay` and `.modal-content` classes. Always handle `onClick` propagation to allow closing on overlay click.

## 4. Coding Standards & UI Logic
- Lint your code before committing: `npm run lint`.
- Follow the project's atomic design pattern for UI components.
- **Simulations**: For interactive prototyping, use `setInterval` within `useEffect` hooks (ensure proper cleanup) to simulate real-time data flow.
- **Animations**: Use predefined keyframes (`fadeIn`, `pulse-glow`, `live-pulse`) for consistent motion design.

## 5. Deployment
The project is optimized for deployment on platforms like Vercel or Netlify via Vite's build output.
