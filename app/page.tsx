'use client';

import { useState } from 'react';
import Sidebar from '@/components/Sidebar';
import Dashboard from '@/components/Dashboard';
import NewRequest from '@/components/NewRequest';
import ImageGenerator from '@/components/ImageGenerator';
import History from '@/components/History';
import KnowledgeBase from '@/components/KnowledgeBase';
import ABTest from '@/components/ABTest';
import Tracking from '@/components/Tracking';
import Settings from '@/components/Settings';

export default function App() {
  const [activeTab, setActiveTab] = useState('new_request');

  return (
    <div className="flex h-screen bg-slate-50 font-sans overflow-hidden">
      <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />
      
      <main className="flex-1 overflow-y-auto">
        {activeTab === 'dashboard' && <Dashboard />}
        {activeTab === 'new_request' && <NewRequest />}
        {activeTab === 'image_generator' && <ImageGenerator />}
        {activeTab === 'history' && <History />}
        {activeTab === 'knowledge_base' && <KnowledgeBase />}
        {activeTab === 'ab_test' && <ABTest />}
        {activeTab === 'tracking' && <Tracking />}
        {activeTab === 'settings' && <Settings />}
      </main>
    </div>
  );
}
