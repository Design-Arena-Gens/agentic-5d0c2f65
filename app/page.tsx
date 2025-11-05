'use client';

import { useState } from 'react';
import VideoGenerator from './components/VideoGenerator';
import InstagramConnector from './components/InstagramConnector';
import ScheduleManager from './components/ScheduleManager';

export default function Home() {
  const [activeTab, setActiveTab] = useState<'generate' | 'schedule'>('generate');
  const [isConnected, setIsConnected] = useState(false);

  return (
    <main className="min-h-screen bg-gradient-to-br from-purple-900 via-pink-800 to-orange-700 p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        <header className="text-center mb-8">
          <h1 className="text-4xl md:text-6xl font-bold text-white mb-2 drop-shadow-lg">
            Instagram AI Video Maker
          </h1>
          <p className="text-lg text-purple-100">
            Generate AI videos and auto-post to your Instagram
          </p>
        </header>

        <div className="mb-6">
          <InstagramConnector onConnectionChange={setIsConnected} />
        </div>

        <div className="bg-white/10 backdrop-blur-lg rounded-lg shadow-2xl border border-white/20 overflow-hidden">
          <div className="flex border-b border-white/20">
            <button
              onClick={() => setActiveTab('generate')}
              className={`flex-1 px-6 py-4 font-semibold transition-all ${
                activeTab === 'generate'
                  ? 'bg-white/20 text-white'
                  : 'text-purple-200 hover:bg-white/10'
              }`}
            >
              Generate Video
            </button>
            <button
              onClick={() => setActiveTab('schedule')}
              className={`flex-1 px-6 py-4 font-semibold transition-all ${
                activeTab === 'schedule'
                  ? 'bg-white/20 text-white'
                  : 'text-purple-200 hover:bg-white/10'
              }`}
            >
              Schedule Posts
            </button>
          </div>

          <div className="p-6">
            {activeTab === 'generate' ? (
              <VideoGenerator isConnected={isConnected} />
            ) : (
              <ScheduleManager isConnected={isConnected} />
            )}
          </div>
        </div>

        <footer className="mt-8 text-center text-purple-200 text-sm">
          <p>Built with Next.js, AI Video Generation, and Instagram API</p>
        </footer>
      </div>
    </main>
  );
}
