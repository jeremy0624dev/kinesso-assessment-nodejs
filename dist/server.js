import express from 'express';
import bodyParser from 'body-parser';
import momentTz from 'moment-timezone';
import moment from 'moment-business-days';
import PayslipRoutes from "./routes/payslip.routes.js";
const app = express();
app.use((req, res, next) => {
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
app.get("/", (req, res) => {
    res.json({ message: "Welcome to kinesso-assessment application" });
});
// set port, listen for requests
const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}.`);
});
// register all the routers
app.use('/api', PayslipRoutes);
app.use((err, req, res, next) => {
    if (req.xhr) {
        res.status(500).send({ error: 'Something failed!' });
    }
    else {
        next(err);
    }
});
app.use((err, req, res, next) => {
    if (res.headersSent) {
        return next(err);
    }
    res.status(500);
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
