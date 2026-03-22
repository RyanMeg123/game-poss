import { useState } from 'react';
import { SplitSquareHorizontal, ArrowRight, ShieldAlert, Zap, CheckCircle2 } from 'lucide-react';

export default function ABTest() {
  const [selectedOption, setSelectedOption] = useState<string | null>(null);

  return (
    <div className="p-8 max-w-7xl mx-auto">
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-slate-900 tracking-tight flex items-center gap-2">
          <SplitSquareHorizontal className="w-6 h-6 text-indigo-600" />
          A/B 测试建议对比
        </h2>
        <p className="text-sm text-slate-500 mt-1">针对同一需求生成多套建议方案供对比选择，辅助数据驱动型决策。</p>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6 mb-8">
        <h3 className="text-sm font-bold text-slate-900 mb-4">当前需求：万圣节前夕付费率下滑挽救</h3>
        
        {selectedOption ? (
          <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-8 text-center">
            <div className="w-12 h-12 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <CheckCircle2 className="w-6 h-6 text-emerald-600" />
            </div>
            <h3 className="text-lg font-bold text-slate-900 mb-2">已选择方案 {selectedOption}</h3>
            <p className="text-sm text-slate-600 mb-6">该方案已标记为执行，系统将自动在「运营效果追踪」中建立追踪任务。</p>
            <button 
              onClick={() => setSelectedOption(null)}
              className="px-4 py-2 bg-white border border-slate-200 text-slate-600 text-sm font-medium rounded-lg hover:bg-slate-50 transition-colors"
            >
              重新选择
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Option A */}
            <div className="border-2 border-indigo-100 rounded-xl p-6 relative bg-indigo-50/30 hover:border-indigo-300 transition-colors">
              <div className="absolute top-0 right-0 bg-indigo-100 text-indigo-700 text-xs font-bold px-3 py-1 rounded-bl-lg rounded-tr-xl">
                方案 A (激进型)
              </div>
              <h4 className="text-lg font-bold text-slate-900 mb-2 flex items-center gap-2">
                <Zap className="w-4 h-4 text-amber-500 fill-current" />
                大幅度折扣闪促
              </h4>
              <p className="text-sm text-slate-600 mb-6">
                在晚间高峰期开启全场 4-6 小时的 5 折限时闪促，利用极强的稀缺性刺激冲动消费。
              </p>
              
              <div className="space-y-3 mb-6">
                <div className="flex justify-between text-sm">
                  <span className="text-slate-500">预期效果区间</span>
                  <span className="font-bold text-emerald-600">+25% ~ +40%</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-slate-500">风险等级</span>
                  <span className="font-bold text-red-600">高 (可能损耗长期价值)</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-slate-500">所需资源</span>
                  <span className="font-medium text-slate-900">低 (仅需配置计费点)</span>
                </div>
              </div>
              
              <button 
                onClick={() => setSelectedOption('A')}
                className="w-full py-2.5 bg-indigo-600 text-white text-sm font-medium rounded-lg hover:bg-indigo-700 transition-colors"
              >
                选择方案 A 并执行
              </button>
            </div>

            {/* Option B */}
            <div className="border-2 border-slate-200 rounded-xl p-6 relative hover:border-slate-300 transition-colors">
              <div className="absolute top-0 right-0 bg-slate-100 text-slate-600 text-xs font-bold px-3 py-1 rounded-bl-lg rounded-tr-xl">
                方案 B (保守型)
              </div>
              <h4 className="text-lg font-bold text-slate-900 mb-2 flex items-center gap-2">
                <ShieldAlert className="w-4 h-4 text-blue-500" />
                首充破冰与阶梯奖励
              </h4>
              <p className="text-sm text-slate-600 mb-6">
                降低首充门槛至 0.99 刀，并增加累计充值阶梯奖励，平缓刺激付费，保护经济系统。
              </p>
              
              <div className="space-y-3 mb-6">
                <div className="flex justify-between text-sm">
                  <span className="text-slate-500">预期效果区间</span>
                  <span className="font-bold text-emerald-600">+10% ~ +15%</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-slate-500">风险等级</span>
                  <span className="font-bold text-emerald-600">低 (经济系统安全)</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-slate-500">所需资源</span>
                  <span className="font-medium text-slate-900">中 (需配置新活动UI)</span>
                </div>
              </div>
              
              <button 
                onClick={() => setSelectedOption('B')}
                className="w-full py-2.5 bg-slate-100 text-slate-700 text-sm font-medium rounded-lg hover:bg-slate-200 transition-colors"
              >
                选择方案 B 并执行
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
