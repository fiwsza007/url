import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { api } from '../api';

export default function Register() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [err, setErr] = useState('');
  const [ok, setOk] = useState('');
  const navigate = useNavigate();

  async function onSubmit(e) {
    e.preventDefault();
    setErr('');
    setOk('');
    if (password !== confirm) {
      setErr('รหัสผ่านไม่ตรงกัน');
      return;
    }
    try {
      await api('/api/auth/register', {
        method: 'POST',
        body: JSON.stringify({ email, password }),
        auth: false
      });
      setOk('สมัครสมาชิกสำเร็จ กำลังพาไปหน้าเข้าสู่ระบบ...');
      setTimeout(() => navigate('/login'), 800);
    } catch (e) {
      setErr(e.message);
    }
  }

  return (
    <div className="max-w-md mx-auto mt-10 bg-white border border-gray-200 rounded p-6">
      <h1 className="text-2xl font-semibold mb-4">สมัครสมาชิก</h1>
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
            minLength={6}
          />
        </div>
        <div>
          <label className="block text-sm mb-1">ยืนยัน Password</label>
          <input
            type="password"
            className="w-full border rounded px-3 py-2"
            value={confirm}
            onChange={e => setConfirm(e.target.value)}
            required
            minLength={6}
          />
        </div>
        {err && <div className="text-red-600 text-sm">{err}</div>}
        {ok && <div className="text-green-600 text-sm">{ok}</div>}
        <button type="submit" className="w-full bg-blue-600 hover:bg-blue-700 text-white rounded py-2">
          สมัครสมาชิก
        </button>
      </form>
      <div className="text-sm mt-4">
        มีบัญชีแล้ว? <Link to="/login" className="text-blue-600 hover:underline">เข้าสู่ระบบ</Link>
      </div>
    </div>
  );
}