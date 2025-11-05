'use client';

import { useState } from 'react';

interface VideoGeneratorProps {
  isConnected: boolean;
}

export default function VideoGenerator({ isConnected }: VideoGeneratorProps) {
  const [prompt, setPrompt] = useState('');
  const [style, setStyle] = useState('cinematic');
  const [duration, setDuration] = useState('3');
  const [caption, setCaption] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [isPosting, setIsPosting] = useState(false);
  const [generatedVideo, setGeneratedVideo] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const handleGenerate = async () => {
    if (!prompt.trim()) {
      setError('Please enter a video prompt');
      return;
    }

    setIsGenerating(true);
    setError(null);
    setSuccess(null);
    setGeneratedVideo(null);

    try {
      const response = await fetch('/api/generate-video', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt, style, duration }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to generate video');
      }

      setGeneratedVideo(data.videoUrl);
      setSuccess('Video generated successfully!');
    } catch (err: any) {
      setError(err.message || 'Failed to generate video');
    } finally {
      setIsGenerating(false);
    }
  };

  const handlePost = async () => {
    if (!generatedVideo) return;

    setIsPosting(true);
    setError(null);
    setSuccess(null);

    try {
      const response = await fetch('/api/post-to-instagram', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ videoUrl: generatedVideo, caption }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to post to Instagram');
      }

      setSuccess('Successfully posted to Instagram!');
    } catch (err: any) {
      setError(err.message || 'Failed to post to Instagram');
    } finally {
      setIsPosting(false);
    }
  };

  const handleGenerateAndPost = async () => {
    await handleGenerate();
    if (generatedVideo) {
      setTimeout(() => handlePost(), 1000);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <label className="block text-white font-semibold mb-2">
          Video Prompt
        </label>
        <textarea
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          placeholder="Describe the video you want to create... (e.g., 'A serene sunset over mountains with birds flying')"
          className="w-full px-4 py-3 rounded-lg bg-white/20 text-white placeholder-purple-200 border border-white/30 focus:outline-none focus:ring-2 focus:ring-purple-300 min-h-[100px]"
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-white font-semibold mb-2">
            Video Style
          </label>
          <select
            value={style}
            onChange={(e) => setStyle(e.target.value)}
            className="w-full px-4 py-3 rounded-lg bg-white/20 text-white border border-white/30 focus:outline-none focus:ring-2 focus:ring-purple-300"
          >
            <option value="cinematic">Cinematic</option>
            <option value="anime">Anime</option>
            <option value="3d">3D Animation</option>
            <option value="realistic">Realistic</option>
            <option value="abstract">Abstract</option>
          </select>
        </div>

        <div>
          <label className="block text-white font-semibold mb-2">
            Duration (seconds)
          </label>
          <select
            value={duration}
            onChange={(e) => setDuration(e.target.value)}
            className="w-full px-4 py-3 rounded-lg bg-white/20 text-white border border-white/30 focus:outline-none focus:ring-2 focus:ring-purple-300"
          >
            <option value="3">3 seconds</option>
            <option value="5">5 seconds</option>
            <option value="10">10 seconds</option>
          </select>
        </div>
      </div>

      <div>
        <label className="block text-white font-semibold mb-2">
          Instagram Caption
        </label>
        <textarea
          value={caption}
          onChange={(e) => setCaption(e.target.value)}
          placeholder="Write a caption for your Instagram post..."
          className="w-full px-4 py-3 rounded-lg bg-white/20 text-white placeholder-purple-200 border border-white/30 focus:outline-none focus:ring-2 focus:ring-purple-300"
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

      {generatedVideo && (
        <div className="bg-white/10 rounded-lg p-4">
          <h3 className="text-white font-semibold mb-3">Generated Video:</h3>
          <video
            src={generatedVideo}
            controls
            className="w-full rounded-lg shadow-lg"
          />
        </div>
      )}

      <div className="flex gap-4">
        <button
          onClick={handleGenerate}
          disabled={isGenerating || !prompt.trim()}
          className="flex-1 bg-gradient-to-r from-purple-600 to-pink-600 text-white font-bold py-3 px-6 rounded-lg hover:from-purple-700 hover:to-pink-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-lg"
        >
          {isGenerating ? 'Generating...' : 'Generate Video'}
        </button>

        {generatedVideo && (
          <button
            onClick={handlePost}
            disabled={!isConnected || isPosting}
            className="flex-1 bg-gradient-to-r from-orange-600 to-red-600 text-white font-bold py-3 px-6 rounded-lg hover:from-orange-700 hover:to-red-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-lg"
          >
            {isPosting ? 'Posting...' : 'Post to Instagram'}
          </button>
        )}
      </div>

      {isConnected && !generatedVideo && (
        <button
          onClick={handleGenerateAndPost}
          disabled={isGenerating || !prompt.trim()}
          className="w-full bg-gradient-to-r from-green-600 to-teal-600 text-white font-bold py-3 px-6 rounded-lg hover:from-green-700 hover:to-teal-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-lg"
        >
          Generate & Auto-Post
        </button>
      )}
    </div>
  );
}
