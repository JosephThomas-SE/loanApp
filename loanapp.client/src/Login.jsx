import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");

    try {
      const response = await axios.post("https://localhost:7140/api/Login/login", {
        username,
        password,
      });

      // Save the JWT token in localStorage
      const { token } = response.data; // Assuming backend sends a token
      localStorage.setItem("token", token);

      // Redirect to the main dashboard (home page or relevant route)
      navigate("/");
    } catch (err) {
      console.error(err);
      setError(err.response?.data || "Invalid credentials. Please try again.");
    }
  };

  return (
    <div className="container mt-5">
      <div className="row justify-content-center">
        <div className="col-md-6">
          <div className="card shadow-lg">
            <div className="card-header bg-primary text-white">
              <h3 className="text-center">Login - Loan App</h3>
            </div>
            <div className="card-body">
              <form onSubmit={handleLogin}>
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
                    Login
                  </button>
                </div>
              </form>
              <div className="text-center">
                <button
                  className="btn btn-link"
                  onClick={() => navigate("/signup")}
                >
                  Don't have an account? Sign up here.
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

export default Login;
