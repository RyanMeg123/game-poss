import { Users, BookOpen, CheckCircle, TrendingUp } from 'lucide-react';
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

export default function Dashboard() {
  const stats = [
    { title: '本月建议采用率', value: '78%', change: '+5.2%', icon: CheckCircle, color: 'text-emerald-500' },
    { title: '知识库条目', value: '342', change: '+12', icon: BookOpen, color: 'text-indigo-500' },
    { title: '活跃运营人员', value: '45', change: '+3', icon: Users, color: 'text-blue-500' },
    { title: '平均决策提速', value: '2.4天', change: '+15%', icon: TrendingUp, color: 'text-amber-500' },
  ];

  const coreMetricsData = [
    { name: '10-01', 付费率: 12, 次日留存率: 45, DAU: 12000 },
    { name: '10-05', 付费率: 15, 次日留存率: 48, DAU: 13500 },
    { name: '10-10', 付费率: 14, 次日留存率: 47, DAU: 13000 },
    { name: '10-15', 付费率: 18, 次日留存率: 52, DAU: 15000 },
    { name: '10-20', 付费率: 17, 次日留存率: 50, DAU: 14500 },
    { name: '10-25', 付费率: 22, 次日留存率: 55, DAU: 18000 },
  ];

  const knowledgeBaseData = [
    { name: '活动案例库', 数量: 120 },
    { name: '经验策略库', 数量: 85 },
    { name: '节日打法库', 数量: 60 },
    { name: '舆情模板库', 数量: 45 },
    { name: '竞品动态库', 数量: 32 },
  ];

  return (
    <div className="p-8 max-w-7xl mx-auto">
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-slate-900 tracking-tight">数据看板</h2>
        <p className="text-sm text-slate-500 mt-1">平台使用量统计、建议采用率、知识库增长趋势</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {stats.map((stat, i) => {
          const Icon = stat.icon;
          return (
            <div key={i} className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
              <div className="flex items-center justify-between mb-4">
                <div className={`p-3 rounded-xl bg-slate-50 ${stat.color}`}>
                  <Icon className="w-6 h-6" />
                </div>
                <span className="text-xs font-medium text-emerald-600 bg-emerald-50 px-2 py-1 rounded-full">
                  {stat.change}
                </span>
              </div>
              <p className="text-sm font-medium text-slate-500 mb-1">{stat.title}</p>
              <h3 className="text-3xl font-bold text-slate-900">{stat.value}</h3>
            </div>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm h-96 flex flex-col">
          <h3 className="text-base font-semibold text-slate-900 mb-4">核心指标趋势</h3>
          <div className="flex-1 w-full h-full min-h-[250px]">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={coreMetricsData} margin={{ top: 5, right: 20, bottom: 5, left: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#64748b' }} />
                <YAxis yAxisId="left" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#64748b' }} />
                <YAxis yAxisId="right" orientation="right" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#64748b' }} />
                <Tooltip 
                  contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                />
                <Legend wrapperStyle={{ fontSize: '12px', paddingTop: '10px' }} />
                <Line yAxisId="left" type="monotone" dataKey="付费率" stroke="#6366f1" strokeWidth={2} dot={{ r: 4 }} activeDot={{ r: 6 }} />
                <Line yAxisId="left" type="monotone" dataKey="次日留存率" stroke="#10b981" strokeWidth={2} dot={{ r: 4 }} activeDot={{ r: 6 }} />
                <Line yAxisId="right" type="monotone" dataKey="DAU" stroke="#f59e0b" strokeWidth={2} dot={{ r: 4 }} activeDot={{ r: 6 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm h-96 flex flex-col">
          <h3 className="text-base font-semibold text-slate-900 mb-4">知识库内容分布</h3>
          <div className="flex-1 w-full h-full min-h-[250px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={knowledgeBaseData} margin={{ top: 5, right: 20, bottom: 5, left: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#64748b' }} />
                <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#64748b' }} />
                <Tooltip 
                  cursor={{ fill: '#f8fafc' }}
                  contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                />
                <Bar dataKey="数量" fill="#8b5cf6" radius={[4, 4, 0, 0]} maxBarSize={50} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
}
