# VESIT Food Donation Platform

A comprehensive full-stack food donation platform solving the critical challenge of food waste and hunger through innovative technology. The platform connects food donors with recipients in need, enabling efficient food redistribution while reducing waste and addressing food insecurity in communities.

## 🎯 Problem Statement

**Solving Food Waste and Hunger Through Technology**

Every year, millions of tons of food are wasted while millions of people go hungry. The VESIT Food Donation Platform addresses this critical social challenge by:

- **Reducing Food Waste**: Connecting surplus food with those who need it
- **Addressing Food Insecurity**: Providing access to nutritious food for vulnerable populations
- **Building Community**: Creating a network of donors, recipients, and delivery agents
- **Ensuring Food Safety**: Implementing proper tracking and quality control measures
- **Optimizing Logistics**: Streamlining pickup and delivery processes

## 🚀 Features

### Backend (Node.js + Express)
- **RESTful API** with JWT authentication
- **MongoDB** integration with Mongoose ODM
- **User Management** - registration, login, profile management
- **Food Donation System** - donate, track, and manage food items
- **Recipient Management** - food requests and tracking
- **Delivery Coordination** - assign and track deliveries
- **CORS** enabled for cross-origin requests

### Frontend (React Native + Expo)
- **Cross-platform** mobile application (iOS & Android)
- **Modern UI** with Tailwind CSS and NativeWind
- **Navigation** with Expo Router
- **Authentication** flow with AsyncStorage
- **Real-time** updates and notifications
- **Responsive** design for all screen sizes

### Web Dashboard (React + Vite)
- **Modern React** application with Vite build tool
- **Tailwind CSS** for styling
- **React Router** for navigation
- **Responsive** web interface

### AI-Powered Features (Flask)
- **Speech Recognition** for voice-based interactions
- **Image Processing** with Pillow
- **AI Integration** with Google Generative AI
- **Smart Food Classification** and recommendations

## 🏗️ System Architecture

```mermaid
graph TB
    subgraph "Client Layer"
        A[Mobile App - React Native] 
        B[Web Dashboard - React]
        C[AI Assistant - Flask]
    end
    
    subgraph "API Gateway"
        D[Express.js Backend]
        E[JWT Authentication]
        F[Rate Limiting]
        G[CORS Middleware]
    end
    
    subgraph "Service Layer"
        H[User Service]
        I[Food Donation Service]
        J[Delivery Service]
        K[Notification Service]
        L[AI Service]
    end
    
    subgraph "Data Layer"
        M[MongoDB Atlas]
        N[Redis Cache]
        O[File Storage]
    end
    
    subgraph "External Services"
        P[Google Maps API]
        Q[Push Notifications]
        R[Payment Gateway]
    end
    
    A --> D
    B --> D
    C --> D
    D --> H
    D --> I
    D --> J
    D --> K
    D --> L
    H --> M
    I --> M
    J --> M
    K --> N
    L --> O
    D --> P
    D --> Q
    D --> R
    
    style A fill:#e3f2fd
    style B fill:#e8f5e8
    style C fill:#fff3e0
    style D fill:#f3e5f5
    style M fill:#e1f5fe
```

## 📁 Project Structure

