'use client';

import { useState } from 'react';
import { Image as ImageIcon, Loader2, Send, Download } from 'lucide-react';
import { GoogleGenAI } from '@google/genai';

export default function ImageGenerator() {
  const [prompt, setPrompt] = useState('');
  const [status, setStatus] = useState<'idle' | 'generating' | 'done' | 'error'>('idle');
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const handleGenerate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!prompt.trim()) return;
    
    setStatus('generating');
    setErrorMsg(null);
    setImageUrl(null);

    try {
      const response = await fetch('/api/generate-image', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ prompt }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to generate image');
      }

      const data = await response.json();
      if (data.image) {
        setImageUrl(data.image);
        setStatus('done');
      } else {
        throw new Error('No image returned');
      }
    } catch (error: any) {
      console.error('Error generating image:', error);
      setErrorMsg(error.message || 'An unexpected error occurred');
      setStatus('error');
    }
  };

  const handleDownload = () => {
    if (!imageUrl) return;
    const a = document.createElement('a');
    a.href = imageUrl;
    a.download = `generated-image-${Date.now()}.png`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  return (
    <div className="flex-1 overflow-y-auto bg-slate-50">
      <div className="max-w-5xl mx-auto p-8">
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-slate-900 tracking-tight">AI 配图生成</h2>
          <p className="text-sm text-slate-500 mt-1">输入描述，使用 Gemini 3.1 Flash Image Preview 模型自动生成活动配图。</p>
        </div>

        {/* Input Section */}
        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6 mb-8">
          <form onSubmit={handleGenerate}>
            <div className="relative">
              <textarea
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                placeholder="描述你想要的活动配图，例如：draw a tree, 万圣节主题的南瓜灯，神秘的紫色背景..."
                className="w-full h-32 p-4 pb-12 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 resize-none text-sm"
              />
              <div className="absolute bottom-3 right-3">
                <button 
                  type="submit" 
                  disabled={!prompt.trim() || status === 'generating'}
                  className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white text-sm font-medium rounded-lg hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  {status === 'generating' ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
                  {status === 'generating' ? '生成中...' : '生成配图'}
                </button>
              </div>
            </div>
          </form>
        </div>

        {/* Results Section */}
        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6 min-h-[400px] flex flex-col items-center justify-center relative">
          {status === 'idle' && (
            <div className="text-center text-slate-400">
              <ImageIcon className="w-12 h-12 mx-auto mb-3 opacity-50" />
              <p className="text-sm">生成的图片将显示在这里</p>
            </div>
          )}

          {status === 'generating' && (
            <div className="text-center text-indigo-500">
              <Loader2 className="w-12 h-12 mx-auto mb-3 animate-spin" />
              <p className="text-sm font-medium">AI 正在努力作画中，请稍候...</p>
            </div>
          )}

          {status === 'error' && (
            <div className="text-center text-red-500 max-w-md">
              <div className="w-12 h-12 rounded-full bg-red-100 flex items-center justify-center mx-auto mb-3">
                <span className="text-2xl">⚠️</span>
              </div>
              <p className="text-sm font-medium mb-2">生成失败</p>
              <p className="text-xs text-red-400">{errorMsg}</p>
            </div>
          )}

          {status === 'done' && imageUrl && (
            <div className="w-full h-full flex flex-col items-center animate-in fade-in zoom-in duration-500">
              <div className="relative w-full max-w-2xl aspect-square rounded-xl overflow-hidden border border-slate-200 shadow-sm mb-4">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img 
                  src={imageUrl} 
                  alt="Generated" 
                  className="w-full h-full object-contain bg-slate-100"
                />
              </div>
              <button 
                onClick={handleDownload}
                className="flex items-center gap-2 px-4 py-2 bg-white border border-slate-200 text-slate-700 text-sm font-medium rounded-lg hover:bg-slate-50 transition-colors shadow-sm"
              >
                <Download className="w-4 h-4" />
                下载图片
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
