import { useState } from "react";
import { signIn } from "../services/auth";

export default function Login() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const handleSubmit = async (e) => {
        e.preventDefault();
        await signIn(email, password);
    };

    return (
        <form onSubmit={handleSubmit} className="login-form">
        <h2>Login</h2>
        <input placeholder="Email" onChange={e => setEmail(e.target.value)} />
        <input type="password" placeholder="Password" onChange={e => setPassword(e.target.value)} />
        <button>Ingresar</button>
        </form>
    );
}