```mermaid
graph TD
    A[VESIT Project] --> B[backend-node]
    A --> C[app-native]
    A --> D[frontend]
    A --> E[all_flask]
    A --> F[schema]
    
    B --> B1[config/dbConn.js]
    B --> B2[controllers/]
    B --> B3[middleware/]
    B --> B4[models/]
    B --> B5[routes/]
    B --> B6[index.js]
    B --> B7[package.json]
    
    B2 --> B2A[authController.js]
    B2 --> B2B[userController.js]
    B2 --> B2C[deliveryController.js]
    B2 --> B2D[recipientController.js]
    
    B3 --> B3A[auth.js]
    B3 --> B3B[authMiddleware.js]
    B3 --> B3C[verifyJwt.js]
    
    B4 --> B4A[user.js]
    B4 --> B4B[donor.js]
    B4 --> B4C[recipient.js]
    B4 --> B4D[delivery.js]
    B4 --> B4E[deliveryAgent.js]
    B4 --> B4F[foodListing.js]
    B4 --> B4G[foodReq.js]
    B4 --> B4H[transactions.js]
    
    B5 --> B5A[authRoutes.js]
    B5 --> B5B[userRoutes.js]
    B5 --> B5C[deliveryRoutes.js]
    B5 --> B5D[recipientRoutes.js]
    
    C --> C1[app/]
    C --> C2[components/]
    C --> C3[context/]
    C --> C4[src/]
    C --> C5[assets/]
    C --> C6[package.json]
    
    C1 --> C1A[dashboard.jsx]
    C1 --> C1B[login.jsx]
    C1 --> C1C[signup.jsx]
    C1 --> C1D[donate.jsx]
    C1 --> C1E[household/]
    C1 --> C1F[delivery/]
    C1 --> C1G[recipient/]
    
    C4 --> C4A[config.js]
    C4 --> C4B[services/]
    
    D --> D1[src/]
    D --> D2[public/]
    D --> D3[package.json]
    D --> D4[vite.config.js]
    
    E --> E1[vinayak_flask/]
    E --> E2[pyproject.toml]
    E --> E3[poetry.lock]
    
    F --> F1[users.json]
    F --> F2[recipients.json]
    F --> F3[transactions.json]
    F --> F4[food_requests.json]
    F --> F5[food_listings.json]
    F --> F6[deliveries.json]
    F --> F7[delivery_agents.json]
    F --> F8[donors.json]
    
    style A fill:#e1f5fe
    style B fill:#f3e5f5
    style C fill:#e8f5e8
    style D fill:#fff3e0
    style E fill:#fce4ec
    style F fill:#f1f8e9
```

## 🔄 API Flow (Frontend → Backend)

```mermaid
sequenceDiagram
    participant U as User
    participant MA as Mobile App
    participant WA as Web App
    participant AI as AI Assistant
    participant API as Backend API
    participant DB as MongoDB
    participant Cache as Redis
    
    U->>MA: Open Mobile App
    MA->>API: GET /auth/verify
    API->>DB: Check JWT Token
    DB->>API: User Data
    API->>MA: User Profile
    
    U->>MA: Donate Food
    MA->>API: POST /user/donate
    API->>DB: Save Food Listing
    DB->>API: Confirmation
    API->>Cache: Update Cache
    API->>MA: Success Response
    
    U->>WA: Access Web Dashboard
    WA->>API: GET /user/donations
    API->>Cache: Check Cache
    alt Cache Hit
        Cache->>API: Cached Data
    else Cache Miss
        API->>DB: Query Donations
        DB->>API: Donation Data
        API->>Cache: Store Data
    end
    API->>WA: Donation List
    
    U->>AI: Voice Command
    AI->>API: POST /ai/process
    API->>AI: Process Request
    AI->>U: Voice Response
```

## 🔐 Authentication State Machine

```mermaid
stateDiagram-v2
    [*] --> Unauthenticated
    Unauthenticated --> Login: User enters credentials
    Unauthenticated --> Register: User creates account
    Unauthenticated --> ForgotPassword: User requests reset
    
    Login --> Authenticating: Submit credentials
    Authenticating --> Authenticated: Valid credentials
    Authenticating --> LoginError: Invalid credentials
    LoginError --> Login: Retry login
    
    Register --> Registering: Submit registration
    Registering --> Authenticated: Registration successful
    Registering --> RegisterError: Registration failed
    RegisterError --> Register: Retry registration
    
    ForgotPassword --> PasswordReset: Send reset email
    PasswordReset --> Unauthenticated: Reset link sent
    
    Authenticated --> TokenRefresh: Token expires soon
    TokenRefresh --> Authenticated: Token refreshed
    TokenRefresh --> Unauthenticated: Refresh failed
    
    Authenticated --> Logout: User logs out
    Authenticated --> Unauthenticated: Token expired
    
    Logout --> Unauthenticated: Clear session
    
    style Unauthenticated fill:#ffebee
    style Authenticated fill:#e8f5e8
    style Authenticating fill:#fff3e0
    style LoginError fill:#ffebee
    style RegisterError fill:#ffebee
```

