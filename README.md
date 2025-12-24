# FoodHub - Modern Food Ordering Platform

A comprehensive food ordering ecosystem built with cutting-edge web technologies, featuring enhanced security, modern UI/UX, and scalable microservices architecture.

## 🚀 Architecture Overview

- **Backend Services**: Customer service and Partner service built on Node.js + Express with MongoDB
- **Frontend**: React application with modern design patterns and responsive UI
- **API Gateway**: Load-balanced routing with Nginx for high availability
- **Security**: Advanced authentication with crypto-based hashing, rate limiting, and fraud detection
- **Payment Processing**: Multi-provider payment system with risk assessment and comprehensive tracking

## 🏗️ Technical Stack

### Backend Services
- **Customer Backend** (Port 4000): User management, authentication, order processing
- **Partner Backend** (Port 4100): Restaurant management, payment processing, analytics
- **API Gateway** (Port 4200): Load balancing and request routing
- **Database**: MongoDB with separate databases for each service

### Frontend
- **Framework**: React 18 with modern hooks
- **Styling**: CSS-in-JS with responsive design
- **State Management**: Context API with custom hooks
- **Routing**: React Router with protected routes

### Infrastructure
- **Load Balancer**: Nginx with upstream pools
- **Authentication**: PBKDF2 password hashing with salt
- **Payment**: Multi-gateway support with fraud detection
- **Logging**: Structured logging with request tracking

## 📁 Project Structure

```
food-hub/
├─ customer-backend/
│  ├─ src/
│  │  ├─ controllers/auth.controller.js    # Enhanced auth with rate limiting
│  │  ├─ models/User.js                   # Advanced user model with preferences
│  │  ├─ routes/auth.routes.js
│  │  └─ config/database.js
├─ partner-backend/
│  ├─ src/
│  │  ├─ controllers/payment.controller.js  # Comprehensive payment processing
│  │  ├─ models/Payment.js                # Advanced payment tracking
│  │  └─ routes/payment.routes.js
├─ frontend/
│  ├─ src/
│  │  ├─ pages/Login.jsx                  # Modern authentication UI
│  │  ├─ components/
│  │  └─ hooks/useAuth.jsx
├─ gateway/
│  └─ src/gateway.js                      # Load balancing logic
└─ nginx/
   └─ conf/nginx.conf                     # Reverse proxy configuration
```

## 🔐 Security Features

### Authentication System
- **Password Security**: PBKDF2 with 10,000 iterations and unique salts
- **Account Lockout**: Automatic lock after 5 failed attempts (2-hour cooldown)
- **Session Management**: Unique session tokens with request tracking
- **Input Validation**: Comprehensive server-side validation with detailed error responses

### Payment Security
- **Risk Assessment**: Dynamic risk scoring based on transaction patterns
- **Fraud Detection**: Real-time fraud flagging for suspicious activities
- **Multi-factor Support**: Support for various payment methods with enhanced security
- **Audit Trail**: Complete transaction history with security metadata

## 💳 Payment Processing

### Supported Payment Methods
- Credit/Debit Cards
- Digital Wallets (Apple Pay, Google Pay)
- Bank Transfers
- Cryptocurrency payments

### Payment Flow
1. **Initiation**: Risk assessment and fee calculation
2. **Processing**: Gateway integration with real-time status updates
3. **Settlement**: Automated settlement with comprehensive tracking
4. **Refunds**: Full refund support with audit trails

### Features
- **Multi-currency Support**: USD, EUR, GBP, JPY
- **Dynamic Fee Calculation**: Method-specific fee structures
- **Real-time Processing**: Async processing with status updates
- **Comprehensive Tracking**: Full transaction lifecycle management

## 🎨 Frontend Features

### Modern Authentication UI
- **Split-panel Design**: Engaging left panel with features and testimonials
- **Animated Backgrounds**: Floating shapes with smooth animations
- **Enhanced UX**: Password visibility toggle, real-time validation
- **Responsive Design**: Mobile-first approach with tablet and desktop optimization

### User Experience
- **Form Validation**: Real-time client-side validation with helpful error messages
- **Smooth Transitions**: Mode switching with fade animations
- **Accessibility**: WCAG compliant with proper ARIA labels
- **Progressive Enhancement**: Works without JavaScript enabled

## 🚀 Getting Started

### Prerequisites
- Node.js 18+
- MongoDB 5.0+
- Nginx (for production deployment)

### Installation

