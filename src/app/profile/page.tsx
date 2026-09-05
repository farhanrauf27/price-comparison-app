'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { User, History, LogOut } from 'lucide-react';

export default function ProfilePage() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);
  const [message, setMessage] = useState<{ text: string; type: 'success' | 'error' } | null>(null);
  const router = useRouter();

  // Fetch logged in user credentials when the view mounts
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const res = await fetch('/api/auth/me');
        const data = await res.json();
        
        if (res.ok && data.user) {
          setName(data.user.name);
          setEmail(data.user.email);
        } else {
          router.push('/login');
        }
      } catch (err) {
        console.error('Failed fetching credentials', err);
      } finally {
        setFetching(false);
      }
    };
    
    fetchUserData();
  }, [router]);

  const handleLogout = async () => {
    try {
      const res = await fetch('/api/auth/logout', { method: 'POST' });
      if (res.ok) {
        router.push('/login');
        router.refresh();
      }
    } catch (err) {
      console.error('Logout script execution failure', err);
    }
  };

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage(null);

    try {
      // Typo corrected here: points clean to /api/auth/profile
      const res = await fetch('/api/auth/profile', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name }),
      });
      const data = await res.json();

      if (!res.ok) throw new Error(data.message || 'Failed to apply updates');

      setMessage({ text: 'Your profile has been updated successfully!', type: 'success' });
    } catch (err: any) {
      setMessage({ text: err.message, type: 'error' });
    } finally {
      setLoading(false);
    }
  };

  if (fetching) {
    return (
      <main className="mx-auto max-w-4xl px-4 py-12 text-center text-slate-500 font-medium animate-pulse">
        Fetching profile configurations...
      </main>
    );
  }

  return (
    <main className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 py-12">
      <h1 className="text-3xl font-bold tracking-tight text-slate-900">Account Settings</h1>
      
      <div className="mt-8 grid grid-cols-1 gap-8 md:grid-cols-3">
        <div className="md:col-span-1 space-y-2">
          <button className="w-full text-left px-4 py-2.5 rounded-xl bg-indigo-50 text-indigo-700 font-semibold text-sm flex items-center gap-2">
            <User size={16} /> Personal Info
          </button>
          <button className="w-full text-left px-4 py-2.5 rounded-xl text-slate-600 hover:bg-slate-50 font-medium text-sm flex items-center gap-2">
            <History size={16} /> Search History
          </button>
          <button 
            onClick={handleLogout}
            className="w-full text-left px-4 py-2.5 rounded-xl text-rose-600 hover:bg-rose-50 font-semibold text-sm flex items-center gap-2 border border-transparent hover:border-rose-100"
          >
            <LogOut size={16} /> Close Session (Logout)
          </button>
        </div>

        <div className="md:col-span-2 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm space-y-6">
          <div>
            <h3 className="text-lg font-bold text-slate-900 border-b border-slate-100 pb-3">Profile Credentials</h3>
          </div>

          {message && (
            <div className={`p-3 rounded-lg text-sm border ${
              message.type === 'success' ? 'bg-emerald-50 border-emerald-100 text-emerald-700' : 'bg-rose-50 border-rose-100 text-rose-700'
            }`}>
              {message.text}
            </div>
          )}

          <form onSubmit={handleUpdateProfile} className="space-y-4">
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div>
                <label className="block text-xs font-semibold uppercase text-slate-500">Full Name</label>
                <input 
                  type="text" 
                  value={name} 
                  onChange={(e) => setName(e.target.value)}
                  className="mt-1 w-full rounded-xl border border-slate-200 px-4 py-2.5 text-sm focus:outline-none focus:border-indigo-500" 
                  required
                />
              </div>
              <div>
                <label className="block text-xs font-semibold uppercase text-slate-500">Email Address (Read-Only)</label>
                <input 
                  type="email" 
                  value={email}
                  className="mt-1 w-full rounded-xl border border-slate-100 bg-slate-50 px-4 py-2.5 text-sm text-slate-400 cursor-not-allowed" 
                  disabled 
                />
              </div>
            </div>
            <button 
              type="submit"
              disabled={loading}
              className="rounded-xl bg-indigo-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-indigo-700 shadow-sm ml-auto block disabled:opacity-50"
            >
              {loading ? 'Saving Changes...' : 'Save Modifications'}
            </button>
          </form>
        </div>
      </div>
    </main>
  );
}