## 🗄️ Database ER Diagram

```mermaid
erDiagram
    USERS {
        string _id PK
        string email UK
        string password
        string name
        string phone
        string address
        string userType
        string profileImage
        boolean isVerified
        date createdAt
        date updatedAt
    }
    
    FOOD_LISTINGS {
        string _id PK
        string donorId FK
        string foodName
        string description
        number quantity
        string unit
        date expiryDate
        string status
        string pickupAddress
        array images
        string dietaryInfo
        boolean isPerishable
        date createdAt
        date updatedAt
    }
    
    RECIPIENTS {
        string _id PK
        string userId FK
        string requestType
        string foodPreferences
        number familySize
        string urgency
        string status
        string dietaryRestrictions
        string address
        date createdAt
        date updatedAt
    }
    
    DELIVERIES {
        string _id PK
        string foodListingId FK
        string recipientId FK
        string agentId FK
        string status
        date pickupTime
        date deliveryTime
        string notes
        string trackingCode
        number estimatedDuration
        date createdAt
        date updatedAt
    }
    
    DELIVERY_AGENTS {
        string _id PK
        string name
        string phone
        string email
        string vehicleType
        string status
        string currentDeliveryId FK
        string licenseNumber
        date createdAt
        date updatedAt
    }
    
    TRANSACTIONS {
        string _id PK
        string donorId FK
        string recipientId FK
        string deliveryId FK
        string transactionType
        number amount
        string status
        string paymentMethod
        date createdAt
        date updatedAt
    }
    
    NOTIFICATIONS {
        string _id PK
        string userId FK
        string type
        string title
        string message
        boolean isRead
        date createdAt
    }
    
    USERS ||--o{ FOOD_LISTINGS : "donates"
    USERS ||--o{ RECIPIENTS : "requests"
    USERS ||--o{ NOTIFICATIONS : "receives"
    FOOD_LISTINGS ||--o{ DELIVERIES : "delivered"
    RECIPIENTS ||--o{ DELIVERIES : "receives"
    DELIVERY_AGENTS ||--o{ DELIVERIES : "handles"
    DELIVERIES ||--o{ TRANSACTIONS : "generates"
    USERS ||--o{ TRANSACTIONS : "participates"
```

## 🚀 Deployment Flow

```mermaid
graph TB
    subgraph "Development Environment"
        A[Local Development] --> B[Backend: localhost:4000]
        A --> C[Mobile: Expo Dev Server]
        A --> D[Web: localhost:5173]
        A --> E[AI: localhost:5000]
        A --> F[MongoDB: localhost:27017]
    end
    
    subgraph "Staging Environment"
        G[Staging Server] --> H[Backend Container]
        G --> I[Web Container]
        G --> J[AI Container]
        G --> K[MongoDB Atlas]
        G --> L[Redis Cache]
    end
    
    subgraph "Production Environment"
        M[Cloud Platform] --> N[Load Balancer]
        N --> O[Backend Instances]
        N --> P[Web Instances]
        N --> Q[AI Instances]
        
        O --> R[MongoDB Atlas]
        P --> R
        Q --> R
        
        S[Mobile App] --> N
        T[Web Dashboard] --> N
        U[AI Assistant] --> N
    end
    
    subgraph "CI/CD Pipeline"
        V[Git Push] --> W[GitHub Actions]
        W --> X[Run Tests]
        X --> Y[Build Images]
        Y --> Z[Deploy to Staging]
        Z --> AA[Run Integration Tests]
        AA --> BB[Deploy to Production]
        BB --> CC[Health Checks]
        CC --> DD[Monitor & Alert]
    end
    
    style A fill:#e8f5e8
    style G fill:#fff3e0
    style M fill:#f3e5f5
    style V fill:#e3f2fd
```

