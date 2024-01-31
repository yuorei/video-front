'use client'
import React, { useState, useEffect } from 'react';
import { useCookies } from "react-cookie";
import UserRegisterButton from "@/app/components/user-register";


// レスポンス型の定義
interface LoginResponse {
    ClientID: string;
    ClientSecret: string;
    GrantType: string;
    Username: string;
    Password: string;
    Scope: string;
}

interface Response {
    access_token: string
    id_token: string
    expires_in: number
    refresh_expires_in: number
    refresh_token: string
    token_type: string
    "not-before-policy": number
    session_state: string
    scope: string
}


const LoginForm: React.FC = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [cookies, setCookie] = useCookies(["idToken"]);

    const handleLogin = async () => {
        try {
            const response = await fetch('', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    username,
                    password,
                }),
            });

            if (!response.ok) {
                throw new Error('Login failed');
            }

            const data: Response = await response.json();
            setCookie('idToken', data.id_token);

            // TODO graphqlでcreateUserを呼び出す
            window.location.href = '/';
        } catch (error) {
            console.error('Login error:', error);
        }
    };

    return (
        <div>
            <div>
                <input
                    type="text"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    placeholder="Username"
                />
                <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Password"
                />
                <button onClick={handleLogin}>Login</button>
            </div>
            <div>
                <UserRegisterButton />
            </div>
        </div>

    );
};

export default LoginForm;
