import express from 'express';
import * as http from "http";
import * as mongoose from "mongoose";

import Logging from "./library/Logging";

import { config } from "./config/config";
import userRouter from './routes/User';

const app = express();

// Connect to MongoDB
mongoose.connect(config.mongo.url, { retryWrites: true, w: 'majority' }).then(() => {
  Logging.info('Connected To MongoDB')
  ServerStart();
}).catch(error => {
  Logging.error('NOT Connected To MongoDB. Some Error Appears: ');
  Logging.error(error);
});


const ServerStart = () => {
  app.use((req, res, next) => {
      Logging.info(`Incomming -> Method: [${req.method}] Url: [${req.url}] - IP: [${req.socket.remoteAddress}]`);

      res.on('finish', () => {
        Logging.info(`Incomming -> Method: [${req.url}] - IP: [${req.socket.remoteAddress}] - Status: [${res.statusCode}]`);

      });

      next();
  });

  app.use(express.urlencoded({extended: true}))
  app.use(express.json());

  app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');

    if (req.method === 'OPTIONS') {
      res.header('Access-Control-Allow-Methods', 'PUT, POST, PATCH, DELETE, GET');
      return res.status(200).json({});
    }

    next();
  });

  // Routers
  app.use('/user', userRouter);

  app.get('/ping', (req, res, next) => res.status(200).json({ message: 'pong' }));

  app.use((req, res, next) => {
    const  error = new Error('not found middleware');
    Logging.error(error);

    return res.status(404).json({ message: error.message })
  });

  http.createServer(app).listen(config.server.port, () => Logging.info(`Server is running on the post: ${config.server.port}.`))
}
