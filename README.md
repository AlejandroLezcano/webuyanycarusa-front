# WeBuyAnyCar USA - Frontend

Web application developed with React 18 and Vite that allows users to value and sell their vehicles. The application offers multiple entry flows (VIN, Make/Model, License Plate) and manages the entire process from initial valuation to appointment scheduling.

## 📋 Project Description

This project is the frontend of the WeBuyAnyCar USA platform, a modern and responsive React application that allows users to:

- **Value vehicles** through three different methods:
  - VIN Number (Vehicle Identification Number)
  - Make and Model
  - Vehicle License Plate
- **Manage appointments** for in-person vehicle evaluation
- **Search nearby branches** based on location
- **Follow the complete process** from valuation to confirmation

## ✨ Main Features

- 🚗 **Multiple Valuation Flows**: VIN, Make/Model, and License Plate
- 📅 **Appointment System**: Interactive calendar to schedule evaluations (Desktop & Mobile optimized)
- 📱 **Mobile First**: Optimized mobile booking flow with OTP verification
- 📍 **Branch Search**: Locating nearby stores
- 🎨 **Modern UI**: Responsive design with Tailwind CSS
- ⚡ **Optimized Performance**: Built with Vite for fast loading
- 🎭 **Smooth Animations**: Transitions with Framer Motion
- 📊 **Integrated Tracking**: Google Tag Manager for analytics
- 🔄 **State Management**: Context API for global state
- 📝 **Form Validation**: React Hook Form with validations
- 🛡️ **Robust Error Handling**: User-friendly error messages and professional logging

## 🛠️ Technologies Used

### Core
- **React 18.2.0**: Main UI library
- **Vite 5.1.0**: Build tool and dev server
- **React Router DOM 6.22.0**: Navigation and routing (Optimized for v7)

### UI/UX
- **Tailwind CSS 3.4.1**: Utility-first style framework
- **Framer Motion 11.0.3**: Animations and transitions
- **Lucide React 0.323.0**: Modern icons

### Forms and Validation
- **React Hook Form 7.50.0**: Form handling
- **Axios 1.6.7**: HTTP client for API calls

### Utilities
- **clsx 2.1.0**: Utility for conditional CSS classes

## 📦 Prerequisites

Before starting, make sure you have installed:

- [Node.js](https://nodejs.org/) (version 18.x or higher recommended)
- [npm](https://www.npmjs.com/) (comes with Node.js) or [yarn](https://yarnpkg.com/)
- [Git](https://git-scm.com/) (optional, to clone the repository)
- A code editor like [Visual Studio Code](https://code.visualstudio.com/)

## 🚀 Installation and Setup

### Step 1: Clone or Navigate to the Project

If you have the project in a Git repository:
```bash
git clone <repository-url>
cd buy-cars/we-buy-any-car-front
```

Or simply navigate to the project folder:
```bash
cd we-buy-any-car-front
```

### Step 2: Install Dependencies

Install all project dependencies using npm:

```bash
npm install
```

Or if you prefer using yarn:
```bash
yarn install
```

This command will read the `package.json` file and download all necessary dependencies into the `node_modules` folder.

### Step 3: Configure Environment Variables

Create a `.env.development` file in the project root (next to `package.json`).
**Important:** Ensure `VITE_API_BASE_URL` points to port 5000 (where the backend runs).

```env
# Backend API base URL
VITE_API_BASE_URL=http://localhost:5000/api

# Authentication credentials for API access
VITE_AUTH_USERNAME=your_username
VITE_AUTH_PASSWORD=your_password
```

> **Note**: Environment variables in Vite must start with `VITE_` to be accessible in the code.

### Step 4: Verify Configuration

Make sure that:
- The `.env.development` file exists in the project root
- The backend API URL is correct (`http://localhost:5000/api`)
- All dependencies installed correctly

## ▶️ How to Run the Project

### Development Mode

To run the project in development mode with hot-reload:

```bash
npm run dev
```

The development server will start and you'll see a message similar to:
```
  VITE v5.1.0  ready in 500 ms

  ➜  Local:   http://localhost:3000/
  ➜  Network: use --host to expose
```

The application will automatically open in your browser at `http://localhost:3000`.

**Development Perks:**
- **Console Hygiene**: Debug logs are cleanly separated. Use `console.debug` for verbose output.
- **Hot Module Replacement (HMR)**: Changes are reflected instantly.

### Production Mode (Build)

To create an optimized version for production:

```bash
npm run build
```

This will generate a `dist/` folder with optimized and minified files ready for deployment.

### Linting

To check the code with ESLint:

```bash
npm run lint
```

## 📁 Project Structure

```
we-buy-any-car-front/
├── public/                 # Static files
├── src/
│   ├── components/         # Reusable components
│   │   ├── Appointment/    # Appointment components
│   │   ├── Home/           # Home page components
│   │   ├── Layout/         # Header, Footer, Layout
│   │   ├── Tracking/       # Google Tag Manager
│   │   ├── UI/             # Generic UI components (OTP, Modal, etc.)
│   │   └── VehiclePreview/ # Vehicle preview
│   ├── context/            # Context API (global state)
│   ├── hooks/              # Custom React hooks
│   ├── pages/              # Main pages/Views (MakeModelFlow, ManageAppointment)
│   ├── services/           # API services and HTTP calls
│   ├── utils/              # Utilities and helpers
│   ├── App.jsx             # Root app component
│   ├── App.css             # Global styles
│   ├── main.jsx            # Entry point
│   └── index.css           # Base styles
├── .env.development        # Environment variables for dev
├── .gitignore              # Files ignored by Git
├── index.html              # Main HTML
├── package.json            # Dependencies and scripts
├── vite.config.js          # Vite configuration
└── README.md               # This file
```

## 🎯 Application Flows

### 1. VIN Flow
- User enters VIN number
- VIN validation and decoding
- Vehicle information retrieval
- Continue to valuation flow

### 2. Make/Model Flow
- Vehicle year selection
- Make selection
- Model selection
- Continue to valuation flow

### 3. License Plate Flow
- Vehicle plate entry
- Validation and search
- Continue to valuation flow

### 4. Appointment Flow
- **Mobile & Desktop Support**: Optimized flows for both devices.
- **OTP Verification**: Secure 6-digit code verification via SMS.
- **Live Branch Search**: Find nearest locations.
- **Real-time Availability**: Live time slots from the backend.

## 🔌 Backend Integration

The application connects with the backend API through the `httpClient` service.
Make sure that:
1. The backend is running on `http://localhost:5000`
2. CORS is enabled on the backend for `http://localhost:3000`

### Key Endpoints Used
- `POST /api/v1/auth/login` - Authentication
- `POST /api/scheduling/otp/request` - SMS OTP Request
- `POST /api/Appointment/book` - Book Appointment
- `GET /api/v1/vehicles/...` - Vehicle Data

## 🐛 Troubleshooting

### API connection error
- Verify the backend is running (`dotnet run`).
- Verify `VITE_API_BASE_URL` in `.env.development` is `http://localhost:5000/api`.
- Check browser console (Network tab) for failed requests.

### Port Conflicts
- If port 3000 is used, Vite will try 3001. Update backend CORS if needed.
- To kill port 3000 on Mac: `lsof -ti:3000 | xargs kill -9`

## 👥 Contributors

WeBuyAnyCar USA Development Team
