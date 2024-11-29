import React, { useState, useEffect } from 'react';
import axios from 'axios';

function AdminDashboard() {
    const [loans, setLoans] = useState([]);
    const [error, setError] = useState('');

    useEffect(() => {
        fetchLoans();
    }, []);

    const fetchLoans = async () => {
        try {
            const response = await axios.get('https://localhost:7140/api/loans');
            setLoans(response.data);
        } catch (error) {
            setError('Error fetching loan requests.');
        }
    };

    const approveLoan = async (loanId) => {
        try {
            await axios.put(`https://localhost:7140/api/loans/${loanId}/approve`);
            fetchLoans(); // Refresh loan list
            alert('Loan approved successfully!');
        } catch (error) {
            setError('Error approving loan.');
        }
    };

    return (
        <div className="container mt-5">
            <h2 className="text-center mb-4">Admin Dashboard</h2>
            {error && <div className="alert alert-danger">{error}</div>}
            <table className="table table-bordered table-striped">
                <thead>
                    <tr>
                        <th>ID</th>
                        <th>Amount</th>
                        <th>Term (weeks)</th>
                        <th>Status</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {loans.map((loan) => (
                        <tr key={loan.id}>
                            <td>{loan.id}</td>
                            <td>${loan.amountRequired}</td>
                            <td>{loan.loanTerm}</td>
                            <td>{loan.status}</td>
                            <td>
                                {loan.status === 'PENDING' && (
                                    <button
                                        className="btn btn-success btn-sm"
                                        onClick={() => approveLoan(loan.id)}
                                    >
                                        Approve
                                    </button>
                                )}
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}

export default AdminDashboard;
