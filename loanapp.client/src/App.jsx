import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Route, Routes, Navigate } from "react-router-dom";
import LoanForm from "./LoanForm";
import AdminDashboard from "./AdminDashboard";
import LoanRepayment from "./LoanRepayment";
import SignUp from "./SignUp";
import Login from "./Login";

function App() {
  const [user, setUser] = useState(null); // Store user details (e.g., role)

  // Mock function to simulate fetching user role from token
  const getUserFromToken = () => {
    const token = localStorage.getItem("token");
    if (!token) return null;

    try {
      const decodedToken = JSON.parse(atob(token.split(".")[1])); // Decode JWT
      return { role: decodedToken.role }; // Assuming the role is stored in the token
    } catch {
      return null;
    }
  };

  useEffect(() => {
    const loggedInUser = getUserFromToken();
    setUser(loggedInUser);
  }, []);

  // Private Route Wrapper
  const PrivateRoute = ({ element, allowedRoles }) => {
    if (!user) {
      return <Navigate to="/login" replace />; // Redirect to login if not authenticated
    }

    if (!allowedRoles.includes(user.role)) {
      return <Navigate to="/" replace />; // Redirect to default if unauthorized
    }

    return element;
  };

  return (
    <Router>
      <nav className="navbar navbar-expand-lg navbar-light bg-light">
        <div className="container">
          <span className="navbar-brand">Loan App</span>
        </div>
      </nav>

      <Routes>
        {/* Public Routes */}
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<SignUp />} />

        {/* Private Routes */}
        <Route
          path="/admin"
          element={<PrivateRoute element={<AdminDashboard />} allowedRoles={["admin"]} />}
        />
        <Route
          path="/"
          element={<PrivateRoute element={<LoanForm />} allowedRoles={["user"]} />}
        />
        <Route
          path="/repayment"
          element={<PrivateRoute element={<LoanRepayment />} allowedRoles={["user"]} />}
        />
      </Routes>

    </Router>
  );
}

export default App;
