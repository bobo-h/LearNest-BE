import express, { Application, Request, Response, NextFunction } from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import indexRouter from './routes/index';
import './models';

dotenv.config();

const app: Application = express();

const allowedOrigins = [
  process.env.FRONT_LOCAL_URL,
  process.env.FRONT_DEPLOY_URL,
];
const corsOptions: cors.CorsOptions = {
  origin: function (origin, callback) {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  exposedHeaders: ['Authorization'],
  credentials: true,
  optionsSuccessStatus: 200,
};
app.use(cors(corsOptions));

app.use(express.urlencoded({ extended: false }));
app.use(express.json());

app.get('/', (req: Request, res: Response) => {
  res.send('Server is running successfully!');
});

app.use('/api', indexRouter);

app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
  console.error('🔥 Error stack:', err.stack);
  res.status(500).json({
    message: 'Internal Server Error',
    error: err.message,
  });
});

export default app;
