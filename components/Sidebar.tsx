import { 
  LayoutDashboard, 
  MessageSquarePlus, 
  History, 
  Library, 
  SplitSquareHorizontal, 
  Activity, 
  Settings,
  Image as ImageIcon
} from 'lucide-react';

interface SidebarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

export default function Sidebar({ activeTab, setActiveTab }: SidebarProps) {
  const navItems = [
    { id: 'dashboard', label: '数据看板', icon: LayoutDashboard },
    { id: 'new_request', label: '需求提交', icon: MessageSquarePlus },
    { id: 'image_generator', label: 'AI 配图生成', icon: ImageIcon },
    { id: 'history', label: '历史记录', icon: History },
    { id: 'knowledge_base', label: '知识库管理', icon: Library },
    { id: 'ab_test', label: 'A/B 测试建议', icon: SplitSquareHorizontal },
    { id: 'tracking', label: '运营效果追踪', icon: Activity },
    { id: 'settings', label: '系统设置', icon: Settings },
  ];

  return (
    <div className="w-64 bg-slate-900 text-slate-300 h-screen flex flex-col border-r border-slate-800">
      <div className="p-6 border-b border-slate-800">
        <h1 className="text-xl font-bold text-white tracking-tight">GameOps</h1>
        <p className="text-xs text-slate-500 mt-1">Insight & Recommendation</p>
      </div>
      <nav className="flex-1 py-4">
        <ul className="space-y-1 px-3">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <li key={item.id}>
                <button
                  onClick={() => setActiveTab(item.id)}
                  className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                    isActive 
                      ? 'bg-indigo-600 text-white shadow-sm' 
                      : 'hover:bg-slate-800 hover:text-white'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  {item.label}
                </button>
              </li>
            );
          })}
        </ul>
      </nav>
      <div className="p-4 border-t border-slate-800">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-indigo-500 flex items-center justify-center text-white font-bold text-xs">
            OP
          </div>
          <div>
            <p className="text-sm font-medium text-white">运营专员</p>
            <p className="text-xs text-slate-500">在线</p>
          </div>
        </div>
      </div>
    </div>
  );
}
