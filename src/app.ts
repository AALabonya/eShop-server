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
    origin: ['http://localhost:3000','http://localhost:3001'], 
    credentials: true, 
  }),
);
app.use(cookieParser());


app.use(express.json());
app.use(express.urlencoded({ extended: true }));


app.use('/api', router);


app.get('/', (req: Request, res: Response) => {
  res.status(StatusCodes.OK).json({
    success: true,
    message: 'Welcome to eShop Server!',
  });
});


app.use(globalErrorHandler);


app.use(notFound);

export default app;
