import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

function SignUp() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleSignUp = async (e) => {
    e.preventDefault();
    setError("");

    try {
      await axios.post("https://localhost:7140/api/Login/signup", {
        username,
        passwordHash: password,
      });

      // Redirect to login page after successful signup
      navigate("/login");
    } catch (err) {
      console.error(err);
      setError(err.response?.data || "Error occurred during signup. Please try again.");
    }
  };

  return (
    <div className="container mt-5">
      <div className="row justify-content-center">
        <div className="col-md-6">
          <div className="card shadow-lg">
            <div className="card-header bg-primary text-white">
              <h3 className="text-center">Sign Up - Loan App</h3>
            </div>
            <div className="card-body">
              <form onSubmit={handleSignUp}>
                <div className="mb-3">
                  <label htmlFor="username" className="form-label">
                    Username
                  </label>
                  <input
                    type="text"
                    id="username"
                    className="form-control"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    required
                  />
                </div>
                <div className="mb-3">
                  <label htmlFor="password" className="form-label">
                    Password
                  </label>
                  <input
                    type="password"
                    id="password"
                    className="form-control"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                </div>
                {error && (
                  <div className="alert alert-danger" role="alert">
                    {error}
                  </div>
                )}
                <div className="d-grid mb-3">
                  <button type="submit" className="btn btn-primary">
                    Sign Up
                  </button>
                </div>
              </form>
              <div className="text-center">
                <button
                  className="btn btn-link"
                  onClick={() => navigate("/login")}
                >
                  Already have an account? Login here.
                </button>
              </div>
            </div>
            <div className="card-footer text-center">
              <small>&copy; 2024 Loan App</small>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default SignUp;
