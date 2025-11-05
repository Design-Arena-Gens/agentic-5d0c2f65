'use client';

import { useState, useEffect } from 'react';

interface InstagramConnectorProps {
  onConnectionChange: (connected: boolean) => void;
}

export default function InstagramConnector({ onConnectionChange }: InstagramConnectorProps) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [isConnecting, setIsConnecting] = useState(false);
  const [isConnected, setIsConnected] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showForm, setShowForm] = useState(false);

  useEffect(() => {
    checkConnection();
  }, []);

  const checkConnection = async () => {
    try {
      const response = await fetch('/api/check-instagram-connection');
      const data = await response.json();
      setIsConnected(data.connected);
      onConnectionChange(data.connected);
    } catch (err) {
      setIsConnected(false);
      onConnectionChange(false);
    }
  };

  const handleConnect = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsConnecting(true);
    setError(null);

    try {
      const response = await fetch('/api/connect-instagram', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to connect');
      }

      setIsConnected(true);
      onConnectionChange(true);
      setShowForm(false);
      setUsername('');
      setPassword('');
    } catch (err: any) {
      setError(err.message || 'Failed to connect to Instagram');
    } finally {
      setIsConnecting(false);
    }
  };

  const handleDisconnect = async () => {
    try {
      await fetch('/api/disconnect-instagram', { method: 'POST' });
      setIsConnected(false);
      onConnectionChange(false);
    } catch (err) {
      console.error('Failed to disconnect:', err);
    }
  };

  if (isConnected) {
    return (
      <div className="bg-green-500/20 border border-green-500 rounded-lg p-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
          <span className="text-white font-semibold">Connected to Instagram</span>
        </div>
        <button
          onClick={handleDisconnect}
          className="px-4 py-2 bg-red-500/80 hover:bg-red-600 text-white rounded-lg transition-all"
        >
          Disconnect
        </button>
      </div>
    );
  }

  if (!showForm) {
    return (
      <div className="bg-yellow-500/20 border border-yellow-500 rounded-lg p-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
          <span className="text-white font-semibold">Not connected to Instagram</span>
        </div>
        <button
          onClick={() => setShowForm(true)}
          className="px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg transition-all"
        >
          Connect Account
        </button>
      </div>
    );
  }

  return (
    <div className="bg-white/10 backdrop-blur-lg rounded-lg p-6 border border-white/20">
      <h3 className="text-white font-bold text-xl mb-4">Connect Instagram Account</h3>

      <form onSubmit={handleConnect} className="space-y-4">
        <div>
          <label className="block text-white font-semibold mb-2">Username</label>
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            placeholder="your_instagram_username"
            className="w-full px-4 py-3 rounded-lg bg-white/20 text-white placeholder-purple-200 border border-white/30 focus:outline-none focus:ring-2 focus:ring-purple-300"
            required
          />
        </div>

        <div>
          <label className="block text-white font-semibold mb-2">Password</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="••••••••"
            className="w-full px-4 py-3 rounded-lg bg-white/20 text-white placeholder-purple-200 border border-white/30 focus:outline-none focus:ring-2 focus:ring-purple-300"
            required
          />
        </div>

        {error && (
          <div className="bg-red-500/20 border border-red-500 text-white px-4 py-3 rounded-lg">
            {error}
          </div>
        )}

        <div className="flex gap-3">
          <button
            type="submit"
            disabled={isConnecting}
            className="flex-1 bg-gradient-to-r from-purple-600 to-pink-600 text-white font-bold py-3 px-6 rounded-lg hover:from-purple-700 hover:to-pink-700 disabled:opacity-50 transition-all"
          >
            {isConnecting ? 'Connecting...' : 'Connect'}
          </button>
          <button
            type="button"
            onClick={() => setShowForm(false)}
            className="px-6 py-3 bg-white/20 text-white rounded-lg hover:bg-white/30 transition-all"
          >
            Cancel
          </button>
        </div>

        <p className="text-purple-200 text-sm">
          Note: Your credentials are securely stored and never shared.
        </p>
      </form>
    </div>
  );
}
