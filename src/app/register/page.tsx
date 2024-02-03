'use client'
import React, { useState, ChangeEvent } from 'react';

export default function CreateUserPage() {
    const [formData, setFormData] = useState({
        firstName: '',
        lastName: '',
        email: '',
        username: '',
        password: '',
        profileImage: null as Blob | null,
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
        const { name, value, files } = e.target;
        setFormData({
            ...formData,
            [name]: files ? files[0] : value,
        });
    };

    const handleSubmit = async () => {
        const formDataToSend = new FormData();
        Object.keys(formData).forEach(key => {
            const value = formData[key as keyof typeof formData];
            if (value !== null) {
                formDataToSend.append(key, value);
            }
        });

        try {
            const response = await fetch(`${process.env.NEXT_PUBLIC_YUOREI_AUTH_API_URL}/user`,{
                method: 'POST',
                body: formDataToSend,
            });

            if (!response.ok) {
                throw new Error(`Error: ${response.statusText}`);
            }
            window.location.href = '/login';
        } catch (e) {
            console.error('ユーザー作成エラー:', e);
        } finally {
            setLoading(false);
        }
    };

    if (loading) return <p>Loading...</p>;
    if (error) return <p>Error: {error}</p>;

    return (
        <div>
            <h1>ユーザー作成</h1>
            <input
                type="text"
                name="firstName"
                value={formData.firstName}
                onChange={handleInputChange}
                placeholder="名"
            />
            <input
                type="text"
                name="lastName"
                value={formData.lastName}
                onChange={handleInputChange}
                placeholder="姓"
            />
            <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                placeholder="メールアドレス"
            />
            <input
                type="text"
                name="username"
                value={formData.username}
                onChange={handleInputChange}
                placeholder="ユーザー名"
            />
            <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleInputChange}
                placeholder="パスワード"
            />
            <input
                type="file"
                name="profileImage"
                onChange={handleInputChange}
            />
            <button onClick={handleSubmit}>作成</button>
        </div>
    );
}
