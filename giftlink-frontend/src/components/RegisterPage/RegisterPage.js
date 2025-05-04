import React, { useState } from "react";
import "./RegisterPage.css";
import { urlConfig } from "../../config";
import { useAppContext } from "../../context/AuthContext";
import { useNavigate } from "react-router-dom";

function RegisterPage() {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showerr, setShowerr] = useState("");
  const [isLoading, setIsLoading] = useState(false); // Loading state
  const navigate = useNavigate();
  const { setIsLoggedIn } = useAppContext();

  // Function to validate form inputs
  const validateForm = () => {
    if (!firstName || !lastName || !email || !password) {
      setShowerr("All fields are required.");
      return false;
    }
    return true;
  };

  const handleRegister = async () => {
    if (!validateForm()) return; // Only proceed if the form is valid

    try {
      setIsLoading(true); // Start loading
      const response = await fetch(
        `${urlConfig.backendUrl}/api/auth/register`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            firstName,
            lastName,
            email,
            password,
          }),
        }
      );

      const json = await response.json();
      setIsLoading(false); // Stop loading

      if (json.authtoken) {
        // Successful registration
        sessionStorage.setItem("auth-token", json.authtoken);
        sessionStorage.setItem("name", firstName);
        sessionStorage.setItem("email", json.email);
        setIsLoggedIn(true);
        navigate("/app");
      } else if (json.error) {
        // Handle backend errors (e.g., email already taken)
        setShowerr(json.error);
      }
    } catch (e) {
      setIsLoading(false); // Stop loading on error
      console.log("Error fetching details: " + e.message);
      setShowerr("An error occurred during registration.");
    }
  };

  return (
    <div className="container mt-5">
      <div className="row justify-content-center">
        <div className="col-md-6 col-lg-4">
          <div className="register-card p-4 border rounded">
            <h2 className="text-center mb-4 font-weight-bold">Register</h2>
            <div className="mb-3">
              <label htmlFor="firstName" className="form-label">
                First Name
              </label>
              <input
                id="firstName"
                type="text"
                className="form-control"
                placeholder="Enter your first name"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
              />
            </div>
            <div className="mb-3">
              <label htmlFor="lastName" className="form-label">
                Last Name
              </label>
              <input
                id="lastName"
                type="text"
                className="form-control"
                placeholder="Enter your last name"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
              />
            </div>
            <div className="mb-3">
              <label htmlFor="email" className="form-label">
                Email
              </label>
              <input
                id="email"
                type="email"
                className="form-control"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <div className="mb-4">
              <label htmlFor="password" className="form-label">
                Password
              </label>
              <input
                id="password"
                type="password"
                className="form-control"
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
            {showerr && <div className="text-danger">{showerr}</div>}{" "}
            {/* Display error */}
            <button
              className="btn btn-primary w-100 mb-3"
              onClick={handleRegister}
              disabled={isLoading} // Disable button while loading
            >
              {isLoading ? "Registering..." : "Register"}{" "}
              {/* Show loading text */}
            </button>
            <p className="mt-4 text-center">
              Already a member?{" "}
              <a href="/app/login" className="text-primary">
                Login
              </a>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default RegisterPage;