## 🔄 Microservice Communication

```mermaid
graph TB
    subgraph "API Gateway"
        A[Express.js Gateway]
        B[Rate Limiter]
        C[Authentication]
        D[Request Router]
    end
    
    subgraph "Core Services"
        E[User Service]
        F[Food Service]
        G[Delivery Service]
        H[Notification Service]
        I[Payment Service]
        J[AI Service]
    end
    
    subgraph "Data Services"
        K[MongoDB]
        L[Redis Cache]
        M[File Storage]
        N[Message Queue]
    end
    
    subgraph "External Services"
        O[Google Maps]
        P[Push Notifications]
        Q[Payment Gateway]
        R[Email Service]
    end
    
    A --> B
    A --> C
    A --> D
    
    D --> E
    D --> F
    D --> G
    D --> H
    D --> I
    D --> J
    
    E --> K
    F --> K
    G --> K
    H --> L
    I --> N
    J --> M
    
    G --> O
    H --> P
    I --> Q
    H --> R
    
    style A fill:#e3f2fd
    style E fill:#e8f5e8
    style K fill:#f3e5f5
    style O fill:#fff3e0
```

## 🔄 CI/CD Pipeline Overview

```mermaid
graph LR
    subgraph "Source Control"
        A[Git Repository]
        B[Feature Branches]
        C[Main Branch]
    end
    
    subgraph "Build & Test"
        D[GitHub Actions]
        E[Install Dependencies]
        F[Run Linting]
        G[Unit Tests]
        H[Integration Tests]
        I[Build Applications]
    end
    
    subgraph "Quality Gates"
        J[Code Coverage]
        K[Security Scan]
        L[Performance Tests]
        M[Dependency Check]
    end
    
    subgraph "Deployment"
        N[Staging Environment]
        O[Automated Testing]
        P[Manual Review]
        Q[Production Deployment]
        R[Health Monitoring]
    end
    
    subgraph "Monitoring"
        S[Application Metrics]
        T[Error Tracking]
        U[Performance Monitoring]
        V[User Analytics]
    end
    
    A --> D
    B --> D
    C --> D
    
    D --> E
    E --> F
    F --> G
    G --> H
    H --> I
    
    I --> J
    J --> K
    K --> L
    L --> M
    
    M --> N
    N --> O
    O --> P
    P --> Q
    Q --> R
    
    R --> S
    S --> T
    T --> U
    U --> V
    
    style A fill:#e8f5e8
    style D fill:#e3f2fd
    style J fill:#fff3e0
    style N fill:#f3e5f5
    style S fill:#fce4ec
```

## 🛠️ Technologies Used

### Backend (`backend-node/`)
- **Node.js** - JavaScript runtime
- **Express.js** - Web framework
- **MongoDB** - NoSQL database
- **Mongoose** - ODM for MongoDB
- **JWT** - Authentication
- **bcrypt** - Password hashing
- **CORS** - Cross-origin resource sharing
- **nodemon** - Development server

### Mobile App (`app-native/`)
- **React Native** - Cross-platform mobile framework
- **Expo** - Development platform
- **Expo Router** - Navigation
- **NativeWind** - Tailwind CSS for React Native
- **AsyncStorage** - Local storage
- **React Navigation** - Navigation library
- **Expo Vector Icons** - Icon library

### Web Dashboard (`frontend/`)
- **React** - Frontend library
- **Vite** - Build tool
- **Tailwind CSS** - Utility-first CSS
- **React Router** - Client-side routing
- **ESLint** - Code linting

