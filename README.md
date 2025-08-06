# VESIT Food Donation Platform

A full-stack food donation platform built with Node.js Express backend and React Native mobile application. The platform enables users to donate food, request food, and coordinate deliveries between donors and recipients.

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

## 📁 Project Structure

```mermaid
graph TD
    A[VESIT Project] --> B[backend-node]
    A --> C[app-native]
    A --> D[schema]
    
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
    
    style A fill:#e1f5fe
    style B fill:#f3e5f5
    style C fill:#e8f5e8
    style D fill:#fff3e0
```

## 🏗️ System Architecture

```mermaid
graph TB
    subgraph "Frontend (React Native + Expo)"
        A[Mobile App] --> B[Expo Router]
        B --> C[Authentication]
        B --> D[Dashboard]
        B --> E[Donation Flow]
        B --> F[Recipient Flow]
        B --> G[Delivery Tracking]
    end
    
    subgraph "Backend (Node.js + Express)"
        H[Express Server] --> I[JWT Auth]
        H --> J[User Management]
        H --> K[Food Donation API]
        H --> L[Recipient API]
        H --> M[Delivery API]
    end
    
    subgraph "Database (MongoDB)"
        N[MongoDB] --> O[Users Collection]
        N --> P[Food Listings]
        N --> Q[Recipients]
        N --> R[Deliveries]
        N --> S[Transactions]
    end
    
    A -.->|HTTP/HTTPS| H
    H -.->|CRUD Operations| N
    
    style A fill:#e3f2fd
    style H fill:#f3e5f5
    style N fill:#e8f5e8
```

## 🔄 Authentication Flow

```mermaid
sequenceDiagram
    participant U as User
    participant A as Mobile App
    participant B as Backend API
    participant D as Database
    
    U->>A: Open App
    A->>A: Check Local Storage
    alt Has Valid Token
        A->>B: Request with JWT
        B->>B: Verify JWT
        B->>A: Protected Data
        A->>U: Show Dashboard
    else No Token/Invalid
        A->>U: Show Login Screen
        U->>A: Enter Credentials
        A->>B: POST /auth/login
        B->>D: Verify User
        D->>B: User Data
        B->>A: JWT Token
        A->>A: Store Token
        A->>U: Show Dashboard
    end
```

## 🍽️ Food Donation Workflow

```mermaid
flowchart TD
    A[User Opens App] --> B{Authenticated?}
    B -->|No| C[Login/Signup]
    B -->|Yes| D[Dashboard]
    
    C --> D
    D --> E[Choose Action]
    
    E --> F[Donate Food]
    E --> G[Request Food]
    E --> H[Track Deliveries]
    
    F --> I[Fill Donation Form]
    I --> J[Upload Food Images]
    J --> K[Set Pickup Details]
    K --> L[Submit Donation]
    L --> M[Backend Processes]
    M --> N[Notify Delivery Agents]
    
    G --> O[Browse Available Food]
    O --> P[Select Food Item]
    P --> Q[Submit Request]
    Q --> R[Backend Validates]
    R --> S[Assign Delivery]
    
    H --> T[View Delivery Status]
    T --> U[Real-time Updates]
    
    style A fill:#e8f5e8
    style D fill:#e3f2fd
    style F fill:#fff3e0
    style G fill:#fce4ec
    style H fill:#f3e5f5
```

## 🗄️ Database Schema

```mermaid
erDiagram
    USERS {
        ObjectId _id
        String email
        String password
        String name
        String phone
        String address
        String userType
        Date createdAt
        Date updatedAt
    }
    
    FOOD_LISTINGS {
        ObjectId _id
        ObjectId donorId
        String foodName
        String description
        Number quantity
        String unit
        Date expiryDate
        String status
        String pickupAddress
        Date createdAt
    }
    
    RECIPIENTS {
        ObjectId _id
        ObjectId userId
        String requestType
        String foodPreferences
        Number familySize
        String urgency
        String status
        Date createdAt
    }
    
    DELIVERIES {
        ObjectId _id
        ObjectId foodListingId
        ObjectId recipientId
        ObjectId agentId
        String status
        Date pickupTime
        Date deliveryTime
        String notes
        Date createdAt
    }
    
    DELIVERY_AGENTS {
        ObjectId _id
        String name
        String phone
        String vehicleType
        String status
        ObjectId currentDeliveryId
        Date createdAt
    }
    
    TRANSACTIONS {
        ObjectId _id
        ObjectId donorId
        ObjectId recipientId
        ObjectId deliveryId
        String transactionType
        Number amount
        String status
        Date createdAt
    }
    
    USERS ||--o{ FOOD_LISTINGS : "donates"
    USERS ||--o{ RECIPIENTS : "requests"
    FOOD_LISTINGS ||--o{ DELIVERIES : "delivered"
    RECIPIENTS ||--o{ DELIVERIES : "receives"
    DELIVERY_AGENTS ||--o{ DELIVERIES : "handles"
    DELIVERIES ||--o{ TRANSACTIONS : "generates"
```

