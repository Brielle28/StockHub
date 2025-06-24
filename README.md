# StockHub

A comprehensive full-stack stock portfolio management application with real-time price updates, alerts system, and market data integration. Built with React frontend and .NET Core backend, featuring Kafka streaming, Redis caching, and SignalR for real-time communication.

## 📋 Table of Contents

- [Features](#-features)
- [Tech Stack](#️-tech-stack)
- [Demo](#-demo)
- [Prerequisites](#-prerequisites)
- [Project Structure](#-project-structure)
- [Installation & Setup](#️-installation--setup)
- [Environment Variables](#-environment-variables)
- [Feature Implementation Status](#-feature-implementation-status)
- [API Endpoints](#-api-endpoints)
- [Usage](#-usage)
- [Deployment](#-deployment)
- [Contributing](#-contributing)
- [License](#-license)
- [Contact](#-contact)

## 🚀 Features

- **User Authentication** - Secure JWT-based login and registration
- **Portfolio Management** - Create, manage, and track multiple stock portfolios
- **Real-Time Stock Data** - Live price updates via Yahoo Finance API integration
- **Alert System** - Set price alerts with customizable conditions (above, below, equals)
- **Market Search** - Search stocks by symbol or company name
- **Price History Charts** - Historical stock price visualization with interactive charts
- **News Feed** - Latest stock market news and updates
- **Real-Time Updates** - WebSocket-based live price streaming using Kafka + SignalR
- **Caching** - Redis-powered performance optimization
- **Background Services** - Automated price updates and alert monitoring
- **Health Monitoring** - API health checks and system monitoring

## 🛠️ Tech Stack

### Frontend
- **Framework:** React (Single Page Application)
- **Routing:** React Router
- **HTTP Client:** Axios
- **State Management:** React Context API
- **Styling:** Tailwind CSS
- **Real-time Communication:** SignalR Client
- **Build Tool:** Vite

### Backend
- **Framework:** .NET Core Web API
- **Database:** SQL Server with Entity Framework Core
- **Authentication:** JWT Bearer tokens with ASP.NET Identity
- **Caching:** Redis with StackExchange.Redis
- **Message Streaming:** Apache Kafka (Confluent.Kafka)
- **Real-time Communication:** SignalR
- **External API:** Yahoo Finance (via RapidAPI)
- **Documentation:** Swagger/OpenAPI
- **Resilience:** Polly for HTTP retry policies
- **Environment Management:** DotNetEnv

### Infrastructure
- **Message Broker:** Apache Kafka + Zookeeper
- **Cache:** Redis
- **Database:** SQL Server
- **Containerization:** Docker (optional)

## 🎬 Demo
https://github.com/user-attachments/assets/521aeb29-0559-4e41-b03f-dd1f41b97e0c


https://github.com/user-attachments/assets/f4b412b3-2319-4a56-b648-c3495977d23f

## 📋 Prerequisites

Before running this application, make sure you have the following installed:

### Frontend Prerequisites
- **Node.js** (version 16.x or higher)
- **npm** or **yarn**

### Backend Prerequisites
- **.NET 9.0 SDK** or higher
- **SQL Server** (LocalDB or full instance)
- **Apache Kafka** with Zookeeper
- **Redis Server**

### External Services
- **RapidAPI Account** with Yahoo Finance API access

## 📁 Project Structure

```
StockHub/
├── frontend/                          # React Application
│   ├── src/
│   │   ├── components/               # Shared UI components
│   │   │   ├── charts/              # Chart components
│   │   │   ├── forms/               # Form components
│   │   │   └── ui/                  # UI components
│   │   ├── context/                  # React Context providers
│   │   │   ├── AuthContext.js       # Authentication state
│   │   │   ├── PortfolioContext.js  # Portfolio management
│   │   │   ├── MarketDataContext.js # Real-time market data
│   │   │   ├── AlertContext.js      # Alert management
│   │   │   └── ContextWrapper.js    # Context provider wrapper
│   │   ├── services/                 # API service functions
│   │   │   ├── api.js               # Axios configuration
│   │   │   ├── portfolioService.js  # Portfolio API calls
│   │   │   ├── stockService.js      # Stock data API calls
│   │   │   └── alertService.js      # Alert API calls
│   │   ├── layout/                   # Layout components
│   │   │   ├── DashboardLayout.js   # Dashboard layout
│   │   │   └── Layout.js            # Main layout
│   │   ├── pages/                    # Page components
│   │   │   ├── auth/
│   │   │   │   ├── LoginPage.js
│   │   │   │   └── RegisterPage.js
│   │   │   ├── dashboard/
│   │   │   │   ├── OverviewPage.js   # Dashboard overview
│   │   │   │   ├── MarketPage.js     # Market data & search
│   │   │   │   ├── PortfolioPage.js  # Portfolio management
│   │   │   │   └── AlertsPage.js     # Alert management
│   │   │   ├── 404Page.js
│   │   │   └── DeveloperErrorPage.js
│   │   ├── utils/                    # Utility functions
│   │   ├── App.js
│   │   ├── main.jsx
│   │   └── index.css
│   ├── public/
│   ├── package.json
│   └── .env
│
└── StockHub_Backend/                  # .NET Core API
    ├── Controllers/                   # API Controllers
    │   ├── StockDataController.cs    # Stock data endpoints
    │   ├── PortfolioController.cs    # Portfolio management
    │   ├── AlertsController.cs       # Alert management
    │   └── UsersController.cs        # User authentication
    ├── Data/                         # Database Context & Migrations
    │   ├── ApplicationDbContext.cs
    │   └── Migrations/
    ├── DTOs/                         # Data Transfer Objects
    │   ├── StockDto.cs
    │   ├── PortfolioDto.cs
    │   └── AlertDto.cs
    ├── Models/                       # Entity Models
    │   ├── User.cs
    │   ├── Portfolio.cs
    │   ├── Stock.cs
    │   └── Alert.cs
    ├── Services/                     # Business Logic Services
    │   ├── AlertService/            # Alert processing
    │   ├── Kafka/                   # Kafka message handling
    │   ├── Redis/                   # Redis caching
    │   ├── TokenServices/           # JWT token management
    │   ├── YahooFinanceApiService/  # External API integration
    │   ├── BackgroundServices/      # Background tasks
    │   └── Hubs/                    # SignalR hubs
    ├── Extensions/                   # Extension methods
    ├── Interfaces/                   # Service interfaces
    ├── appsettings.json
    ├── Program.cs
    └── .env
```

## ⚙️ Installation & Setup

### 1. Clone the Repository
```bash
git clone [https://github.com/yourusername/stockhub.git](https://github.com/Brielle28/StockHub.git)
cd Stockhub
```

### 2. Backend Setup

#### Start Required Services
Before starting the backend, you must start Kafka and Redis:

**Start Zookeeper:**
```bash
# Windows
bin\windows\zookeeper-server-start.bat config\zookeeper.properties

# Linux/Mac
bin/zookeeper-server-start.sh config/zookeeper.properties
```

**Start Kafka Server:**
```bash
# Windows
bin\windows\kafka-server-start.bat config\server.properties

# Linux/Mac
bin/kafka-server-start.sh config/server.properties
```

**Start Redis Server:**
```bash
# Windows (if installed via installer)
redis-server

# Linux/Mac
redis-server

# Or using Docker
docker run -d -p 6379:6379 redis:latest
```

#### Backend Application Setup
```bash
# Navigate to backend directory
cd StockHub_Backend

# Restore NuGet packages
dotnet restore

# Set up environment variables (see Environment Variables section)
cp .env.example .env

# Run database migrations
dotnet ef database update

# Start the backend server
dotnet run
```

The backend API will be available at `https://localhost:5012`

### 3. Frontend Setup
```bash
# Navigate to frontend directory (open new terminal)
cd frontend

# Install dependencies
npm install

# Set up environment variables (see Environment Variables section)
cp .env.example .env

# Start the frontend development server
npm start
```

The frontend application will be available at `http://localhost:5173`

## 🔧 Environment Variables

### Backend (.env)
Create a `.env` file in the `StockHub_Backend` directory:

```env
# Database Configuration
CONNECTION_STRING=Server=(localdb)\\mssqllocaldb;Database=StockHubDB;Trusted_Connection=true;MultipleActiveResultSets=true

# JWT Configuration
JWT_SECRET=your-super-secret-jwt-key-here-minimum-32-characters
JWT_ISSUER=StockHub
JWT_AUDIENCE=StockHubUsers
JWT_EXPIRY_MINUTES=60

# Yahoo Finance API (RapidAPI)
RAPIDAPI_KEY=your-rapidapi-key-here
RAPIDAPI_HOST=yahoo-finance15.p.rapidapi.com

# Redis Configuration
REDIS_CONNECTION_STRING=localhost:6379

# Kafka Configuration
KAFKA_BOOTSTRAP_SERVERS=localhost:9092
```

### Frontend (.env)
Create a `.env` file in the `frontend` directory:

```env
REACT_APP_API_URL=https://localhost:7001
REACT_APP_WEBSOCKET_URL=https://localhost:7001/stockhub
REACT_APP_ENVIRONMENT=development
```

## ✅ Feature Implementation Status

| Feature | Frontend | Backend | Description |
|---------|----------|---------|-------------|
| **User Authentication** | ✅ | ✅ | JWT-based login/register system |
| **Portfolio Management** | ✅ | ✅ | Create, view, and manage stock portfolios |
| **Stock Search & Data** | ✅ | ✅ | Search stocks, view quotes and historical data |
| **Real-time Price Updates** | ✅ | ✅ | Live stock price updates via WebSocket |
| **Alert System** | ✅ | ✅ | Price alerts with notifications |
| **Price History Charts** | ✅ | ✅ | Interactive stock price charts |
| **Market News Feed** | ✅ | ✅ | Latest stock market news |
| **Background Services** | - | ✅ | Automated price updates and alert checking |
| **Caching Layer** | - | ✅ | Redis caching for improved performance |
| **Message Streaming** | - | ✅ | Kafka for real-time data processing |
| **Health Monitoring** | - | ✅ | API health checks and error logging |
| **API Documentation** | - | ✅ | Swagger/OpenAPI documentation |

## 🔗 API Endpoints

### Authentication
- `POST /StockHub/users/register` - Register new user
- `POST /StockHub/users/login` - User login
- `GET /StockHub/users/me` - Get authenticated user profile

### Stock Data
- `GET /api/StockData/search` - Search stocks by symbol or name
- `GET /api/StockData/prices` - Get batch real-time prices
- `GET /api/StockData/{symbol}` - Get individual stock quote
- `GET /api/StockData/{symbol}/history` - Get historical price data
- `GET /api/StockData/news` - Get latest market news
- `GET /api/StockData/health` - API health status

### Portfolios
- `GET /api/portfolios` - Get user portfolios
- `POST /api/portfolios` - Create new portfolio
- `POST /api/portfolios/{id}/stocks` - Add stock to portfolio
- `DELETE /api/portfolios/{id}/stocks/{stockId}` - Remove stock from portfolio

### Alerts
- `GET /api/Alerts` - Get active alerts
- `POST /api/Alerts` - Create new alert
- `DELETE /api/Alerts/{id}` - Delete alert
- `GET /api/Alerts/triggered` - Get triggered alert history

### WebSocket
- `/stockhub` - Real-time stock price updates

## 🚀 Usage

1. **Start Infrastructure Services:**
   - Start Zookeeper
   - Start Kafka Server
   - Start Redis Server

2. **Start Application:**
   - Start the backend API server
   - Start the frontend development server

3. **Access the Application:**
   - Open your browser and navigate to `http://localhost:3000`
   - Register a new account or login with existing credentials
   - Explore the dashboard features

4. **Key Features to Try:**
   - Create a portfolio and add stocks
   - Set up price alerts
   - Monitor real-time price updates
   - View historical price charts
   - Check latest market news

## 🚢 Deployment

### Docker Deployment (Recommended)

Create a `docker-compose.yml` file:

```yaml
version: '3.8'
services:
  frontend:
    build: ./frontend
    ports:
      - "5173:5173"
    environment:
      - REACT_APP_API_URL=http://backend:5012

  backend:
    build: ./StockHub_Backend
    ports:
      - "5012:5012"
    depends_on:
      - redis
      - kafka
      - sqlserver
    environment:
      - ASPNETCORE_ENVIRONMENT=Production

  redis:
    image: redis:alpine
    ports:
      - "6379:6379"

  zookeeper:
    image: confluentinc/cp-zookeeper:latest
    environment:
      ZOOKEEPER_CLIENT_PORT: 2181

  kafka:
    image: confluentinc/cp-kafka:latest
    depends_on:
      - zookeeper
    environment:
      KAFKA_ZOOKEEPER_CONNECT: zookeeper:2181
      KAFKA_ADVERTISED_LISTENERS: PLAINTEXT://kafka:9092

  sqlserver:
    image: mcr.microsoft.com/mssql/server:2022-latest
    environment:
      - ACCEPT_EULA=Y
      - SA_PASSWORD=YourStrongPassword123!
```

Deploy with:
```bash
docker-compose up -d
```

### Manual Deployment

#### Frontend Deployment
1. Build the React application:
   ```bash
   npm run build
   ```
2. Deploy the `build` folder to your web server
3. Configure environment variables for production

#### Backend Deployment
1. Publish the .NET application:
   ```bash
   dotnet publish -c Release -o ./publish
   ```
2. Deploy to your server (IIS, Linux with Nginx, etc.)
3. Ensure all required services are running
4. Configure production environment variables

## ⚠️ Known Issues & Troubleshooting

### Common Issues
- **WebSocket connections may require HTTPS in production**
  - Solution: Configure SSL certificates and update WebSocket URLs
- **Kafka consumer may need restart if connection is lost**
  - Solution: Implement automatic reconnection logic
- **Rate limiting applies to external API calls**
  - Solution: Implement proper caching and request throttling

### Infrastructure Dependencies
- Ensure Kafka (with Zookeeper) and Redis are running before starting the backend
- Configure your RapidAPI key for Yahoo Finance integration
- The backend uses DotNetEnv package - ensure your .env file is properly configured

### Debugging Tips
- Check API health endpoint: `/health`
- Monitor logs for Kafka and Redis connections
- Verify JWT token configuration
- Test WebSocket connections in browser developer tools

## 🤝 Contributing

1. Fork the project
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

### Development Guidelines
- Follow existing code style and conventions
- properly tests new features
- Ensure all tests pass before submitting PR

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 📞 Contact

**Project Maintainer:** [Brielle]
- Email: your.chukwuemerieclara@example.com
- LinkedIn: [[Your LinkedIn Profile](https://www.linkedin.com/in/nnadozie-chukwuemerie-clara-b65273274/)]

**Project Link:** [https://github.com/Brielle28/StockHub](https://github.com/Brielle28/StockHub)

## 🙏 Acknowledgments

- Yahoo Finance API for comprehensive stock market data
- Apache Kafka for reliable message streaming
- Redis for high-performance caching solutions
- SignalR for seamless real-time communication
- The open-source community for incredible tools and libraries

---

**⭐ If you found this project helpful, please consider giving it a star!**
