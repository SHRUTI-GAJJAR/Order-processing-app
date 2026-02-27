require('dotenv').config();
const express = require('express');
const helmet = require('helmet'); 
const connectDB = require('./src/config/db');
const logger = require('./src/middlewares/logger');
const limiter = require('./src/middlewares/rateLimiter');
const errorMiddleware = require('./src/middlewares/errorMiddleware');
const colors = require('colors');

// Routes
const authRoutes = require('./src/routes/authRoutes');
const productRoutes = require('./src/routes/productRoutes');
const orderRoutes = require('./src/routes/orderRoutes');
const paymentRoutes = require('./src/routes/paymentRoutes');
const cartRoutes = require('./src/routes/cartRoutes');
const app = express();
const swaggerJsdoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');

// Connect to MongoDB
connectDB();

// Hide Express signature
app.disable('x-powered-by');

// Middlewares
app.use(express.json());
app.use(limiter); // Apply rate limiting globally

// Helmet configuration
app.use(
  helmet({
    contentSecurityPolicy: {
      directives: {
        defaultSrc: ["'self'"],
        scriptSrc: ["'self'"],
        styleSrc: ["'self'", "https:", "'unsafe-inline'"],
        imgSrc: ["'self'", "data:", "https:"],
        connectSrc: ["'self'"],
        objectSrc: ["'none'"],
        upgradeInsecureRequests: [],
      },
    },
    crossOriginEmbedderPolicy: false,
  })
);

// Serve static files
app.use('/uploads', express.static('uploads'));

// --------------------
// Swagger Setup
// --------------------
const PORT = process.env.PORT || 5000;

const swaggerOptions = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Order Processing API',
      version: '1.0.0',
      description: 'API documentation for Order Processing App',
    },
    servers: [
      {
        url: `https://order-processing-app-nedk.onrender.com`,
        description: "Production Server"
      },
      {
        url: `http://localhost:${PORT}`,
        description: "Local Development Server"
      },
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: "http",
          scheme: "bearer",
          bearerFormat: "JWT"
        }
      }
    },
    security: [
      {
        bearerAuth: []
      }
    ]
  },
  apis: ["./src/routes/*.js"]
};

const swaggerSpec = swaggerJsdoc(swaggerOptions);

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// --------------------
// Test Route
// --------------------
app.get('/', (req, res) => {
  res.send('API is running...');
});

// Routes endpoints
app.use('/api/auth', authRoutes);
app.use('/api/products', productRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/payments', paymentRoutes);
app.use('/api/cart', cartRoutes);


// Error Middleware
app.use(errorMiddleware);

app.listen(PORT, () => {
  logger.info(`Server running on port ${PORT}`.green);
});