### AI Assistant (`all_flask/`)
- **Flask** - Python web framework
- **PyMongo** - MongoDB driver
- **SpeechRecognition** - Voice processing
- **Pillow** - Image processing
- **Google Generative AI** - AI integration
- **Poetry** - Dependency management

## 🚀 Installation

### Prerequisites

- **Node.js** (v18 or higher)
- **Python** (v3.10 or higher)
- **MongoDB** (local or cloud instance)
- **npm** or **yarn** package manager
- **Expo CLI** (for React Native development)
- **Android Studio** / **Xcode** (for mobile development)
- **Poetry** (for Python dependencies)

### Method 1: Manual Setup

#### 1. Backend Setup
```bash
# Navigate to backend directory
cd backend-node

# Install dependencies
npm install

# Environment Configuration
cp .env.example .env
```

Edit `.env` file:
```env
PORT=4000
MONGO_URI=mongodb://localhost:27017/vesit_food_donation
JWT_SECRET=your_jwt_secret_key_here
NODE_ENV=development
```

```bash
# Start MongoDB (if local)
mongod

# Run backend server
npm run dev
```

#### 2. Mobile App Setup
```bash
# Navigate to mobile app directory
cd app-native

# Install dependencies
npm install

# Start Expo development server
npm start
```

#### 3. Web Dashboard Setup
```bash
# Navigate to frontend directory
cd frontend

# Install dependencies
npm install

# Start development server
npm run dev
```

#### 4. AI Assistant Setup
```bash
# Navigate to Flask directory
cd all_flask

# Install Poetry (if not installed)
curl -sSL https://install.python-poetry.org | python3 -

# Install dependencies
poetry install

# Activate virtual environment
poetry shell

# Run Flask application
python vinayak_flask/app.py
```

### Method 2: Docker Compose Setup

#### Quick Start with Docker
```bash
# Clone the repository
git clone <repository-url>
cd VESIT

# Build and run all services
docker-compose up --build

# Run in background
docker-compose up -d

# Stop services
docker-compose down
```

#### Individual Docker Services
```bash
# Backend only
cd backend-node
docker build -t vesit-backend .
docker run -p 4000:4000 --env-file .env vesit-backend

# Web Dashboard only
cd frontend
docker build -t vesit-frontend .
docker run -p 5173:5173 vesit-frontend

# AI Assistant only
cd all_flask
docker build -t vesit-ai .
docker run -p 5000:5000 vesit-ai
```

## 🔧 Environment Variables

### Backend (.env)
```env
# Server Configuration
PORT=4000
NODE_ENV=development

# Database Configuration
MONGO_URI=mongodb://localhost:27017/vesit_food_donation

# JWT Configuration
JWT_SECRET=your_super_secret_jwt_key_here

# Optional: MongoDB Atlas
# MONGO_URI=mongodb+srv://username:password@cluster.mongodb.net/vesit_food_donation
```

### Frontend Configuration
Update `app-native/src/config.js`:
```javascript
export const API_URL = 'http://localhost:4000'; // Development
// export const API_URL = 'https://your-production-api.com'; // Production
```

### AI Assistant Configuration
```env
# Flask Configuration
FLASK_APP=vinayak_flask/app.py
FLASK_ENV=development
FLASK_DEBUG=1

# MongoDB Configuration
MONGO_URI=mongodb://localhost:27017/vesit_food_donation

# Google AI Configuration
GOOGLE_API_KEY=your_google_ai_api_key
```

## 📡 API Endpoints

### Authentication
- `POST /auth/register` - Register new user
- `POST /auth/login` - User login
- `POST /auth/verify` - Verify JWT token
- `POST /auth/refresh` - Refresh JWT token

### User Management (Protected)
- `GET /user/profile/:id` - Get user profile
- `PUT /user/profile/:id` - Update profile
- `DELETE /user/profile/:id` - Delete profile
- `POST /user/donate` - Donate food items
- `GET /user/food-listings/:id` - Get user's donations

