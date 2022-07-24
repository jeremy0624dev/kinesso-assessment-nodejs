<h1>Welcome</h1>
<h2>1.0 Features of Assessment</h2>
This system allows the admins to generate payslip by inputting salary details of employee.
Tax calculation bases on the rates for 2017-18 apply from 1 July 2017 (The tax table is from ATO: https://www.ato.gov.au/Rates/Individual-income-tax-rates)

<h2>2.0 Assumptions</h2>
<ul>
    <li>The employee is assumed to locate in New York where he will follow the timezone and public holidays of New York.</li>
    <li>Business days are assumed to be from Monday to Friday only.</li>
    <li>When employee's payment start date is on first day of the month, he is assumed to fulfil all the business day  of the month, without applying for any unpaid leaves in between.</li>
    <li>When employee's payment start date is later that the first day of the month, the system will calculate the remaining number of business days in order to issue prorated salary of the month to the employee. </li>
    <li>This system follows a strict date format which is 'DD MMMM', for example: 01 March.</li>
    <li>Payment currency is assumed to be US dollar.</li>
</ul>

<h2>3.0 Setup</h2>
<ol>
    <li>Please download the project.</li>
    <li>Run <i>npm install</i> to install packages.</li>
    <li>Run <i>npm run start</i></li>
    <li>Run <i>node dist/server.js</i> to start this project locally.</li>
    <li>Use API platform such as postman to test the APIs.</li>
</ol>

<h2>4.0 APIs</h2>
<h3>4.1 Generate Payslip</h3>
Calculate the monthly tax and income of an employee for the month through his annual salary.
<table>
<tr>
    <th>Method</th>
    <td colspan="2">POST</td>
</tr>
<tr>
    <th>Url</th>
    <td colspan="2">http://localhost:8080/api/generatePayslip</td>
</tr>
<tr>
    <th>Body(Json)</th>
    <td>
        <code>firstName: string</code><br>
        <code>lastName: string</code><br>
        <code>annualSalary: number</code><br>
        <code>superRate: number</code> (range: 0 - 12)<br>
        <code>paymentStartDate: string</code> (format: MM-DD-YYYY)<br>
    </td>
    <td>
        <code>
            {
                "firstName": "Andrew",
                "lastName": "Smith",
                "annualSalary": 60050,
                "superRate": 9,
                "paymentStartDate": "01 March"
            }
        </code>
        <hr>
        <code>
            {
                "firstName": "Claire",
                "lastName": "Wong",
                "annualSalary": 120000,
                "superRate": 10,
                "paymentStartDate": "01 March"
            }
        </code>
    </td>
</tr>
<tr>
    <th>Response(Json)</th>
    <td>
        <code>name: string;</code> Full name of the employee<br>
        <code>payPeriod: string;</code> First day of the start payment date to end of the month <br>
        <code>grossIncome: number;</code> Annual salary divided by 12 months<br>
        <code>incomeTax: number;</code> Income tax charged from the annual salary and divided by 12 months<br>
        <code>netIncome: number;</code> Gross income minuses with Income tax per month<br>
        <code>superannuation: number;</code> Gross income times with super rate<br>
        <code>totalBusinessDay: number;</code> Total business day of the month<br>
        <code>attendedBusinessDay: number;</code> Total business day of the month that the employee has attended<br>
    </td>
    <td>
        <code>
            {
                "payslip": {
                    "name": "Claire Wong",
                    "payPeriod": "01 March - 31 March",
                    "grossIncome": 5004,
                    "incomeTax": 922,
                    "netIncome": 4082,
                    "superannuation": 450,
                    "totalBusinessDay": 23,
                    "attendedBusinessDay": 23
                }
            }
        </code>
        <hr>
        <code>
            {
                "payslip": {
                    "name": "Claire Wong",
                    "payPeriod": "01 March - 31 March",
                    "grossIncome": 10000,
                    "incomeTax": 2669,
                    "netIncome": 7331,
                    "superannuation": 1000,
                    "totalBusinessDay": 23,
                    "attendedBusinessDay": 23
                }
            }
        </code>
    </td>
</tr>
</table>

<h2>5.0 Skills</h2>
<ul>
<li>nodejs</li>
<li>express</li>
<li>typescript</li>
<li>ecma6</li>
</ul>