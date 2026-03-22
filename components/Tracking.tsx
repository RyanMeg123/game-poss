import { useState } from 'react';
import { Clock, CheckCircle2, AlertCircle, X, FileText, Upload } from 'lucide-react';

export default function Tracking() {
  const [activeModal, setActiveModal] = useState<'report' | 'backfill' | null>(null);
  const [selectedTask, setSelectedTask] = useState<any>(null);
  const [backfillData, setBackfillData] = useState('');

  const tasks = [
    { id: 1, title: '万圣节首充破冰策略', metric: '付费率', target: '+15%', current: '+18.2%', status: '达标', days: '14天', date: '2025-10-15' },
    { id: 2, title: '轻量级节日包装活动', metric: 'DAU', target: '持平', current: '-2.1%', status: '未达标', days: '7天', date: '2025-10-20' },
    { id: 3, title: '大R流失召回礼包', metric: '召回率', target: '5%', current: '待回填', status: '追踪中', days: '3天', date: '2025-10-28' },
  ];

  const handleOpenModal = (type: 'report' | 'backfill', task: any) => {
    setSelectedTask(task);
    setActiveModal(type);
    setBackfillData('');
  };

  const handleCloseModal = () => {
    setActiveModal(null);
    setSelectedTask(null);
  };

  const handleSubmitBackfill = () => {
    // In a real app, this would update the backend
    console.log(`Backfilling data for task ${selectedTask.id}: ${backfillData}`);
    handleCloseModal();
  };

  return (
    <div className="p-8 max-w-7xl mx-auto">
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-slate-900 tracking-tight">运营效果追踪</h2>
        <p className="text-sm text-slate-500 mt-1">追踪已执行策略的实际业务效果，形成闭环数据回流</p>
      </div>

      <div className="grid gap-6">
        {tasks.map((task) => (
          <div key={task.id} className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6 flex items-center justify-between">
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-2">
                <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-md text-xs font-medium border ${
                  task.status === '达标' ? 'bg-emerald-50 text-emerald-700 border-emerald-100' :
                  task.status === '未达标' ? 'bg-red-50 text-red-700 border-red-100' :
                  'bg-blue-50 text-blue-700 border-blue-100'
                }`}>
                  {task.status === '达标' ? <CheckCircle2 className="w-3.5 h-3.5" /> :
                   task.status === '未达标' ? <AlertCircle className="w-3.5 h-3.5" /> :
                   <Clock className="w-3.5 h-3.5" />}
                  {task.status}
                </span>
                <h3 className="text-base font-bold text-slate-900">{task.title}</h3>
              </div>
              <div className="flex items-center gap-6 text-sm text-slate-600">
                <p>追踪指标: <span className="font-medium text-slate-900">{task.metric}</span></p>
                <p>预期目标: <span className="font-medium text-slate-900">{task.target}</span></p>
                <p>实际结果: <span className={`font-bold ${task.status === '达标' ? 'text-emerald-600' : task.status === '未达标' ? 'text-red-600' : 'text-slate-400'}`}>{task.current}</span></p>
              </div>
            </div>
            
            <div className="flex flex-col items-end gap-3 border-l border-slate-100 pl-6">
              <div className="text-right">
                <p className="text-xs text-slate-500 mb-1">追踪周期</p>
                <p className="text-sm font-bold text-slate-900">{task.days}</p>
              </div>
              {task.status === '追踪中' ? (
                <button 
                  onClick={() => handleOpenModal('backfill', task)}
                  className="px-4 py-2 bg-indigo-600 text-white text-sm font-medium rounded-lg hover:bg-indigo-700 transition-colors"
                >
                  回填数据
                </button>
              ) : (
                <button 
                  onClick={() => handleOpenModal('report', task)}
                  className="px-4 py-2 bg-slate-100 text-slate-600 text-sm font-medium rounded-lg hover:bg-slate-200 transition-colors"
                >
                  查看报告
                </button>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Report Modal */}
      {activeModal === 'report' && selectedTask && (
        <div className="fixed inset-0 bg-slate-900/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-2xl overflow-hidden">
            <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between">
              <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                <FileText className="w-5 h-5 text-indigo-500" />
                效果分析报告
              </h3>
              <button 
                onClick={handleCloseModal}
                className="text-slate-400 hover:text-slate-600 p-1 rounded-md hover:bg-slate-100"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="p-6">
              <div className="mb-6">
                <h4 className="text-xl font-bold text-slate-900 mb-1">{selectedTask.title}</h4>
                <p className="text-sm text-slate-500">执行日期: {selectedTask.date} | 追踪周期: {selectedTask.days}</p>
              </div>
              
              <div className="grid grid-cols-2 gap-4 mb-6">
                <div className="bg-slate-50 p-4 rounded-xl border border-slate-100">
                  <p className="text-sm text-slate-500 mb-1">预期目标 ({selectedTask.metric})</p>
                  <p className="text-2xl font-bold text-slate-900">{selectedTask.target}</p>
                </div>
                <div className={`p-4 rounded-xl border ${selectedTask.status === '达标' ? 'bg-emerald-50 border-emerald-100' : 'bg-red-50 border-red-100'}`}>
                  <p className={`text-sm mb-1 ${selectedTask.status === '达标' ? 'text-emerald-600' : 'text-red-600'}`}>实际结果</p>
                  <p className={`text-2xl font-bold ${selectedTask.status === '达标' ? 'text-emerald-700' : 'text-red-700'}`}>{selectedTask.current}</p>
                </div>
              </div>

              <div>
                <h5 className="font-semibold text-slate-900 mb-2">AI 归因分析</h5>
                <div className="bg-slate-50 p-4 rounded-xl text-sm text-slate-700 leading-relaxed border border-slate-100">
                  {selectedTask.status === '达标' 
                    ? '本次策略执行效果良好，超额完成目标。主要归因于限时折扣的稀缺性极大地刺激了用户的冲动消费心理，同时晚间高峰期的推送触达了最多的活跃用户。建议将此策略沉淀为标准节日打法。'
                    : '本次活动未能达到预期目标。分析数据发现，虽然活动曝光量正常，但点击参与率偏低。可能原因是活动包装过于轻量，缺乏足够的新鲜感和吸引力，未能有效唤醒用户的参与热情。建议后续活动增加核心奖励的投放。'}
                </div>
              </div>
            </div>
            <div className="px-6 py-4 bg-slate-50 border-t border-slate-100 flex justify-end">
              <button 
                onClick={handleCloseModal}
                className="px-4 py-2 text-sm font-medium text-slate-600 hover:bg-slate-200 bg-slate-100 rounded-lg transition-colors"
              >
                关闭
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Backfill Modal */}
      {activeModal === 'backfill' && selectedTask && (
        <div className="fixed inset-0 bg-slate-900/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-md overflow-hidden">
            <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between">
              <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                <Upload className="w-5 h-5 text-indigo-500" />
                回填数据
              </h3>
              <button 
                onClick={handleCloseModal}
                className="text-slate-400 hover:text-slate-600 p-1 rounded-md hover:bg-slate-100"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="p-6">
              <div className="mb-4">
                <h4 className="font-medium text-slate-900">{selectedTask.title}</h4>
                <p className="text-sm text-slate-500">请录入最新的追踪指标数据</p>
              </div>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">
                    {selectedTask.metric} (目标: {selectedTask.target})
                  </label>
                  <input 
                    type="text" 
                    value={backfillData}
                    onChange={(e) => setBackfillData(e.target.value)}
                    placeholder="例如: 4.2%"
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-sm"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">
                    补充说明 (选填)
                  </label>
                  <textarea 
                    rows={3}
                    placeholder="输入任何需要补充的上下文信息..."
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-sm resize-none"
                  ></textarea>
                </div>
              </div>
            </div>
            <div className="px-6 py-4 bg-slate-50 border-t border-slate-100 flex justify-end gap-3">
              <button 
                onClick={handleCloseModal}
                className="px-4 py-2 text-sm font-medium text-slate-600 hover:bg-slate-200 bg-slate-100 rounded-lg transition-colors"
              >
                取消
              </button>
              <button 
                onClick={handleSubmitBackfill}
                disabled={!backfillData.trim()}
                className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                提交数据
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
