import { Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';


const notFound = (req: Request, res: Response) => {
  return res.status(StatusCodes.NOT_FOUND).json({
    success: false,
    message: 'API NOT FOUND!',
    error: {
      path: req.originalUrl,
      message: 'Your requested path is not found!',
    },
  });
};

export default notFound;