## 🚀 Deployment Architecture

```mermaid
graph TB
    subgraph "Development Environment"
        A[Local Development] --> B[Backend: localhost:4000]
        A --> C[Frontend: Expo Dev Server]
        A --> D[MongoDB: localhost:27017]
    end
    
    subgraph "Production Environment"
        E[Cloud Platform] --> F[Backend Container]
        E --> G[MongoDB Atlas]
        E --> H[CDN/Static Files]
        
        F --> I[Load Balancer]
        I --> J[Backend Instances]
        J --> G
        
        K[Mobile App] --> I
        L[Web Dashboard] --> I
    end
    
    subgraph "Docker Services"
        M[docker-compose] --> N[Backend Service]
        M --> O[MongoDB Service]
        M --> P[Redis Service]
        
        N --> Q[Port 4000]
        O --> R[Port 27017]
        P --> S[Port 6379]
    end
    
    style A fill:#e8f5e8
    style E fill:#f3e5f5
    style M fill:#e3f2fd
```

## 🛠️ Installation

### Prerequisites

- **Node.js** (v18 or higher)
- **MongoDB** (local or cloud instance)
- **npm** or **yarn** package manager
- **Expo CLI** (for React Native development)
- **Android Studio** / **Xcode** (for mobile development)

### Backend Setup

1. **Navigate to backend directory**
   ```bash
   cd backend-node
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Environment Configuration**
   ```bash
   cp .env.example .env
   ```
   
   Edit `.env` file:
   ```env
   PORT=4000
   MONGO_URI=mongodb://localhost:27017/vesit_food_donation
   JWT_SECRET=your_jwt_secret_key_here
   NODE_ENV=development
   ```

4. **Start MongoDB** (if local)
   ```bash
   mongod
   ```

5. **Run backend server**
   ```bash
   # Development mode
   npm run dev
   
   # Production mode
   npm start
   ```

### Frontend Setup

1. **Navigate to frontend directory**
   ```bash
   cd app-native
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start Expo development server**
   ```bash
   npm start
   ```

4. **Run on device/simulator**
   ```bash
   # iOS Simulator
   npm run ios
   
   # Android Emulator
   npm run android
   
   # Web browser
   npm run web
   ```

## 🐳 Docker Setup

### Using Docker Compose (Recommended)

1. **Build and run all services**
   ```bash
   docker-compose up --build
   ```

2. **Run in background**
   ```bash
   docker-compose up -d
   ```

3. **Stop services**
   ```bash
   docker-compose down
   ```

### Individual Docker Commands

**Backend only:**
```bash
cd backend-node
docker build -t vesit-backend .
docker run -p 4000:4000 --env-file .env vesit-backend
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

## 📡 API Endpoints

### Authentication
- `POST /auth/register` - Register new user
- `POST /auth/login` - User login

### User Management (Protected)
- `POST /user/donate` - Donate food items
- `GET /user/food-listings/:id` - Get user's donations
- `GET /user/profile/:id` - Get user profile
- `PUT /user/profile/:id` - Update profile
- `DELETE /user/profile/:id` - Delete profile

### Delivery (Protected)
- `GET /delivery/agents` - Get delivery agents
- `POST /delivery/assign` - Assign delivery
- `GET /delivery/status/:id` - Get delivery status

### Recipient (Protected)
- `GET /recipient/requests` - Get food requests
- `POST /recipient/request` - Create food request
- `PUT /recipient/request/:id` - Update request

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

## 📦 Available Scripts

### Backend
- `npm run dev` - Start development server
- `npm start` - Start production server
- `npm test` - Run tests

### Frontend
- `npm start` - Start Expo development server
- `npm run ios` - Run on iOS simulator
- `npm run android` - Run on Android emulator
- `npm run web` - Run in web browser
- `npm test` - Run tests

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

