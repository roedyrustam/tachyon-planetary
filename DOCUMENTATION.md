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

## 6. Supported Media Formats
### Video
The platform supports **AVC/H.264** for standard compatibility and **HEVC/H.265** for high-efficiency 4K streaming.

### Audio
Standard **AAC-LC** is preferred for high-fidelity audio, with legacy support for **MP3**.

## 7. FFmpeg Optimization Guide
For the best results with StreamPulse, use the following FFmpeg flags:

### 1080p 60fps (Recommended)
```bash
-vcodec libx264 -preset veryfast -b:v 6000k -maxrate 6000k -bufsize 12000k -g 120
```

### 4K 60fps (HEVC)
```bash
-vcodec libx265 -preset vertical -b:v 15000k -maxrate 15000k -bufsize 30000k -g 120
```

## 8. Deployment
The project is optimized for deployment on platforms like Vercel or Netlify via Vite's build output.

## 9. Local Hardware Access
The Live Control Room utilizes WebRTC (`navigator.mediaDevices`) for low-latency previews.
- **Permissions**: Users must grant Camera and Microphone access.
- **Security**: Hardware access requires a Secure Context (HTTPS or localhost).
- **Enumeration**: Devices are enumerated on component mount; labels may be unavailable until initial permission is granted.

## 10. Adaptive HLS Transcoding
To produce a multi-bitrate HLS stream from a single source, use the following template:

### Multi-Variant FFmpeg Example
```bash
ffmpeg -i rtmp://localhost/live/stream -filter_complex \
  "[0:v]split=3[v1][v2][v3]; \
  [v1]scale=w=1920:h=1080[v1out]; \
  [v2]scale=w=1280:h=720[v2out]; \
  [v3]scale=w=854:h=480[v3out]" \
  -map "[v1out]" -c:v:0 libx264 -b:v:0 6000k \
  -map "[v2out]" -c:v:1 libx264 -b:v:1 3500k \
  -map "[v3out]" -c:v:2 libx264 -b:v:2 1500k \
  -map a:0 -c:a aac -b:a 128k \
  -f hls -hls_time 4 -hls_playlist_type event \
  -master_pl_name index.m3u8 \
  -var_stream_map "v:0,a:0 v:1,a:0 v:2,a:0" \
  "stream_%v.m3u8"
```

### Key Parameters
- `-filter_complex`: Splits the input and scales to multiple resolutions.
- `-var_stream_map`: Links specific video variants to their shared audio track.
- `-master_pl_name`: Generates the top-level manifest for adaptive players.