1. **Clone and Install Dependencies**:
```bash
# Install backend dependencies
"customer-backend","partner-backend","gateway" | ForEach-Object { 
  Push-Location $_; npm install; Pop-Location 
}

# Install frontend dependencies
cd frontend
npm install
```

2. **Environment Configuration**:
```bash
# Copy environment templates
copy customer-backend\.env.example customer-backend\.env
copy partner-backend\.env.example partner-backend\.env
copy gateway\.env.example gateway\.env
copy frontend\.env.example frontend\.env

# Edit environment files with your configurations
```

3. **Database Setup**:
```bash
# Start MongoDB service
mongod

# Create databases (optional - will be created automatically)
use customer_backend
use partner_backend
```

### Running the Application

1. **Start Backend Services**:
```bash
# Customer backend (multiple instances)
cd customer-backend
npm run dev:all

# Partner backend (multiple instances)
cd partner-backend  
npm run dev:all
```

2. **Start API Gateway**:
```bash
cd gateway
npm run dev
```

3. **Start Frontend**:
```bash
cd frontend
npm run dev
```

4. **Start Nginx (Production)**:
```bash
nginx -c "%cd%\nginx\conf\nginx.conf"
```

## 📊 API Endpoints

### Authentication Service
- `POST /api/v1/auth/register` - User registration with enhanced validation
- `POST /api/v1/auth/login` - User login with rate limiting
- `GET /api/v1/users/me` - User profile retrieval
- `PUT /api/v1/users/me` - Profile updates

### Payment Service
- `POST /api/v1/payments/initiate` - Payment initiation with risk assessment
- `POST /api/v1/payments/:reference/process` - Payment processing
- `GET /api/v1/payments/:reference` - Payment status tracking
- `POST /api/v1/payments/:reference/refund` - Payment refunds

## 🔧 Configuration

### Environment Variables

#### Customer Backend
```env
MONGO_URI=mongodb://localhost:27017/customer_backend
PORT=4000
NODE_ENV=development
```

#### Partner Backend
```env
MONGO_URI=mongodb://localhost:27017/partner_backend
PORT=4100
PAYMENT_PROVIDER=stripe
NODE_ENV=development
```

#### Gateway
```env
CUSTOMER_BACKENDS=http://127.0.0.1:4000,http://127.0.0.1:4001
PARTNER_BACKENDS=http://127.0.0.1:4100,http://127.0.0.1:4101
PORT=4200
```

#### Frontend
```env
VITE_API_BASE_URL=http://localhost:4200
VITE_APP_NAME=FoodHub
```

## 📈 Performance Features

### Load Balancing
- **Round-robin distribution** across multiple service instances
- **Health checks** for automatic failover
- **Session affinity** for consistent user experience

### Database Optimization
- **Indexed queries** for fast data retrieval
- **Connection pooling** for efficient resource usage
- **Separate databases** for service isolation

### Caching Strategy
- **Response caching** for frequently accessed data
- **Static asset optimization** with CDN support
- **Database query optimization** with proper indexing

## 🧪 Testing

### Running Tests
```bash
# Backend tests
cd customer-backend && npm test
cd partner-backend && npm test

# Frontend tests
cd frontend && npm test
```

### Test Coverage
- **Unit Tests**: Controller and model testing
- **Integration Tests**: API endpoint testing
- **E2E Tests**: Full user journey testing

## 🚀 Deployment

### Development
- Use `npm run dev` commands for hot reloading
- MongoDB running locally
- Direct service communication

### Production
- Docker containerization recommended
- MongoDB cluster for high availability
- Nginx reverse proxy with SSL termination
- Environment-specific configurations

## 📝 Monitoring & Logging

### Application Logs
- **Structured logging** with JSON format
- **Request tracking** with unique identifiers
- **Error categorization** for easier debugging

### Performance Monitoring
- **Response time tracking**
- **Error rate monitoring**
- **Resource usage metrics**

## 🔮 Future Enhancements

1. **Real-time Features**: WebSocket integration for live order tracking
2. **Mobile Applications**: React Native apps for iOS and Android
3. **Analytics Dashboard**: Advanced business intelligence features
4. **AI Integration**: Personalized recommendations and demand forecasting
5. **Multi-tenant Support**: White-label solutions for restaurant chains

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Commit your changes with descriptive messages
4. Push to the branch
5. Create a Pull Request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 📞 Support

For support and questions:
- Create an issue in the GitHub repository
- Check the documentation for common solutions
- Review the API documentation for endpoint details

---

**Built with ❤️ using modern web technologies**
