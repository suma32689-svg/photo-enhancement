import { useState } from "react";
import { useNavigate } from "react-router-dom";

function Login() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");

  const handleLogin = async (e) => {
    e.preventDefault();
    setMessage("");

    try {
      const response = await fetch(
        "http://localhost:5000/api/auth/login",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            email,
            password,
          }),
        }
      );

      const data = await response.json();

      if (response.ok) {
        // Save JWT token
        localStorage.setItem("token", data.token);

        // Save user information
        localStorage.setItem("user", JSON.stringify(data.user));

        setMessage("Login successful! 🎉");

        setTimeout(() => {
          navigate("/dashboard");
        }, 500);
      } else {
        setMessage(data.message || "Invalid email or password");
      }
    } catch (error) {
      console.error(error);
      setMessage("Cannot connect to server");
    }
  };

  return (
    <>
      <style>{`
        * {
          box-sizing: border-box;
        }

        .login-page {
          min-height: 100vh;
          display: flex;
          justify-content: center;
          align-items: center;
          padding: 30px;
          background: #ffffff;
          font-family: Arial, Helvetica, sans-serif;
          overflow: hidden;
        }

        .login-wrapper {
          width: 950px;
          max-width: 100%;
          min-height: 570px;
          display: flex;
          position: relative;
          background: #ffffff;
          border-radius: 18px;
          overflow: hidden;
          box-shadow: 0 20px 55px rgba(18, 4, 4, 0.96);
          animation: cardAppear 0.8s ease;
        }

        /* LEFT RED PANEL */

        .login-intro {
          width: 45%;
          background: linear-gradient(
            135deg,
            #103cac,
            #1518b3,
            #12129f
          );
          color: white;
          display: flex;
          flex-direction: column;
          justify-content: center;
          align-items: center;
          text-align: center;
          padding: 50px;
          position: relative;
          overflow: hidden;
          animation: slideLeft 0.9s ease;
        }

        .login-intro::before {
          content: "";
          width: 280px;
          height: 280px;
          border-radius: 50%;
          background: rgba(255, 255, 255, 0.08);
          position: absolute;
          top: -100px;
          left: -100px;
        }

        .login-intro::after {
          content: "";
          width: 350px;
          height: 350px;
          border-radius: 50%;
          background: rgba(255, 255, 255, 0.06);
          position: absolute;
          bottom: -180px;
          right: -150px;
        }

        .logo-circle {
          width: 85px;
          height: 85px;
          border-radius: 50%;
          background: rgba(255, 255, 255, 0.16);
          border: 2px solid rgba(255, 255, 255, 0.5);
          display: flex;
          justify-content: center;
          align-items: center;
          font-size: 38px;
          margin-bottom: 25px;
          position: relative;
          z-index: 2;
          animation: floatLogo 3s ease-in-out infinite;
        }

        .login-intro h1 {
          font-size: 34px;
          margin: 0 0 15px;
          position: relative;
          z-index: 2;
        }

        .login-intro p {
          font-size: 15px;
          line-height: 1.7;
          max-width: 300px;
          opacity: 0.92;
          position: relative;
          z-index: 2;
        }

        .intro-button {
          margin-top: 25px;
          padding: 12px 30px;
          border: 1px solid white;
          border-radius: 25px;
          background: transparent;
          color: white;
          font-size: 14px;
          font-weight: bold;
          cursor: pointer;
          position: relative;
          z-index: 2;
          transition: all 0.3s ease;
        }

        .intro-button:hover {
          background: white;
          color: #f7254e;
          transform: translateY(-2px);
        }

        /* RIGHT LOGIN PANEL */

        .login-form-area {
          width: 55%;
          padding: 55px 65px;
          display: flex;
          flex-direction: column;
          justify-content: center;
          background: white;
          animation: slideRight 0.9s ease;
        }

        .login-form-area h2 {
          margin: 0;
          font-size: 34px;
          color: #222;
        }

        .welcome-text {
          margin: 10px 0 25px;
          color: #888;
          font-size: 14px;
        }

        /* SOCIAL ICONS */

        .social-container {
          display: flex;
          gap: 12px;
          margin-bottom: 20px;
        }

        .social {
          width: 42px;
          height: 42px;
          border: 1px solid #ddd;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          color: #555;
          text-decoration: none;
          font-weight: bold;
          transition: all 0.3s ease;
        }

        .social:hover {
          background: #f7254e;
          color: white;
          border-color: #f7254e;
          transform: translateY(-3px);
        }

        .or-text {
          color: #aaa;
          font-size: 12px;
          margin-bottom: 12px;
        }

        /* INPUTS */

        .input-group {
          margin-bottom: 15px;
        }

        .login-input {
          width: 100%;
          padding: 15px 18px;
          border: none;
          outline: none;
          background: #f4f4f4;
          border-radius: 8px;
          font-size: 14px;
          color: #333;
          transition: all 0.3s ease;
        }

        .login-input:focus {
          background: #fff;
          box-shadow: 0 0 0 2px rgba(247, 37, 78, 0.2);
        }

        .forgot-password {
          text-align: right;
          margin: 2px 0 20px;
        }

        .forgot-password button {
          border: none;
          background: none;
          color: #888;
          font-size: 12px;
          cursor: pointer;
        }

        .forgot-password button:hover {
          color: #5a25f7ca;
        }

        /* LOGIN BUTTON */

        .login-button {
          width: 100%;
          padding: 15px;
          border: none;
          border-radius: 25px;
          background: linear-gradient(
            135deg,
            #5a25f7ca,
            #5a25f7ca
          );
          color: white;
          font-size: 15px;
          font-weight: bold;
          cursor: pointer;
          box-shadow: 0 8px 20px rgba(247, 37, 78, 0.25);
          transition: all 0.3s ease;
        }

        .login-button:hover {
          transform: translateY(-2px);
          box-shadow: 0 12px 25px rgba(247, 37, 78, 0.35);
        }

        .login-button:active {
          transform: scale(0.98);
        }

        /* MESSAGE */

        .message {
          text-align: center;
          margin: 15px 0 0;
          font-size: 13px;
          color: #8aa610;
          animation: messageAppear 0.3s ease;
        }

        /* MOBILE REGISTER */

        .mobile-register {
          display: none;
          text-align: center;
          margin-top: 22px;
          color: #888;
          font-size: 13px;
        }

        .mobile-register button {
          border: none;
          background: none;
          color: #4e14e193;
          font-weight: bold;
          cursor: pointer;
        }

        /* ANIMATIONS */

        @keyframes cardAppear {
          from {
            opacity: 0;
            transform: scale(0.92);
          }

          to {
            opacity: 1;
            transform: scale(1);
          }
        }

        @keyframes slideLeft {
          from {
            opacity: 0;
            transform: translateX(-80px);
          }

          to {
            opacity: 1;
            transform: translateX(0);
          }
        }

        @keyframes slideRight {
          from {
            opacity: 0;
            transform: translateX(80px);
          }

          to {
            opacity: 1;
            transform: translateX(0);
          }
        }

        @keyframes floatLogo {
          0%, 100% {
            transform: translateY(0);
          }

          50% {
            transform: translateY(-8px);
          }
        }

        @keyframes messageAppear {
          from {
            opacity: 0;
            transform: translateY(-5px);
          }

          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        /* RESPONSIVE */

        @media (max-width: 750px) {
          .login-page {
            padding: 20px;
          }

          .login-wrapper {
            min-height: auto;
            flex-direction: column;
          }

          .login-intro {
            width: 100%;
            min-height: 250px;
            padding: 30px;
          }

          .logo-circle {
            width: 65px;
            height: 65px;
            font-size: 28px;
            margin-bottom: 15px;
          }

          .login-intro h1 {
            font-size: 26px;
          }

          .login-intro p {
            display: none;
          }

          .intro-button {
            display: none;
          }

          .login-form-area {
            width: 100%;
            padding: 40px 30px;
          }

          .login-form-area h2 {
            font-size: 28px;
          }

          .mobile-register {
            display: block;
          }
        }

        @media (max-width: 400px) {
          .login-form-area {
            padding: 30px 20px;
          }

          .login-intro {
            min-height: 210px;
          }
        }
      `}</style>

      <div className="login-page">
        <div className="login-wrapper">

          {/* RED INTRO PANEL */}
          <div className="login-intro">

            <div className="logo-circle">
              ✨
            </div>

            <h1>PhotoEnhance AI</h1>

            <p>
              Bring your old memories back to life.
              Enhance, restore and improve your
              photos using AI technology.
            </p>

            <button
              className="intro-button"
              onClick={() => navigate("/register")}
            >
              CREATE ACCOUNT
            </button>

          </div>

          {/* LOGIN FORM */}
          <div className="login-form-area">

            <h2>Sign In</h2>

            <p className="welcome-text">
              Welcome back! Please login to your account.
            </p>

            {/* SOCIAL ICONS */}
            <div className="social-container">

              <a
                href="#"
                className="social"
                onClick={(e) => e.preventDefault()}
              >
                f
              </a>

              <a
                href="#"
                className="social"
                onClick={(e) => e.preventDefault()}
              >
                G
              </a>

              <a
                href="#"
                className="social"
                onClick={(e) => e.preventDefault()}
              >
                in
              </a>

            </div>

            <div className="or-text">
              or use your account
            </div>

            {/* LOGIN FORM */}
            <form onSubmit={handleLogin}>

              <div className="input-group">
                <input
                  className="login-input"
                  type="email"
                  placeholder="Email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>

              <div className="input-group">
                <input
                  className="login-input"
                  type="password"
                  placeholder="Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>

              <div className="forgot-password">
                <button
                  type="button"
                  onClick={() => {
                    setMessage("Password reset is coming soon.");
                  }}
                >
                  Forgot your password?
                </button>
              </div>

              <button
                className="login-button"
                type="submit"
              >
                SIGN IN
              </button>

            </form>

            {/* LOGIN MESSAGE */}
            {message && (
              <p className="message">
                {message}
              </p>
            )}

            {/* MOBILE REGISTER */}
            <div className="mobile-register">
              Don't have an account?{" "}
              <button onClick={() => navigate("/register")}>
                Sign Up
              </button>
            </div>

          </div>
        </div>
      </div>
    </>
  );
}

export default Login;