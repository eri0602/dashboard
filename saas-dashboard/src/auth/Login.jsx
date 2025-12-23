import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Mail, Lock, ArrowRight } from "lucide-react";
import { signIn } from "../services/auth.service";
import "../styles/login.css";

export default function Login() {
    const navigate = useNavigate();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [errorMsg, setErrorMsg] = useState("");

    async function handleSubmit(e) {
        e.preventDefault();
        setErrorMsg("");

        const { error } = await signIn(email, password);
        if (error) {
        setErrorMsg(error.message);
        return;
        }

        navigate("/", { replace: true });
    }

    return (
        <div className="login-page">
        <div className="login-card">
            {/* Header */}
            <div className="login-header">
            <div className="login-logo">ND</div>
            <h1>Welcome back</h1>
            <p>Sign in to continue to your dashboard</p>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="login-form">
            <div className="login-field">
                <Mail size={16} />
                <input
                type="email"
                placeholder="you@company.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                />
            </div>

            <div className="login-field">
                <Lock size={16} />
                <input
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                />
            </div>

            {errorMsg && <div className="login-error">{errorMsg}</div>}

            <button type="submit" className="login-button">
                Sign in
                <ArrowRight size={16} />
            </button>
            </form>

            {/* Footer */}
            <div className="login-footer">
            <span>Enterprise Dashboard</span>
            </div>
        </div>
        </div>
    );
}

