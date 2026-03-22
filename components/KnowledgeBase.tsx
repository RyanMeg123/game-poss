import { useState } from 'react';
import { Search, Plus, Filter, MoreHorizontal, X } from 'lucide-react';

export default function KnowledgeBase() {
  const [searchQuery, setSearchQuery] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [entries, setEntries] = useState([
    { id: 1, title: '万圣节首充破冰策略', type: '节日策略', status: '已上线', author: '运营专家A', date: '2025-10-15' },
    { id: 2, title: '连续签到活动疲劳应对', type: '经验库', status: '待审核', author: '运营专员B', date: '2025-09-22' },
    { id: 3, title: '大R用户流失召回礼包', type: '用户分层', status: '已上线', author: '商业化组', date: '2025-08-10' },
    { id: 4, title: '竞品周年庆防守打法', type: '竞品动态', status: '已上线', author: '市场部', date: '2025-07-01' },
    { id: 5, title: '奖励削减舆情应对模板', type: '情绪预警', status: '已上线', author: '社区运营', date: '2025-06-18' },
  ]);

  const [newEntry, setNewEntry] = useState({ title: '', type: '经验库' });

  const filteredEntries = entries.filter(entry => 
    entry.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    entry.type.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleAddEntry = () => {
    if (newEntry.title.trim()) {
      const date = new Date().toISOString().split('T')[0];
      setEntries([
        { 
          id: entries.length + 1, 
          title: newEntry.title, 
          type: newEntry.type, 
          status: '待审核', 
          author: '当前用户', 
          date 
        },
        ...entries
      ]);
      setIsModalOpen(false);
      setNewEntry({ title: '', type: '经验库' });
    }
  };

  return (
    <div className="p-8 max-w-7xl mx-auto">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h2 className="text-2xl font-bold text-slate-900 tracking-tight">知识库管理</h2>
          <p className="text-sm text-slate-500 mt-1">管理活动案例、经验策略、节日打法与舆情模板</p>
        </div>
        <button 
          onClick={() => setIsModalOpen(true)}
          className="flex items-center gap-2 bg-indigo-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-indigo-700 transition-colors"
        >
          <Plus className="w-4 h-4" />
          录入新条目
        </button>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
        <div className="p-4 border-b border-slate-200 flex items-center justify-between bg-slate-50/50">
          <div className="relative w-72">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input 
              type="text" 
              placeholder="搜索知识库条目..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-4 py-2 text-sm border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
            />
          </div>
          <button className="flex items-center gap-2 px-3 py-2 text-sm font-medium text-slate-600 bg-white border border-slate-200 rounded-lg hover:bg-slate-50">
            <Filter className="w-4 h-4" />
            筛选
          </button>
        </div>
        
        <table className="w-full text-left text-sm">
          <thead className="bg-slate-50 text-slate-500 font-medium border-b border-slate-200">
            <tr>
              <th className="px-6 py-4">条目标题</th>
              <th className="px-6 py-4">分类</th>
              <th className="px-6 py-4">状态</th>
              <th className="px-6 py-4">贡献者</th>
              <th className="px-6 py-4">更新时间</th>
              <th className="px-6 py-4 text-right">操作</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {filteredEntries.map((entry) => (
              <tr key={entry.id} className="hover:bg-slate-50/50 transition-colors">
                <td className="px-6 py-4 font-medium text-slate-900">{entry.title}</td>
                <td className="px-6 py-4 text-slate-600">
                  <span className="px-2 py-1 bg-slate-100 rounded text-xs">{entry.type}</span>
                </td>
                <td className="px-6 py-4">
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                    entry.status === '已上线' ? 'bg-emerald-50 text-emerald-700' : 'bg-amber-50 text-amber-700'
                  }`}>
                    {entry.status}
                  </span>
                </td>
                <td className="px-6 py-4 text-slate-600">{entry.author}</td>
                <td className="px-6 py-4 text-slate-500">{entry.date}</td>
                <td className="px-6 py-4 text-right">
                  <button className="p-1 text-slate-400 hover:text-indigo-600 rounded">
                    <MoreHorizontal className="w-4 h-4" />
                  </button>
                </td>
              </tr>
            ))}
            {filteredEntries.length === 0 && (
              <tr>
                <td colSpan={6} className="px-6 py-8 text-center text-slate-500">
                  未找到匹配的条目
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-slate-900/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-md overflow-hidden">
            <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between">
              <h3 className="text-lg font-bold text-slate-900">录入新条目</h3>
              <button 
                onClick={() => setIsModalOpen(false)}
                className="text-slate-400 hover:text-slate-600 p-1 rounded-md hover:bg-slate-100"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">条目标题</label>
                <input 
                  type="text" 
                  value={newEntry.title}
                  onChange={(e) => setNewEntry({...newEntry, title: e.target.value})}
                  placeholder="例如：春节回流活动复盘"
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-sm"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">分类</label>
                <select 
                  value={newEntry.type}
                  onChange={(e) => setNewEntry({...newEntry, type: e.target.value})}
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-sm"
                >
                  <option value="经验库">经验库</option>
                  <option value="节日策略">节日策略</option>
                  <option value="用户分层">用户分层</option>
                  <option value="竞品动态">竞品动态</option>
                  <option value="情绪预警">情绪预警</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">内容详情</label>
                <textarea 
                  rows={4}
                  placeholder="输入条目详细内容..."
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-sm resize-none"
                ></textarea>
              </div>
            </div>
            <div className="px-6 py-4 bg-slate-50 border-t border-slate-100 flex justify-end gap-3">
              <button 
                onClick={() => setIsModalOpen(false)}
                className="px-4 py-2 text-sm font-medium text-slate-600 hover:bg-slate-200 bg-slate-100 rounded-lg transition-colors"
              >
                取消
              </button>
              <button 
                onClick={handleAddEntry}
                className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg transition-colors"
              >
                保存并提交
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
