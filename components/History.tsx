import { useState } from 'react';
import { Clock, Search, Filter, ArrowLeft, FileText, CheckCircle2 } from 'lucide-react';

export default function History() {
  const [selectedRecord, setSelectedRecord] = useState<any>(null);

  const records = [
    { 
      id: 1, 
      query: '万圣节活动付费率低', 
      date: '2025-10-25', 
      status: '已生成策略',
      details: {
        analysis: '万圣节活动期间，虽然DAU有小幅上升，但付费转化率相较于去年同期下降了15%。主要原因可能在于活动礼包的吸引力不足，以及缺乏针对大R用户的专属刺激方案。',
        strategy: '建议推出限时折扣闪促，并在晚间高峰期开启。同时，增加累计充值阶梯奖励，平缓刺激付费。',
        execution: '已采纳并执行限时折扣闪促方案。'
      }
    },
    { 
      id: 2, 
      title: '大R流失召回', 
      date: '2025-10-20', 
      status: '追踪中',
      details: {
        analysis: '近期发现头部大R用户活跃度下降，流失风险增加。',
        strategy: '发送专属定制召回邮件，附带高价值回归礼包。安排专属客服进行1对1回访。',
        execution: '邮件已发送，客服回访进行中。'
      }
    },
    { 
      id: 3, 
      title: '连续签到疲劳', 
      date: '2025-09-15', 
      status: '已归档',
      details: {
        analysis: '连续签到活动参与率逐月递减，用户产生疲劳感。',
        strategy: '将连续签到改为累计签到，降低断签惩罚。增加随机盲盒奖励，提升期待感。',
        execution: '方案已于9月底版本更新上线。'
      }
    },
  ];

  if (selectedRecord) {
    return (
      <div className="p-8 max-w-4xl mx-auto">
        <button 
          onClick={() => setSelectedRecord(null)}
          className="flex items-center gap-2 text-sm font-medium text-slate-500 hover:text-slate-900 mb-6 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          返回历史记录
        </button>
        
        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-8">
          <div className="flex items-start justify-between mb-6 pb-6 border-b border-slate-100">
            <div>
              <h2 className="text-2xl font-bold text-slate-900 tracking-tight mb-2">
                {selectedRecord.query || selectedRecord.title}
              </h2>
              <div className="flex items-center gap-4 text-sm text-slate-500">
                <span className="flex items-center gap-1.5">
                  <Clock className="w-4 h-4" />
                  {selectedRecord.date}
                </span>
                <span className="px-2.5 py-1 bg-slate-100 text-slate-700 rounded-md font-medium text-xs">
                  {selectedRecord.status}
                </span>
              </div>
            </div>
          </div>

          <div className="space-y-8">
            <section>
              <h3 className="text-lg font-bold text-slate-900 mb-3 flex items-center gap-2">
                <FileText className="w-5 h-5 text-indigo-500" />
                问题分析
              </h3>
              <div className="bg-slate-50 rounded-xl p-5 text-slate-700 leading-relaxed text-sm">
                {selectedRecord.details.analysis}
              </div>
            </section>

            <section>
              <h3 className="text-lg font-bold text-slate-900 mb-3 flex items-center gap-2">
                <CheckCircle2 className="w-5 h-5 text-emerald-500" />
                生成策略
              </h3>
              <div className="bg-emerald-50/50 border border-emerald-100 rounded-xl p-5 text-slate-700 leading-relaxed text-sm">
                {selectedRecord.details.strategy}
              </div>
            </section>

            <section>
              <h3 className="text-lg font-bold text-slate-900 mb-3 flex items-center gap-2">
                <Clock className="w-5 h-5 text-blue-500" />
                执行情况
              </h3>
              <div className="bg-blue-50/50 border border-blue-100 rounded-xl p-5 text-slate-700 leading-relaxed text-sm">
                {selectedRecord.details.execution}
              </div>
            </section>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-8 max-w-7xl mx-auto">
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-slate-900 tracking-tight">历史记录</h2>
        <p className="text-sm text-slate-500 mt-1">查看本人过去的输入和输出记录，方便知识积累与复用</p>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
        <div className="p-4 border-b border-slate-200 flex items-center justify-between bg-slate-50/50">
          <div className="relative w-72">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input 
              type="text" 
              placeholder="搜索历史记录..." 
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
              <th className="px-6 py-4">需求摘要</th>
              <th className="px-6 py-4">提交时间</th>
              <th className="px-6 py-4">状态</th>
              <th className="px-6 py-4 text-right">操作</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {records.map((record) => (
              <tr key={record.id} className="hover:bg-slate-50/50 transition-colors">
                <td className="px-6 py-4 font-medium text-slate-900">{record.query || record.title}</td>
                <td className="px-6 py-4 text-slate-500 flex items-center gap-2">
                  <Clock className="w-3.5 h-3.5" />
                  {record.date}
                </td>
                <td className="px-6 py-4">
                  <span className="px-2 py-1 bg-slate-100 text-slate-600 rounded-full text-xs font-medium">
                    {record.status}
                  </span>
                </td>
                <td className="px-6 py-4 text-right">
                  <button 
                    onClick={() => setSelectedRecord(record)}
                    className="text-indigo-600 hover:text-indigo-700 font-medium text-xs px-3 py-1.5 rounded-md hover:bg-indigo-50 transition-colors"
                  >
                    查看详情
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
