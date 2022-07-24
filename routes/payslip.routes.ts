import {NextFunction, Request, Response, Router} from 'express';
import {returnError} from "../middlewares/error.js";
import {generatePayslip} from "../controllers/payslip.controller.js";
const router = Router();

router.post("/generatePayslip", async (req: Request, res: Response, next: NextFunction) => {
    try {
        const {
            firstName,
            lastName,
            annualSalary,
            superRate,
            paymentStartDate,
        } = req.body;
        const payslip = await generatePayslip(firstName, lastName, annualSalary, superRate, paymentStartDate);
        res.status(200).json({ payslip });
    } catch(e:any) {
        returnError(res, e);
    }
});

export default router;