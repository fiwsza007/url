import React, { useEffect, useMemo, useState } from 'react';
import { api } from '../api';

export default function Dashboard() {
  const [originalUrl, setOriginalUrl] = useState('');
  const [shortCode, setShortCode] = useState('');
  const [expiresAt, setExpiresAt] = useState('');
  const [err, setErr] = useState('');
  const [ok, setOk] = useState('');
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(false);

  const email = localStorage.getItem('email') || '';

  // ใช้ SHORT_BASE สำหรับโชว์ลิงก์ย่อ (ตัด / ท้ายเผื่อมี)
  const shortBase = useMemo(() => (SHORT_BASE || API_BASE).replace(/\/+$/, ''), [SHORT_BASE]);

  async function load() {
    setLoading(true);
    try {
      const rows = await api('/api/links');
      setItems(rows);
    } catch (e) {
      setErr(e.message);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    load();
  }, []);

  async function onCreate(e) {
    e.preventDefault();
    setErr('');
    setOk('');
    try {
      const payload = {
        originalUrl,
        shortCode,
        expiresAt: expiresAt ? new Date(expiresAt).toISOString() : null
      };
      const created = await api('/api/links', {
        method: 'POST',
        body: JSON.stringify(payload)
      });
      setOk('สร้างลิงก์สำเร็จ');
      setOriginalUrl('');
      setShortCode('');
      setExpiresAt('');
      setItems([created, ...items]);
    } catch (e) {
      setErr(e.message);
    }
  }

  async function toggleActive(id, current) {
    try {
      const updated = await api(`/api/links/${id}`, {
        method: 'PATCH',
        body: JSON.stringify({ isActive: !current })
      });
      setItems(items.map(it => (it.id === id ? updated : it)));
    } catch (e) {
      setErr(e.message);
    }
  }

  async function updateExpiry(id, newExpiry) {
    try {
      const payload = {
        expiresAt: newExpiry ? new Date(newExpiry).toISOString() : null
      };
      const updated = await api(`/api/links/${id}`, {
        method: 'PATCH',
        body: JSON.stringify(payload)
      });
      setItems(items.map(it => (it.id === id ? updated : it)));
    } catch (e) {
      setErr(e.message);
    }
  }

  async function remove(id) {
    if (!confirm('ต้องการลบลิงก์นี้หรือไม่?')) return;
    try {
      await api(`/api/links/${id}`, { method: 'DELETE' });
      setItems(items.filter(it => it.id !== id));
    } catch (e) {
      setErr(e.message);
    }
  }

  function copy(text) {
    navigator.clipboard.writeText(text);
  }

  return (
    <div className="space-y-8">
      <div className="bg-white border border-gray-200 rounded p-6">
        <h2 className="text-xl font-semibold mb-4">ยินดีต้อนรับ {email}</h2>
        <h3 className="text-lg font-medium mb-3">สร้างลิงก์ใหม่</h3>
        <form onSubmit={onCreate} className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="md:col-span-2">
            <label className="block text-sm mb-1">ลิงก์ต้นฉบับ (Original URL)</label>
            <input
              type="url"
              placeholder="https://example.com/very/long/url"
              className="w-full border rounded px-3 py-2"
              value={originalUrl}
              onChange={e => setOriginalUrl(e.target.value)}
              required
            />
          </div>
          <div>
            <label className="block text-sm mb-1">รหัสย่อ/ชื่อ (3-30 ตัว, a-z A-Z 0-9 - _)</label>
            <input
              type="text"
              placeholder="my-custom-code"
              className="w-full border rounded px-3 py-2"
              value={shortCode}
              onChange={e => setShortCode(e.target.value)}
              required
            />
          </div>
          <div>
            <label className="block text-sm mb-1">วันหมดอายุ (ไม่จำเป็น)</label>
            <input
              type="datetime-local"
              className="w-full border rounded px-3 py-2"
              value={expiresAt}
              onChange={e => setExpiresAt(e.target.value)}
            />
          </div>
          {err && <div className="md:col-span-2 text-red-600 text-sm">{err}</div>}
          {ok && <div className="md:col-span-2 text-green-600 text-sm">{ok}</div>}
          <div className="md:col-span-2">
            <button className="bg-blue-600 hover:bg-blue-700 text-white rounded px-4 py-2">สร้างลิงก์</button>
          </div>
        </form>
      </div>

      <div className="bg-white border border-gray-200 rounded p-6">
        <h3 className="text-lg font-medium mb-4">ลิงก์ของฉัน</h3>
        {loading ? (
          <div>กำลังโหลด...</div>
        ) : items.length === 0 ? (
          <div className="text-gray-600">ยังไม่มีลิงก์</div>
        ) : (
          <div className="space-y-4">
            {items.map(it => {
              // ใช้ฐานเดิมที่มีอยู่แล้ว
              const API_BASE = import.meta.env.VITE_API_BASE || 'http://localhost:4000';
              const shortBase = useMemo(() => API_BASE.replace(/\/+$/, ''), []);
              const expired = isExpired(it.expiresAt);
              return (
                <div key={it.id} className="border rounded p-4">
                  <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-2">
                    <div>
                      <div className="font-medium">
                        <a
                          href={shortUrl}
                          target="_blank"
                          rel="noreferrer"
                          className="text-blue-600 hover:underline"
                          title={shortUrl}
                        >
                          {shortUrl}
                        </a>
                        <button
                          className="ml-2 text-xs px-2 py-1 border rounded hover:bg-gray-50"
                          onClick={() => copy(shortUrl)}
                        >
                          คัดลอก
                        </button>
                      </div>
                      <div className="text-sm text-gray-600 break-all">➡ {it.originalUrl}</div>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="text-sm px-2 py-1 rounded bg-gray-100">คลิก: {it.clickCount}</span>
                      <span
                        className={
                          'text-sm px-2 py-1 rounded ' +
                          (it.isActive && !expired ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700')
                        }
                        title={expired ? 'หมดอายุแล้ว' : it.isActive ? 'ใช้งานได้' : 'ปิดการใช้งาน'}
                      >
                        {expired ? 'หมดอายุ' : it.isActive ? 'Active' : 'Inactive'}
                      </span>
                    </div>
                  </div>

                  <div className="mt-3 grid grid-cols-1 md:grid-cols-3 gap-3">
                    <div>
                      <label className="block text-sm mb-1">วันหมดอายุ</label>
                      <input
                        type="datetime-local"
                        className="w-full border rounded px-3 py-2"
                        value={formatDateISO(it.expiresAt)}
                        onChange={e => updateExpiry(it.id, e.target.value)}
                      />
                      <button
                        className="mt-1 text-xs text-gray-600 hover:underline"
                        onClick={() => updateExpiry(it.id, '')}
                      >
                        ล้างวันหมดอายุ
                      </button>
                    </div>
                    <div className="flex items-end gap-2">
                      <button
                        className={
                          'px-3 py-2 rounded border ' +
                          (it.isActive ? 'bg-yellow-50 hover:bg-yellow-100' : 'bg-green-50 hover:bg-green-100')
                        }
                        onClick={() => toggleActive(it.id, it.isActive)}
                      >
                        {it.isActive ? 'ปิดการใช้งาน' : 'เปิดการใช้งาน'}
                      </button>
                      <button
                        className="px-3 py-2 rounded border bg-red-50 hover:bg-red-100 text-red-700"
                        onClick={() => remove(it.id)}
                      >
                        ลบ
                      </button>
                    </div>
                    <div className="text-sm text-gray-600">
                      สร้างเมื่อ: {new Date(it.createdAt).toLocaleString('th-TH')}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}