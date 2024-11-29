import React, { useState } from 'react';
import axios from 'axios';

function LoanForm() {
    const [amountRequired, setAmountRequired] = useState('');
    const [loanTerm, setLoanTerm] = useState('');
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setSuccess('');

        if (!amountRequired || !loanTerm) {
            setError('Please fill in all fields');
            return;
        }

        try {
            const response = await axios.post('https://localhost:7140/api/loans', {
                amountRequired: parseFloat(amountRequired),
                loanTerm: parseInt(loanTerm),
                userId: 'user123', // Replace with real user ID from auth
            });
            setSuccess('Loan request created successfully!');
            setAmountRequired('');
            setLoanTerm('');
        } catch (error) {
            setError('Error creating loan. Please try again.');
        }
    };

    return (
        <div className="container mt-5">
            <h2 className="text-center mb-4">Request a Loan</h2>
            {error && <div className="alert alert-danger">{error}</div>}
            {success && <div className="alert alert-success">{success}</div>}
            <form onSubmit={handleSubmit} className="card p-4 shadow-sm">
                <div className="mb-3">
                    <label htmlFor="amountRequired" className="form-label">Amount Required</label>
                    <input
                        type="number"
                        id="amountRequired"
                        className="form-control"
                        value={amountRequired}
                        onChange={(e) => setAmountRequired(e.target.value)}
                        placeholder="Enter loan amount"
                        required
                    />
                </div>
                <div className="mb-3">
                    <label htmlFor="loanTerm" className="form-label">Loan Term (weeks)</label>
                    <input
                        type="number"
                        id="loanTerm"
                        className="form-control"
                        value={loanTerm}
                        onChange={(e) => setLoanTerm(e.target.value)}
                        placeholder="Enter loan term"
                        required
                    />
                </div>
                <button type="submit" className="btn btn-primary w-100">Submit Loan Request</button>
            </form>
        </div>
    );
}

export default LoanForm;
