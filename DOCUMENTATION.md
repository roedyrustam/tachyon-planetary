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

## 4. Coding Standards
- Lint your code before committing: `npm run lint`.
- Follow the project's atomic design pattern for UI components.

## 5. Deployment
The project is optimized for deployment on platforms like Vercel or Netlify via Vite's build output.
