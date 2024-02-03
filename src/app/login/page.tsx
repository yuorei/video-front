'use client'
import React, { useState, useEffect } from 'react';
import UserRegisterButton from "@/app/components/user-register";
import { gql } from '@apollo/client';
import { useMutation } from '@apollo/client';

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

const REGISTER_USER = gql`
  mutation RegisterUser($input: UserInput!) {
    registerUser(input: $input) {
      id
      name
    }
  }
`;

const LoginForm: React.FC = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [registerUser, { data, loading, error }] = useMutation(REGISTER_USER);

    const handleLogin = async () => {
        try {
            const response = await fetch(`${process.env.NEXT_PUBLIC_YUOREI_AUTH_API_URL}/login`, {
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

            const loginData: Response = await response.json();
            localStorage.setItem('token', loginData.id_token);
            console.log('Login success:', localStorage.getItem('token'));
            // TODO graphqlでcreateUserを呼び出す
            registerUser({ variables: { input: { name: username } } })
                .then(response => {
                    // 登録成功時の処理
                    console.log('登録成功:', response.data);
                    return
                })
                .catch(err => {
                    console.error(err);
                });
            window.location.href = '/';


        } catch (error) {
            console.error('Login error:', error);
            alert("ユーザー名かパスワードが間違っています")
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
