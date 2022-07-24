import express, {Application, Request, Response, NextFunction} from 'express';
import bodyParser from 'body-parser';
import momentTz from 'moment-timezone';
import moment from 'moment-business-days';
import PayslipRoutes from "./routes/payslip.routes.js";

const app:Application = express();

app.use((req: Request, res: Response, next: NextFunction) => {
    res.header("Access-Control-Allow-Origin", "*");
    res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
});

// parse requests of content-type - application/json
app.use(bodyParser.json());
// parse requests of content-type - application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: true }));
// simple route
app.get("/", (req:Request, res:Response):void => {
    res.json({ message: "Welcome to kinesso-assessment application" });
});
// set port, listen for requests
const PORT = process.env.PORT || 8080;
app.listen(PORT, ():void => {
    console.log(`Server is running on port ${PORT}.`);
});

// register all the routers
app.use('/api', PayslipRoutes);

app.use((err: Error, req: Request, res: Response, next:NextFunction) => {
    if (req.xhr) {
        res.status(500).send({ error: 'Something failed!' })
    } else {
        next(err)
    }
});
app.use((err: Error, req: Request, res: Response, next:NextFunction) => {
    if (res.headersSent) {
        return next(err)
    }
    res.status(500)
    res.json({
        status: 500,
        message: err.message,
        error: err
    });
});

moment.updateLocale('us', {
    workingWeekdays: [1, 2, 3, 4, 5]
});

momentTz.tz.setDefault('America/New_York');