# Frontend Setup & Run Instructions

## ChainLearn Frontend (Next.js)

### Prerequisites

1. **Node.js** (v18 or higher) - [Download here](https://nodejs.org/)
2. **pnpm** (recommended) or **npm**

### Install pnpm (if not installed)

```powershell
npm install -g pnpm
```

Or using npm:

```powershell
npm install -g pnpm
```

### Step 1: Install Dependencies

Open a new PowerShell terminal in the project root (`E:\major`) and run:

```powershell
pnpm install
```

Or if you prefer npm:

```powershell
npm install
```

### Step 2: Run the Frontend

Start the development server:

```powershell
pnpm dev
```

Or with npm:

```powershell
npm run dev
```

### Step 3: Access the Application

Once running, open your browser and navigate to:

**http://localhost:3000**

### Running Both Frontend and Backend

You'll need **TWO terminal windows**:

#### Terminal 1 - Backend (Flask)
```powershell
cd backend
python app.py
```
Backend runs on: **http://localhost:5000**

#### Terminal 2 - Frontend (Next.js)
```powershell
pnpm dev
```
Frontend runs on: **http://localhost:3000**

### Available Scripts

- `pnpm dev` - Start development server (port 3000)
- `pnpm build` - Build for production
- `pnpm start` - Start production server
- `pnpm lint` - Run ESLint

### Troubleshooting

#### Port 3000 already in use?
```powershell
# Kill process on port 3000 (Windows)
netstat -ano | findstr :3000
taskkill /PID <PID> /F
```

#### Dependencies not installing?
```powershell
# Clear cache and reinstall
pnpm store prune
rm -rf node_modules
rm pnpm-lock.yaml
pnpm install
```

#### Module not found errors?
Make sure you've run `pnpm install` in the project root directory.

### Project Structure

```
major/
├── app/              # Next.js app directory
├── components/       # React components
├── lib/             # Utilities (blockchain.ts, utils.ts)
├── public/          # Static assets
├── backend/         # Flask backend (separate)
└── package.json     # Frontend dependencies
```

### Connecting Frontend to Backend

The frontend is configured to connect to the backend at:
- **API Base URL**: `http://localhost:5000/api`

Make sure both servers are running for full functionality!

