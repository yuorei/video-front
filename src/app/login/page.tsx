'use client'
import React, { useState, useEffect } from 'react';
import { gql } from '@apollo/client';
import { useMutation } from '@apollo/client';
import CustomLink from "../components/custom-link"
import LoadingPage from '../components/loading';
import ErrorPage from '../components/error';

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
            registerUser({ variables: { input: { name: username } } })
                .then(response => {
                    // 登録成功時の処理
                    console.log('登録成功:', response.data);
                    window.location.href = '/';
                })
                .catch(err => {
                    if (!err.message.includes("duplicate key")) {
                        localStorage.removeItem('token');
                        alert("エラーが発生しました。もう一度ログインしてください。")
                        return
                    }
                    window.location.href = '/';
                });
        } catch (error) {
            console.error('Login error:', error);
            alert("ユーザー名かパスワードが間違っています")
        }
    };

    if (loading) return <LoadingPage />;
    if (error && !error.message.includes("duplicate key")) return <ErrorPage errorMessage={error.message} />;

    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-gray-900">
            <div className="p-8 bg-gray-800 shadow-lg rounded-lg max-w-md w-full">
                <h2 className="text-2xl font-semibold text-white text-center">Login</h2>
                <div className="mt-4">
                    <div>
                        <label className="block text-gray-300">Username</label>
                        <input
                            type="text"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            placeholder="Username"
                            className="mt-2 p-3 block w-full bg-gray-700 border border-gray-600 rounded-md text-white focus:border-blue-500 focus:ring focus:ring-blue-300 focus:ring-opacity-50"
                        />
                    </div>
                    <div className="mt-4">
                        <label className="block text-gray-300">Password</label>
                        <input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            placeholder="Password"
                            className="mt-2 p-3 block w-full bg-gray-700 border border-gray-600 rounded-md text-white focus:border-blue-500 focus:ring focus:ring-blue-300 focus:ring-opacity-50"
                        />
                    </div>
                    <div className="mt-6">
                        <button
                            onClick={handleLogin}
                            className="w-full px-4 py-2 tracking-wide text-gray-900 transition-colors duration-200 transform bg-blue-500 rounded-md hover:bg-blue-400 focus:outline-none focus:bg-blue-400"
                        >
                            ログイン
                        </button>
                    </div>
                    <div className="mt-6">
                        <CustomLink href="/register">
                            <button
                                className="w-full px-4 py-2 tracking-wide text-gray-900 transition-colors duration-200 transform bg-blue-500 rounded-md hover:bg-blue-400 focus:outline-none focus:bg-blue-400"
                            >
                                アカウント登録
                            </button>
                        </CustomLink>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default LoginForm;
