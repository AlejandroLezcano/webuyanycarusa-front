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
- 📅 **Appointment System**: Interactive calendar to schedule evaluations
- 📍 **Branch Search**: Locating nearby stores
- 🎨 **Modern UI**: Responsive design with Tailwind CSS
- ⚡ **Optimized Performance**: Built with Vite for fast loading
- 🎭 **Smooth Animations**: Transitions with Framer Motion
- 📊 **Integrated Tracking**: Google Tag Manager for analytics
- 🔄 **State Management**: Context API for global state
- 📝 **Form Validation**: React Hook Form with validations

## 🛠️ Technologies Used

### Core
- **React 18.2.0**: Main UI library
- **Vite 5.1.0**: Build tool and dev server
- **React Router DOM 6.22.0**: Navigation and routing

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

Create a `.env` file in the project root (next to `package.json`) with the following variables:

```env
# Backend API base URL
VITE_API_BASE_URL=http://localhost:5000/api

# Authentication credentials for API access
VITE_AUTH_USERNAME=your_username
VITE_AUTH_PASSWORD=your_password

# Or for production:
# VITE_API_BASE_URL=https://api.webuyanycarusa.com/api
# VITE_AUTH_USERNAME=production_username
# VITE_AUTH_PASSWORD=production_password
```

> **Note**: Environment variables in Vite must start with `VITE_` to be accessible in the code.

> **Important**: The authentication credentials are required for the automatic token refresh functionality. Make sure to replace the placeholder values with actual credentials.

### Step 4: Verify Configuration

Make sure that:
- The `.env` file exists in the project root
- The backend API URL is correct
- All dependencies installed correctly (verify that the `node_modules` folder exists)

## ▶️ How to Run the Project

### Development Mode

To run the project in development mode with hot-reload:

```bash
npm run dev
```

Or with yarn:
```bash
yarn dev
```

The development server will start and you'll see a message similar to:
```
  VITE v5.1.0  ready in 500 ms

  ➜  Local:   http://localhost:3000/
  ➜  Network: use --host to expose
```

The application will automatically open in your browser at `http://localhost:3000`.

**Development mode features:**
- Hot Module Replacement (HMR) - Changes are reflected instantly
- Source maps for debugging
- Detailed errors in console

### Production Mode (Build)

To create an optimized version for production:

```bash
npm run build
```

Or with yarn:
```bash
yarn build
```

This will generate a `dist/` folder with optimized and minified files ready for deployment.

### Preview Production Build

To preview the production build locally:

```bash
npm run preview
```

This will start a local server that serves the files from the `dist/` folder, simulating how it will look in production.

### Linting

To check the code with ESLint:

```bash
npm run lint
```

This will show code style errors and warnings.

## 📁 Project Structure

```
we-buy-any-car-front/
├── public/                 # Static files (if any)
├── src/
│   ├── components/         # Reusable components
│   │   ├── Appointment/    # Appointment components
│   │   ├── Home/           # Home page components
│   │   ├── Layout/         # Header, Footer, Layout
│   │   ├── Tracking/       # Google Tag Manager
│   │   ├── UI/             # Generic UI components
│   │   └── VehiclePreview/ # Vehicle preview
│   ├── context/            # Context API (global state)
│   ├── hooks/              # Custom React hooks
│   ├── pages/              # Main pages/Views
│   ├── services/           # API services and HTTP calls
│   ├── utils/              # Utilities and helpers
│   ├── App.jsx             # Root app component
│   ├── App.css             # Global styles
│   ├── main.jsx            # Entry point
│   └── index.css           # Base styles
├── .env                    # Environment variables (create)
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
- Appointment type selection
- Branch selection
- Date and time selection
- Appointment confirmation

## 🔌 Backend Integration

The application connects with the backend API through the `api.js` service. Make sure that:

1. The backend is running (see backend README)
2. The `VITE_API_BASE_URL` variable in `.env` points to the correct URL
3. The backend has CORS configured to allow requests from the frontend

### Endpoints Used

- `POST /api/v1/auth/login` - Authentication
- `GET /api/v1/vehicles/years` - Get years
- `GET /api/v1/vehicles/makes/{year}` - Get makes
- `GET /api/v1/vehicles/models/{year}/{make}` - Get models
- `POST /api/v1/valuation` - Create valuation
- `POST /api/v1/appointment` - Create appointment

## 🎨 Customization

### Change Development Port

Edit `vite.config.js`:
```javascript
server: {
  port: 3000,  // Change this number
  open: true
}
```

### Configure Base URL

In `vite.config.js`:
```javascript
base: '/',  // Change this if deploying to a subdirectory
```

## 🐛 Troubleshooting

### Error: "Cannot find module"
- Run `npm install` again
- Delete `node_modules` and `package-lock.json`, then run `npm install`

### Error: "Port 3000 is already in use"
- Change the port in `vite.config.js` or kill the process using the port:
  ```bash
  # Windows
  netstat -ano | findstr :3000
  taskkill /PID <PID> /F
  
  # Mac/Linux
  lsof -ti:3000 | xargs kill
  ```

### API connection error
- Verify the backend is running
- Verify the `VITE_API_BASE_URL` variable in `.env`
- Check the browser console for CORS errors

### Hot-reload not working
- Restart the development server
- Clear browser cache
- Verify there are no syntax errors

## 📝 Available Scripts

- `npm run dev` - Start the development server
- `npm run build` - Build the application for production
- `npm run preview` - Preview the production build
- `npm run lint` - Run ESLint to check the code

## 🚀 Deployment

### Build for Production

1. Make sure the environment variables in `.env` are configured for production
2. Run the build:
   ```bash
   npm run build
   ```
3. The `dist/` folder will contain the files ready to deploy

### Deployment Options

- **Vercel**: Connect your repository and deploy automatically
- **Netlify**: Similar to Vercel, with SPA support
- **Hostinger**: Upload the `dist/` folder via FTP
- **Own server**: Configure a web server (Nginx, Apache) to serve the `dist/` folder

> **Note**: The project is configured for the domain `sellyourcarrnow.com` according to `vite.config.js`. Adjust the `base` according to your domain.

## 📊 Tracking and Analytics

The project includes integration with Google Tag Manager (GTM) through the `GTMProvider` component. Make sure to configure your GTM ID in the corresponding component.

## 🔒 Security

- Sensitive environment variables should be in `.env` and never committed
- The `.env` file is in `.gitignore` by default
- In production, use HTTPS
- Validate all user inputs

## 📄 License

This project is private and for internal use.

## 👥 Contributors

WeBuyAnyCar USA Development Team

---

**Need help?** Check the documentation for [React](https://react.dev/), [Vite](https://vitejs.dev/), or contact the development team.
