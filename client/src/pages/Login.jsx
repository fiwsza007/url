import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { api } from '../api';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [err, setErr] = useState('');
  const navigate = useNavigate();

  async function onSubmit(e) {
    e.preventDefault();
    setErr('');
    try {
      const res = await api('/api/auth/login', {
        method: 'POST',
        body: JSON.stringify({ email, password }),
        auth: false
      });
      localStorage.setItem('token', res.token);
      localStorage.setItem('email', res.user.email);
      navigate('/');
    } catch (e) {
      setErr(e.message);
    }
  }

  return (
    <div className="max-w-md mx-auto mt-10 bg-white border border-gray-200 rounded p-6">
      <h1 className="text-2xl font-semibold mb-4">เข้าสู่ระบบ</h1>
      <form onSubmit={onSubmit} className="space-y-4">
        <div>
          <label className="block text-sm mb-1">Email</label>
          <input
            type="email"
            className="w-full border rounded px-3 py-2"
            value={email}
            onChange={e => setEmail(e.target.value)}
            required
          />
        </div>
        <div>
          <label className="block text-sm mb-1">Password</label>
          <input
            type="password"
            className="w-full border rounded px-3 py-2"
            value={password}
            onChange={e => setPassword(e.target.value)}
            required
          />
        </div>
        {err && <div className="text-red-600 text-sm">{err}</div>}
        <button type="submit" className="w-full bg-blue-600 hover:bg-blue-700 text-white rounded py-2">
          เข้าสู่ระบบ
        </button>
      </form>
      <div className="text-sm mt-4">
        ยังไม่มีบัญชี? <Link to="/register" className="text-blue-600 hover:underline">สมัครสมาชิก</Link>
      </div>
    </div>
  );
}