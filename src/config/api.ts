import express, {Express, NextFunction, Request, Response} from 'express'
import dotenv from 'dotenv'
import router from '../service/api';
import bodyParser from 'body-parser';
dotenv.config()

const app: Express = express();

const {
    PORT_APP
} = process.env

app.use(bodyParser.urlencoded({extended: false}))
app.use(bodyParser.json())
// High level error handling
app.use('/', router)

app.listen(PORT_APP, () => {
        console.log('server start', PORT_APP)
});

const api = app

export default api;