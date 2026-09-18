import { useState } from "react";
import { useNavigate } from "react-router-dom";

function Register() {
  const navigate = useNavigate();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");

  const handleRegister = async (e) => {
    e.preventDefault();
    setMessage("");

    try {
      const response = await fetch(
        "http://localhost:5000/api/auth/register",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            name,
            email,
            password,
          }),
        }
      );

      const data = await response.json();

      if (response.ok) {
        setMessage("Registration successful! 🎉");

        setTimeout(() => {
          navigate("/login");
        }, 700);
      } else {
        setMessage(data.message || "Registration failed");
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

        body {
          margin: 0;
          font-family: Arial, Helvetica, sans-serif;
        }

        .register-page {
          min-height: 100vh;
          display: flex;
          justify-content: center;
          align-items: center;
          padding: 25px;
          background:
            radial-gradient(circle at top left, #e8e5ff, transparent 35%),
            radial-gradient(circle at bottom right, #dce7ff, transparent 35%),
            #f7f8fc;
        }

        .register-card {
          width: 900px;
          max-width: 100%;
          min-height: 560px;
          display: flex;
          overflow: hidden;
          border-radius: 25px;
          background: white;
          box-shadow: 0 25px 70px rgba(50, 40, 100, 0.18);
          animation: cardShow 0.7s ease;
        }

        /* LEFT SIDE */

        .register-left {
          width: 48%;
          padding: 55px 45px;
          position: relative;
          overflow: hidden;
          display: flex;
          flex-direction: column;
          justify-content: center;
          align-items: center;
          text-align: center;
          color: white;

          background:
            radial-gradient(
              circle at 20% 20%,
              rgba(255,255,255,0.2),
              transparent 25%
            ),
            linear-gradient(
              145deg,
              #6546e8,
              #5234d6,
              #3b22bb
            );
        }

        .register-left::before {
          content: "";
          position: absolute;
          width: 250px;
          height: 250px;
          border-radius: 50%;
          background: rgba(255,255,255,0.08);
          top: -120px;
          right: -90px;
        }

        .register-left::after {
          content: "";
          position: absolute;
          width: 320px;
          height: 320px;
          border-radius: 50%;
          background: rgba(255,255,255,0.06);
          bottom: -190px;
          left: -140px;
        }

        .brand-icon {
          width: 82px;
          height: 82px;
          border-radius: 24px;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 38px;
          margin-bottom: 25px;

          background: rgba(255,255,255,0.15);
          border: 1px solid rgba(255,255,255,0.35);
          backdrop-filter: blur(8px);

          animation: floating 3s ease-in-out infinite;

          position: relative;
          z-index: 2;
        }

        .register-left h1 {
          font-size: 32px;
          margin: 0 0 14px;
          position: relative;
          z-index: 2;
        }

        .register-left p {
          max-width: 300px;
          margin: 0;
          font-size: 14px;
          line-height: 1.7;
          opacity: 0.9;
          position: relative;
          z-index: 2;
        }

        .login-button {
          margin-top: 30px;
          padding: 13px 32px;
          border: 1px solid rgba(255,255,255,0.8);
          border-radius: 30px;
          background: transparent;
          color: white;
          font-size: 13px;
          font-weight: bold;
          letter-spacing: 0.5px;
          cursor: pointer;

          position: relative;
          z-index: 2;

          transition: 0.3s ease;
        }

        .login-button:hover {
          background: white;
          color: #5134d8;
          transform: translateY(-3px);
        }

        /* RIGHT SIDE */

        .register-right {
          width: 52%;
          padding: 45px 65px;
          display: flex;
          flex-direction: column;
          justify-content: center;
          background: white;
        }

        .register-right h2 {
          margin: 0;
          color: #202020;
          font-size: 32px;
        }

        .subtitle {
          margin: 10px 0 28px;
          color: #999;
          font-size: 14px;
        }

        /* INPUTS */

        .input-box {
          position: relative;
          margin-bottom: 17px;
        }

        .input-icon {
          position: absolute;
          left: 16px;
          top: 50%;
          transform: translateY(-50%);
          font-size: 16px;
          color: #999;
        }

        .register-input {
          width: 100%;
          height: 52px;
          padding: 0 18px 0 45px;

          border: 1px solid #eeeeee;
          border-radius: 12px;

          background: #f7f7f9;
          outline: none;

          font-size: 14px;

          transition: 0.3s ease;
        }

        .register-input:focus {
          background: white;
          border-color: #6546e8;
          box-shadow: 0 0 0 4px rgba(101,70,232,0.08);
        }

        /* REGISTER BUTTON */

        .register-submit {
          width: 100%;
          height: 52px;

          margin-top: 8px;

          border: none;
          border-radius: 28px;

          background: linear-gradient(
            135deg,
            #6546e8,
            #4b2bc9
          );

          color: white;

          font-size: 14px;
          font-weight: bold;
          letter-spacing: 0.5px;

          cursor: pointer;

          box-shadow: 0 10px 22px rgba(83,55,210,0.25);

          transition: 0.3s ease;
        }

        .register-submit:hover {
          transform: translateY(-2px);
          box-shadow: 0 14px 28px rgba(83,55,210,0.35);
        }

        .register-submit:active {
          transform: scale(0.98);
        }

        /* MESSAGE */

        .message {
          text-align: center;
          margin: 16px 0 0;
          font-size: 13px;
          color: #4f9b38;
        }

        /* BOTTOM LOGIN */

        .login-text {
          text-align: center;
          margin-top: 24px;
          color: #999;
          font-size: 13px;
        }

        .login-text button {
          border: none;
          background: none;
          color: #6546e8;
          font-weight: bold;
          cursor: pointer;
        }

        .login-text button:hover {
          text-decoration: underline;
        }

        /* ANIMATIONS */

        @keyframes cardShow {
          from {
            opacity: 0;
            transform: translateY(25px) scale(0.97);
          }

          to {
            opacity: 1;
            transform: translateY(0) scale(1);
          }
        }

        @keyframes floating {
          0%, 100% {
            transform: translateY(0);
          }

          50% {
            transform: translateY(-8px);
          }
        }

        /* TABLET */

        @media (max-width: 750px) {
          .register-page {
            padding: 15px;
          }

          .register-card {
            flex-direction: column;
            min-height: auto;
            border-radius: 20px;
          }

          .register-left {
            width: 100%;
            min-height: 270px;
            padding: 35px 25px;
          }

          .register-left h1 {
            font-size: 27px;
          }

          .register-left p {
            font-size: 13px;
          }

          .brand-icon {
            width: 65px;
            height: 65px;
            font-size: 30px;
            margin-bottom: 17px;
          }

          .register-right {
            width: 100%;
            padding: 40px 30px;
          }
        }

        /* MOBILE */

        @media (max-width: 430px) {
          .register-page {
            padding: 10px;
          }

          .register-left {
            min-height: 230px;
          }

          .register-left p {
            display: none;
          }

          .login-button {
            margin-top: 20px;
          }

          .register-right {
            padding: 35px 22px;
          }

          .register-right h2 {
            font-size: 27px;
          }
        }
      `}</style>

      <div className="register-page">
        <div className="register-card">

          {/* LEFT PANEL */}

          <div className="register-left">

            <div className="brand-icon">
              ✨
            </div>

            <h1>PhotoEnhance AI</h1>

            <p>
              Join us and bring your old memories
              back to life with powerful AI
              photo enhancement technology.
            </p>

            <button
              className="login-button"
              onClick={() => navigate("/login")}
            >
              SIGN IN
            </button>

          </div>

          {/* RIGHT PANEL */}

          <div className="register-right">

            <h2>Create Account</h2>

            <p className="subtitle">
              Create your account and start enhancing photos.
            </p>

            <form onSubmit={handleRegister}>

              {/* NAME */}

              <div className="input-box">
                <span className="input-icon">
                  👤
                </span>

                <input
                  className="register-input"
                  type="text"
                  placeholder="Full Name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                />
              </div>

              {/* EMAIL */}

              <div className="input-box">
                <span className="input-icon">
                  ✉️
                </span>

                <input
                  className="register-input"
                  type="email"
                  placeholder="Email Address"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>

              {/* PASSWORD */}

              <div className="input-box">
                <span className="input-icon">
                  🔒
                </span>

                <input
                  className="register-input"
                  type="password"
                  placeholder="Create Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>

              <button
                className="register-submit"
                type="submit"
              >
                CREATE ACCOUNT
              </button>

            </form>

            {message && (
              <p className="message">
                {message}
              </p>
            )}

            <div className="login-text">
              Already have an account?{" "}

              <button
                onClick={() => navigate("/login")}
              >
                Sign In
              </button>
            </div>

          </div>

        </div>
      </div>
    </>
  );
}

export default Register;