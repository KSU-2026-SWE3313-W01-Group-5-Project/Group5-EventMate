import Navbar from "../components/Navbar.jsx";
import {useMutation, useQueryClient} from "@tanstack/react-query";
import {useState} from "react";
import {login, register} from "../services/authServices.js";

export default function Login() {
    const queryClient = useQueryClient();

    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [email, setEmail] = useState("");

    const handleLogin = async (e) => {
        e.preventDefault();

        try {
            await login({ username, password });
        } catch (err) {
            console.log(err);
        }
    };

    const handleRegister = async (e) => {
        e.preventDefault();

        try {
            await register({
                username,
                email,
                password
            });
        } catch (err) {
            console.log(err);
        }
    }

    return (
        <>
            <Navbar />
            <div>
                <h1>Login</h1>

                <form onSubmit={handleLogin}>
                    <input
                        type={"text"}
                        placeholder={"Username"}
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                    />
                    <input
                        type={"password"}
                        placeholder={"Password"}
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                    />

                    <button type="submit">Login</button>
                </form>

                <form onSubmit={handleRegister}>
                    <input
                        type={"text"}
                        placeholder={"Username"}
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                    />
                    <input
                        type={"password"}
                        placeholder={"Password"}
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                    />
                    <input
                        type={"email"}
                        placeholder={"Email"}
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                    />

                    <button type="submit">Register</button>
                </form>
            </div>
        </>
    )
}