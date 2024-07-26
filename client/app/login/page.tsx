"use client";

import { useState } from 'react';
import axios from 'axios';
import { useRouter } from 'next/router';
import Cookies from 'js-cookie';

const Login = () => {
  const [form, setForm] = useState<{ email: string; password: string }>({ email: '', password: '' });
  const router = useRouter();

  const handleLogin = async () => {
    try {
      const response = await axios.post('http://localhost:5000/login', { email: form.email, password: form.password }, { withCredentials: true });
      Cookies.set('token', response.data.token, { expires: 1 });
      router.push('/students');
    } catch (error) {
      console.error('Error during login:', error);
    }
  };

  const handleRegister = async () => {
    try {
      await axios.post('http://localhost:5000/register', { email: form.email, password: form.password });
      handleLogin();
    } catch (error) {
      console.error('Error during registration:', error);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen py-2">
      <h1 className="text-2xl font-bold">Login/Register</h1>
      <input 
        type="email" 
        placeholder="Email" 
        className="mt-2 p-2 border border-gray-300 rounded" 
        onChange={(e) => setForm({ ...form, email: e.target.value })} 
      />
      <input 
        type="password" 
        placeholder="Password" 
        className="mt-2 p-2 border border-gray-300 rounded" 
        onChange={(e) => setForm({ ...form, password: e.target.value })} 
      />
      <div className="mt-4 space-x-2">
        <button onClick={handleLogin} className="bg-blue-500 text-white px-4 py-2 rounded">Login</button>
        <button onClick={handleRegister} className="bg-green-500 text-white px-4 py-2 rounded">Register</button>
      </div>
    </div>
  );
};

export default Login;
