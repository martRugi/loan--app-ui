import './App.css';
import React, {useState, useEffect} from 'react';
import axios from 'axios';

function App() {
    const [loan, setLoan] = useState({});
    const [payments, setPayments] = useState([]);
    const [instalment, setInstalment] = useState('');
    const [amount, setAmount] = useState('');

    useEffect(() => {
        showPayments();
    }, []);

    const getLoan = async () => {
        try {
            const response = await axios.get('http://localhost:3005/loan');
            setLoan(response.data);
        } catch (error) {
            console.error(error);
        }
    };

    const makePayment = async () => {
        try {
            const response = await axios.post(`http://localhost:3005/payments?instalment=${instalment}`);
            setLoan(response.data);
            setInstalment(response.data);
            await showPayments();
        } catch (error) {
            console.error(error);
        }
    };

    const showPayments = async () => {
        try {
            const response = await axios.get(`http://localhost:3005/payments`);
            setLoan(response.data);
            console.log(`Source of Payment History:`);
            console.log(response.data);
            setPayments(response.data);
        } catch (error) {
            console.error("Payment history error:" + error);
        }
    };

    const handleAmountChange = (event) => {
        setAmount(event.target.value);
    };

    const handleInstalmentChange = (event) => {
        setInstalment(event.target.value);
    }

    const applyLoan = async () => {
        try {
            const response = await axios.post(`http://localhost:3005/loan?amount=${amount}`);
            setLoan(response.data);
        } catch (error) {
            console.error(error);
        }
    };

    useEffect(() => {
        getLoan();
    }, []);

    return (

        <div className="container">
            <h1>Loan Dashboard</h1>

            <h2>Loan Details</h2>
            <p>Outstanding Balance: {loan.outstandingBalance || 'N/A'}</p>
            <p>Payment Period: {loan.month || 'N/A'}</p>
            <p>Interest Paid: {loan.interestPaid || 'N/A'}</p>

            <hr/>

            <h2>Make a Payment</h2>
            <label>
                Instalment:
                <input type="number" value={instalment} onChange={handleInstalmentChange}/>
            </label>
            <button onClick={makePayment}>Make Payment</button>

            <hr/>

            <h2>Apply for a Loan</h2>
            <label>
                Amount:
                <input type="number" value={amount} onChange={handleAmountChange}/>
            </label>
            <button onClick={applyLoan}>Apply</button>

            <hr/>

            <h2>Payment History</h2>
            <table border="1">
                <thead>
                <tr>
                    <th>Month</th>
                    <th>EMI</th>
                    <th>Interest Paid</th>
                    <th>Principal Paid</th>
                    <th>Outstanding Balance</th>
                </tr>
                </thead>
                <tbody>
                {payments.map((payment) => (
                    <tr key={payment._id}>
                        <td>{payment.month}</td>
                        <td>{payment.emi}</td>
                        <td>{payment.interestPaid}</td>
                        <td>{payment.principalPaid}</td>
                        <td>{payment.outstandingBalance}</td>
                    </tr>
                ))}
                </tbody>
            </table>
        </div>
    );
}

export default App;
