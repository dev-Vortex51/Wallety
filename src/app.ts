import express from 'express';
import helmet from 'helmet';
import cors from 'cors';
import morgan from 'morgan';
import { globalErrorHandler } from './middleware/globalErrorHandler';
import authRoutes from './modules/auth/auth.routes';
import walletRoutes from './modules/wallet/wallet.routes';
import { AppError } from './utils/AppError';
import requestRoutes from './modules/payment-request/request.routes';
import { swaggerSpec } from './config/swagger';
import swaggerUi from 'swagger-ui-express';

// Initialize the app
const app = express();

// Helmet for security
app.use(helmet());

// Body parser
app.use(express.json());

// CORS
app.use(
  cors({
    origin: '*',
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true,
  })
);

// morgan
process.env.NODE_ENV === 'development' && app.use(morgan('dev'));

// Routes

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

app.use('/api/v1/auth', authRoutes);
app.use('/api/v1/wallet', walletRoutes);
app.use('/api/v1/payment-requests', requestRoutes);

app.get('/', (req, res) => {
  res.send('Hello World!');
});

app.use((req, res, next) => {
  throw new AppError(`Can't find ${req.originalUrl} on this server!`, 404);
});

app.use(globalErrorHandler as express.ErrorRequestHandler);

export default app;