### Food Management (Protected)
- `GET /food/listings` - Get all food listings
- `POST /food/listing` - Create food listing
- `PUT /food/listing/:id` - Update food listing
- `DELETE /food/listing/:id` - Delete food listing

### Delivery (Protected)
- `GET /delivery/agents` - Get delivery agents
- `POST /delivery/assign` - Assign delivery
- `GET /delivery/status/:id` - Get delivery status
- `PUT /delivery/status/:id` - Update delivery status

### Recipient (Protected)
- `GET /recipient/requests` - Get food requests
- `POST /recipient/request` - Create food request
- `PUT /recipient/request/:id` - Update request

### AI Assistant
- `POST /ai/process` - Process voice/image input
- `GET /ai/status` - Get AI service status

## 🔒 Authentication

The API uses JWT tokens. Include in request headers:
```
Authorization: Bearer <your_jwt_token>
```

## 📱 Mobile App Features

### Screens
- **Dashboard** - Overview of donations and requests
- **Login/Signup** - User authentication
- **Donate** - Food donation interface
- **Household** - Manage household donations
- **Delivery** - Track deliveries
- **Recipient** - Food request management

### Navigation
- **Tab Navigation** - Main app sections
- **Stack Navigation** - Screen flows
- **Modal Navigation** - Overlay screens

## 🧪 Testing

### Backend Testing
```bash
cd backend-node
npm test
```

### Frontend Testing
```bash
cd app-native
npm test
```

### Web Dashboard Testing
```bash
cd frontend
npm test
```

### AI Assistant Testing
```bash
cd all_flask
poetry run pytest
```

## 📦 Available Scripts

### Backend
- `npm run dev` - Start development server
- `npm start` - Start production server
- `npm test` - Run tests

### Mobile App
- `npm start` - Start Expo development server
- `npm run ios` - Run on iOS simulator
- `npm run android` - Run on Android emulator
- `npm run web` - Run in web browser
- `npm test` - Run tests

### Web Dashboard
- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm test` - Run tests

### AI Assistant
- `poetry run python app.py` - Start Flask server
- `poetry run pytest` - Run tests

## 🚀 Deployment

### Backend Deployment
1. **Environment Variables** - Set production values
2. **Database** - Use MongoDB Atlas or similar
3. **Docker** - Use provided Dockerfile
4. **Platform** - Deploy to Heroku, AWS, or similar

### Frontend Deployment
1. **Build** - `expo build:android` or `expo build:ios`
2. **Publish** - `expo publish`
3. **App Stores** - Submit to Google Play/App Store

### Web Dashboard Deployment
1. **Build** - `npm run build`
2. **Deploy** - Deploy to Vercel, Netlify, or similar

### AI Assistant Deployment
1. **Environment** - Set production environment variables
2. **Deploy** - Deploy to Heroku, AWS, or similar

## 🤝 Contributing

1. Fork the repository
2. Create feature branch (`git checkout -b feature/amazing-feature`)
3. Commit changes (`git commit -m 'Add amazing feature'`)
4. Push to branch (`git push origin feature/amazing-feature`)
5. Open Pull Request

### Development Guidelines
- Follow existing code style
- Write meaningful commit messages
- Add tests for new features
- Update documentation
- Test on both iOS and Android

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 📞 Contact

- **Project Maintainer**: [Your Name]
- **Email**: [your.email@example.com]
- **GitHub**: [@yourusername]

## 🙏 Acknowledgments

- **Expo** team for the excellent React Native framework
- **Express.js** team for the robust backend framework
- **MongoDB** and **Mongoose** for data persistence
- **Tailwind CSS** and **NativeWind** for styling
- **Flask** team for the Python web framework
- All contributors who help improve this project

---

**Note**: Remember to replace placeholder values (repository URLs, contact information) with actual project details before publishing.
