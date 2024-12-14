import express, { Application, Request, Response } from 'express';
import cors from 'cors';
import router from './routes';
import globalErrorHandler from './middlewares/globalErrorHandler';
import notFound from './middlewares/notFound';
import cookieParser from 'cookie-parser';
import { StatusCodes } from 'http-status-codes';

const app: Application = express();

app.use(
  cors({
    origin: ['http://localhost:3000','http://localhost:3001'], // Allow requests from this origin
    credentials: true, // Allow cookies and other credentials
  }),
);
app.use(cookieParser());

//parser
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// router
app.use('/api', router);

//Testing
app.get('/', (req: Request, res: Response) => {
  res.status(StatusCodes.OK).json({
    success: true,
    message: 'Welcome to eShop Server!',
  });
});

//global error handler
app.use(globalErrorHandler);

//handle non-existing route
app.use(notFound);

export default app;
