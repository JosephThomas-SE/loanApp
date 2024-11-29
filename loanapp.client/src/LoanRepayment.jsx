import React, { useState } from 'react';
import axios from 'axios';

function LoanRepayment() {
    const [loanId, setLoanId] = useState('');
    const [repaymentAmount, setRepaymentAmount] = useState('');
    const [message, setMessage] = useState('');

    const handleRepayment = async () => {
        try {
            await axios.post(`https://localhost:7140/api/loans/${loanId}/repay`, {
                amount: parseFloat(repaymentAmount),
            });
            setMessage('Repayment successful!');
        } catch (error) {
            console.log(error);
            setMessage('Error processing repayment.');
        }
    };

    return (
        <div className="container mt-5">
            <h2 className="text-center mb-4">Loan Repayment</h2>
            <div className="card p-4 shadow-sm">
                <div className="mb-3">
                    <label htmlFor="loanId" className="form-label">Loan ID</label>
                    <input
                        type="text"
                        id="loanId"
                        className="form-control"
                        value={loanId}
                        onChange={(e) => setLoanId(e.target.value)}
                        placeholder="Enter your Loan ID"
                    />
                </div>
                <div className="mb-3">
                    <label htmlFor="repaymentAmount" className="form-label">Repayment Amount</label>
                    <input
                        type="number"
                        id="repaymentAmount"
                        className="form-control"
                        value={repaymentAmount}
                        onChange={(e) => setRepaymentAmount(e.target.value)}
                        placeholder="Enter repayment amount"
                    />
                </div>
                <button
                    className="btn btn-primary w-100"
                    onClick={handleRepayment}
                >
                    Submit Repayment
                </button>
                {message && <div className="alert alert-info mt-3">{message}</div>}
            </div>
        </div>
    );
}

export default LoanRepayment;
