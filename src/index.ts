import * as bodyParser from "body-parser";
import * as cors from "cors";
import * as express from "express";
import "reflect-metadata";
import { createConnection } from "typeorm";
import { RouterController } from './router/index';

createConnection().then(async connection => {

    // create express app
    const app = express();
    app.use(cors());
    app.use(bodyParser.json());

    // register express routes from defined application routes
    new RouterController(app);

    // setup express app here
    // ...

    // start express server
    app.listen(process.env.APP_PORT, () => {
        console.log(`🏃‍♂️ Express server has started on port ${process.env.APP_PORT}.`);
    });


}).catch(error => console.log(error));
