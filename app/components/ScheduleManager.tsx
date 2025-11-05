'use client';

import { useState, useEffect } from 'react';

interface ScheduleManagerProps {
  isConnected: boolean;
}

interface ScheduledPost {
  id: string;
  prompt: string;
  caption: string;
  scheduledTime: string;
  status: 'pending' | 'completed' | 'failed';
}

export default function ScheduleManager({ isConnected }: ScheduleManagerProps) {
  const [prompt, setPrompt] = useState('');
  const [caption, setCaption] = useState('');
  const [scheduledTime, setScheduledTime] = useState('');
  const [scheduledPosts, setScheduledPosts] = useState<ScheduledPost[]>([]);
  const [isScheduling, setIsScheduling] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  useEffect(() => {
    loadScheduledPosts();
  }, []);

  const loadScheduledPosts = async () => {
    try {
      const response = await fetch('/api/scheduled-posts');
      if (response.ok) {
        const data = await response.json();
        setScheduledPosts(data.posts || []);
      }
    } catch (err) {
      console.error('Failed to load scheduled posts:', err);
    }
  };

  const handleSchedule = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!isConnected) {
      setError('Please connect your Instagram account first');
      return;
    }

    setIsScheduling(true);
    setError(null);
    setSuccess(null);

    try {
      const response = await fetch('/api/schedule-post', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          prompt,
          caption,
          scheduledTime: new Date(scheduledTime).toISOString(),
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to schedule post');
      }

      setSuccess('Post scheduled successfully!');
      setPrompt('');
      setCaption('');
      setScheduledTime('');
      loadScheduledPosts();
    } catch (err: any) {
      setError(err.message || 'Failed to schedule post');
    } finally {
      setIsScheduling(false);
    }
  };

  const handleDelete = async (postId: string) => {
    try {
      await fetch(`/api/scheduled-posts/${postId}`, { method: 'DELETE' });
      loadScheduledPosts();
    } catch (err) {
      console.error('Failed to delete post:', err);
    }
  };

  const getMinDateTime = () => {
    const now = new Date();
    now.setMinutes(now.getMinutes() + 5);
    return now.toISOString().slice(0, 16);
  };

  return (
    <div className="space-y-6">
      <div className="bg-white/10 rounded-lg p-6 border border-white/20">
        <h3 className="text-white font-bold text-xl mb-4">Schedule New Post</h3>

        <form onSubmit={handleSchedule} className="space-y-4">
          <div>
            <label className="block text-white font-semibold mb-2">
              Video Prompt
            </label>
            <textarea
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              placeholder="Describe the video to generate..."
              className="w-full px-4 py-3 rounded-lg bg-white/20 text-white placeholder-purple-200 border border-white/30 focus:outline-none focus:ring-2 focus:ring-purple-300 min-h-[80px]"
              required
            />
          </div>

          <div>
            <label className="block text-white font-semibold mb-2">
              Caption
            </label>
            <textarea
              value={caption}
              onChange={(e) => setCaption(e.target.value)}
              placeholder="Instagram caption..."
              className="w-full px-4 py-3 rounded-lg bg-white/20 text-white placeholder-purple-200 border border-white/30 focus:outline-none focus:ring-2 focus:ring-purple-300"
            />
          </div>

          <div>
            <label className="block text-white font-semibold mb-2">
              Schedule Time
            </label>
            <input
              type="datetime-local"
              value={scheduledTime}
              onChange={(e) => setScheduledTime(e.target.value)}
              min={getMinDateTime()}
              className="w-full px-4 py-3 rounded-lg bg-white/20 text-white border border-white/30 focus:outline-none focus:ring-2 focus:ring-purple-300"
              required
            />
          </div>

          {error && (
            <div className="bg-red-500/20 border border-red-500 text-white px-4 py-3 rounded-lg">
              {error}
            </div>
          )}

          {success && (
            <div className="bg-green-500/20 border border-green-500 text-white px-4 py-3 rounded-lg">
              {success}
            </div>
          )}

          <button
            type="submit"
            disabled={!isConnected || isScheduling}
            className="w-full bg-gradient-to-r from-purple-600 to-pink-600 text-white font-bold py-3 px-6 rounded-lg hover:from-purple-700 hover:to-pink-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-lg"
          >
            {isScheduling ? 'Scheduling...' : 'Schedule Post'}
          </button>
        </form>
      </div>

      <div className="bg-white/10 rounded-lg p-6 border border-white/20">
        <h3 className="text-white font-bold text-xl mb-4">Scheduled Posts</h3>

        {scheduledPosts.length === 0 ? (
          <p className="text-purple-200 text-center py-8">
            No scheduled posts yet. Create one above!
          </p>
        ) : (
          <div className="space-y-3">
            {scheduledPosts.map((post) => (
              <div
                key={post.id}
                className="bg-white/10 rounded-lg p-4 flex items-start justify-between border border-white/20"
              >
                <div className="flex-1">
                  <p className="text-white font-semibold mb-1">{post.prompt}</p>
                  <p className="text-purple-200 text-sm mb-2">{post.caption}</p>
                  <div className="flex items-center gap-4 text-sm">
                    <span className="text-purple-300">
                      {new Date(post.scheduledTime).toLocaleString()}
                    </span>
                    <span
                      className={`px-2 py-1 rounded ${
                        post.status === 'completed'
                          ? 'bg-green-500/20 text-green-300'
                          : post.status === 'failed'
                          ? 'bg-red-500/20 text-red-300'
                          : 'bg-yellow-500/20 text-yellow-300'
                      }`}
                    >
                      {post.status}
                    </span>
                  </div>
                </div>
                {post.status === 'pending' && (
                  <button
                    onClick={() => handleDelete(post.id)}
                    className="ml-4 px-3 py-1 bg-red-500/80 hover:bg-red-600 text-white rounded transition-all text-sm"
                  >
                    Delete
                  </button>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
