import moment from "moment-business-days";

const inputDateFormat = 'DD MMMM';
const dateFormat = 'MM-DD-YYYY';
const displayDateFormat = 'DD MMMM'

type PaySlip = {
    name: string;
    payPeriod: string;
    grossIncome: number;
    incomeTax: number;
    netIncome: number;
    superannuation: number;
    totalBusinessDay: number;
    attendedBusinessDay: number;
}

/**
 * @param {string} firstName
 * @param {string} lastName
 * @param {number} annualSalary
 * @param {number} superRate
 * @param {string} paymentStartDate
 * @return {PaySlip}
 */

export async function generatePayslip (firstName: string, lastName: string, annualSalary: number, superRate: number = 0, paymentStartDate: string) {
    let mntPaymentStart: moment.Moment;
    let workingDayPercentage = 1;

    const paySlip:PaySlip = {
        name: '',
        payPeriod: '',
        grossIncome: 0, // annual-salary / 12 months
        incomeTax: 0, // (annual-salary * tax-rate) / 12 months
        netIncome: 0, // gross-income - income-tax-per-month
        superannuation: 0, // gross-income x super-rate
        totalBusinessDay: 0, // total business day of the month
        attendedBusinessDay: 0, // total business day of the month that the employee has attended
    }
    // validation
    if (!firstName) throw new Error('Please provide first name.')
    if (!lastName) throw new Error('Please provide last name.')
    if (typeof annualSalary !== 'number') throw new Error('Please provide annual salary in number value.')
    else if (!annualSalary) throw new Error('Please provide annual salary.')
    if (superRate) {
        if (typeof superRate !== 'number') throw new Error('Please provide super rate in number value.')
        else if (superRate < 0 || superRate > 12) throw new Error('Super rate should range from 0 to 12.');
    }
    if (!paymentStartDate) throw new Error('Please provide payment start date.');
    else {
        mntPaymentStart = moment(paymentStartDate, inputDateFormat, true);
        if (!mntPaymentStart.isValid()) throw new Error('Please provide valid date. Example of a valid date should be "03-01-2022", referring to 1st of March 2022.');
    }

    paySlip.name = `${firstName.trim()} ${lastName.trim()}`;
    const mntLastDayOfMonth =  mntPaymentStart.clone().endOf('month');
    paySlip.payPeriod = `${mntPaymentStart.format(displayDateFormat)} - ${mntLastDayOfMonth.format(displayDateFormat)}`;
    // calculate working day rate
    const totalBusinessDay = mntPaymentStart.monthBusinessDays().length;
    let diff: number = 0;
    if (mntPaymentStart.isSame(mntPaymentStart.clone().startOf('month'))) {
        diff = totalBusinessDay;
        workingDayPercentage = 1;
    } else {
        diff = mntPaymentStart.businessDiff(mntLastDayOfMonth);
        workingDayPercentage = diff/totalBusinessDay;
    }
    paySlip.totalBusinessDay = totalBusinessDay;
    paySlip.attendedBusinessDay = diff;
    // calculate for payslip data
    const grossIncomePerMonth = Math.round(annualSalary / 12);
    paySlip.grossIncome = Math.round(grossIncomePerMonth * workingDayPercentage);
    const annualIncomeTax = calculateAnnualIncomeTax(annualSalary);
    paySlip.incomeTax = Math.round(annualIncomeTax / 12 * workingDayPercentage);
    paySlip.netIncome = paySlip.grossIncome - paySlip.incomeTax;
    paySlip.superannuation = superRate > 0 ? Math.round(paySlip.grossIncome * superRate / 100) : 0;
    return paySlip;
}

function calculateAnnualIncomeTax(annualSalary: number): number {
    let totalTax:number = 0;
    const taxRates: { min: number; max: number; accumulatedTax: number; chargePer1Dollar: number }[] = [
        {
            min: 0,
            max: 18200,
            accumulatedTax: 0,
            chargePer1Dollar: 0,
        }, {
            min: 18200,
            max: 37000,
            accumulatedTax: 0,
            chargePer1Dollar: 0.19,
        }, {
            min: 37000,
            max: 87000,
            accumulatedTax: 3572,
            chargePer1Dollar: 0.325,
        }, {
            min: 87000,
            max: 180000,
            accumulatedTax: 19822,
            chargePer1Dollar: 0.37,
        }, {
            min: 180000,
            max: annualSalary + 180000, // just to ensure the max value is always larger than min
            accumulatedTax: 54232,
            chargePer1Dollar: 0.45,
        }
    ];
    // use binary search concept to start searching in the middle of array
    const midIndex = Math.round((taxRates.length / 2) - 1);
    let currentIndex = midIndex;
    let taxRateSet = taxRates[midIndex];
    while (totalTax === 0 && currentIndex > 0) {
        if (annualSalary >= taxRateSet.max) {
            currentIndex += 1;
            taxRateSet = taxRates[currentIndex];
        } else if (annualSalary < taxRateSet.min) {
            currentIndex -= 1;
            taxRateSet = taxRates[currentIndex];
        } else if (annualSalary === taxRateSet.min) {
            totalTax = taxRateSet.accumulatedTax;
        } else {
            totalTax = ((annualSalary - taxRateSet.min) * taxRateSet.chargePer1Dollar) + taxRateSet.accumulatedTax;
        }
    }
    return Math.round(totalTax);
}