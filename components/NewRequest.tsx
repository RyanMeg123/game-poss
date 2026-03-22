'use client';

import { useState } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { 
  Send, 
  Mic, 
  Zap, 
  AlertTriangle, 
  CheckCircle2, 
  ThumbsUp, 
  ThumbsDown, 
  Play, 
  Clock, 
  Target, 
  Activity, 
  FileText, 
  Users, 
  SplitSquareHorizontal,
  Loader2,
  Library,
  Bot,
  Database
} from 'lucide-react';

const EXAMPLES = [
  {
    title: "营收下降",
    content: "这个活动完蛋了大家要加班啊！付费率跌到底了，参与率还可以，但是没人花钱。马上就是万圣节了，希望能赶紧找个低成本的替代方案，不然KPI完不成。"
  },
  {
    title: "大R流失",
    content: "最近一个月大R玩家流失严重，公会战参与度下降了30%。大家都在吐槽新出的养成系统太肝了，而且掉率暗改。老板要求下周必须出个挽回方案。"
  },
  {
    title: "新手留存",
    content: "新用户次留只有25%，七留更是惨不忍睹。新手引导做完了就不知道干嘛，前期卡点太严重。需要一个能快速提升前期留存的优化策略，最好不需要改底层逻辑。"
  },
  {
    title: "商业化变现",
    content: "马上要上线的抽卡游戏，目前测试下来ARPU值偏低。玩家囤资源严重，不愿意下池子。求一个能刺激首充和月卡销量的商业化活动方案，不能太逼氪。"
  }
];

type AiStrategyData = {
  summary: {
    emotionPriority: string;
    coreRequest: string;
    currentPainPoint: string;
    coreGoal: string;
  };
  diagnostics: Array<{
    title: string;
    description: string;
    tone: string;
  }>;
  recommendations: Array<{
    tag: string;
    title: string;
    uplift?: string;
    primaryAudienceTitle?: string;
    primaryAudienceBody?: string;
    secondaryAudienceTitle?: string;
    secondaryAudienceBody?: string;
    scenarioRisk?: string;
    knowledgeRef?: string;
    description?: string;
  }>;
};

const markdownComponents = {
  h1: ({ children }: any) => (
    <h1 className="mt-8 first:mt-0 mb-4 text-2xl font-bold tracking-tight text-slate-900 pb-3 border-b border-slate-200">
      {children}
    </h1>
  ),
  h2: ({ children }: any) => (
    <h2 className="mt-7 mb-3 text-lg font-bold text-slate-900 flex items-center gap-2">
      <span className="h-5 w-1 rounded-full bg-indigo-500" />
      {children}
    </h2>
  ),
  h3: ({ children }: any) => (
    <h3 className="mt-5 mb-2 text-base font-semibold text-slate-800">
      {children}
    </h3>
  ),
  p: ({ children }: any) => (
    <p className="my-3 leading-7 text-[15px] text-slate-700">
      {children}
    </p>
  ),
  ul: ({ children }: any) => (
    <ul className="my-3 space-y-2 rounded-2xl border border-slate-200 bg-white/80 p-4">
      {children}
    </ul>
  ),
  ol: ({ children }: any) => (
    <ol className="my-3 space-y-2 rounded-2xl border border-slate-200 bg-white/80 p-4 list-decimal list-inside">
      {children}
    </ol>
  ),
  li: ({ children }: any) => (
    <li className="leading-7 text-[15px] text-slate-700 marker:text-indigo-500">
      {children}
    </li>
  ),
  strong: ({ children }: any) => (
    <strong className="font-semibold text-slate-900">
      {children}
    </strong>
  ),
  blockquote: ({ children }: any) => (
    <blockquote className="my-4 rounded-r-2xl rounded-l-md border-l-4 border-amber-400 bg-amber-50 px-4 py-3 text-slate-700">
      {children}
    </blockquote>
  ),
  hr: () => <hr className="my-6 border-slate-200" />,
  code: ({ children }: any) => (
    <code className="rounded bg-slate-100 px-1.5 py-0.5 text-[13px] text-indigo-700">
      {children}
    </code>
  ),
  pre: ({ children }: any) => (
    <pre className="my-4 overflow-x-auto rounded-2xl bg-slate-900 p-4 text-sm text-slate-100">
      {children}
    </pre>
  ),
  table: ({ children }: any) => (
    <div className="my-4 overflow-x-auto rounded-2xl border border-slate-200 bg-white">
      <table className="min-w-full text-sm">{children}</table>
    </div>
  ),
  thead: ({ children }: any) => (
    <thead className="bg-slate-100 text-slate-700">{children}</thead>
  ),
  th: ({ children }: any) => (
    <th className="px-4 py-3 text-left font-semibold">{children}</th>
  ),
  td: ({ children }: any) => (
    <td className="border-t border-slate-200 px-4 py-3 align-top text-slate-700">{children}</td>
  ),
};

export default function NewRequest() {
  const [input, setInput] = useState('');
  const [status, setStatus] = useState<'idle' | 'analyzing' | 'done'>('idle');
  const [strategy, setStrategy] = useState<'ai' | 'rag'>('ai');
  const [aiData, setAiData] = useState<AiStrategyData | null>(null);
  const [aiError, setAiError] = useState<string | null>(null);
  const [ragData, setRagData] = useState<any>(null);
  const [ragError, setRagError] = useState<string | null>(null);
  const [feedback, setFeedback] = useState<Record<number, 'up' | 'down' | null>>({});
  const [executed, setExecuted] = useState<Record<number, boolean>>({});

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;
    setStatus('analyzing');
    setAiData(null);
    setAiError(null);
    setRagData(null);
    setRagError(null);
    
    if (strategy === 'rag') {
      try {
        const res = await fetch('/api/generate-strategy-rag', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ input })
        });
        
        if (!res.ok) {
          const errorText = await res.text();
          let errorMsg = errorText;
          try {
            const errJson = JSON.parse(errorText);
            errorMsg = errJson.error || errorText;
          } catch (e) {}
          setRagError(`请求失败 (${res.status}): ${errorMsg}`);
          setStatus('done');
          return;
        }

        const reader = res.body?.getReader();
        if (!reader) {
          throw new Error('Failed to get response reader');
        }

        const decoder = new TextDecoder();
        let buffer = '';
        let fullText = '';
        let finalOutputs: any = null;

        while (true) {
          const { done, value } = await reader.read();
          if (done) break;
          
          buffer += decoder.decode(value, { stream: true });
          const parts = buffer.split('\n\n');
          buffer = parts.pop() || '';

          for (const part of parts) {
            const lines = part.split('\n');
            for (const line of lines) {
              if (line.startsWith('data: ')) {
                const dataStr = line.slice(6).trim();
                if (!dataStr) continue;
                try {
                  const data = JSON.parse(dataStr);
                  if (data.event === 'text_chunk') {
                    fullText += data.data.text;
                    setRagData({ answer: fullText }); // Update UI progressively
                  } else if (data.event === 'workflow_finished') {
                    finalOutputs = data.data.outputs;
                  } else if (data.event === 'error') {
                    setRagError(data.error || 'Workflow execution error');
                  }
                } catch (e) {
                  console.error('Failed to parse SSE chunk:', dataStr);
                }
              }
            }
          }
        }

        if (finalOutputs && Object.keys(finalOutputs).length > 0) {
          setRagData({ answer: fullText, data: { outputs: finalOutputs } });
        } else if (fullText) {
          setRagData({ answer: fullText });
        } else {
          setRagError('未收到任何生成内容，请检查 Dify 工作流配置。');
        }

      } catch (err: any) {
        console.error(err);
        setRagError(err.message || 'Unknown error occurred');
      }
    } else {
      try {
        const res = await fetch('/api/generate-strategy-ai', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ input })
        });

        const data = await res.json().catch(() => ({}));

        if (!res.ok) {
          setAiError(data?.error || `请求失败 (${res.status})`);
          setStatus('done');
          return;
        }

        if (!data?.data) {
          setAiError('AIHubMix 未返回任何结构化内容。');
          setStatus('done');
          return;
        }

        setAiData(data.data);
      } catch (err: any) {
        console.error(err);
        setAiError(err.message || 'Unknown error occurred');
      }
    }
    
    setStatus('done');
  };

  const handleFeedback = (id: number, type: 'up' | 'down') => {
    setFeedback(prev => ({
      ...prev,
      [id]: prev[id] === type ? null : type
    }));
  };

  const handleExecute = (id: number) => {
    setExecuted(prev => ({
      ...prev,
      [id]: !prev[id]
    }));
  };

  const renderAiStrategyGrid = () => {
    if (!aiData) return null;

    const diagnostics = aiData.diagnostics.slice(0, 2);
    const recommendations = aiData.recommendations.slice(0, 3);

    return (
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-1 space-y-6">
          <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6">
            <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2 mb-4">
              <FileText className="w-4 h-4 text-indigo-500" />
              需求结构化摘要
            </h3>
            
            <div className="space-y-4">
              <div>
                <p className="text-xs text-slate-500 font-medium mb-1">情绪与优先级</p>
                <div className="flex flex-wrap gap-2">
                  <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md bg-red-50 text-red-700 text-xs font-medium border border-red-100">
                    <Zap className="w-3 h-3 fill-current" />
                    {aiData.summary.emotionPriority}
                  </span>
                </div>
              </div>

              <div>
                <p className="text-xs text-slate-500 font-medium mb-1">核心诉求</p>
                <p className="text-sm text-slate-900 bg-slate-50 p-3 rounded-lg border border-slate-100">
                  {aiData.summary.coreRequest}
                </p>
              </div>

              <div>
                <p className="text-xs text-slate-500 font-medium mb-1">当前痛点</p>
                <p className="text-sm text-slate-900 flex items-start gap-2">
                  <span className="text-red-500 mt-0.5">•</span>
                  {aiData.summary.currentPainPoint}
                </p>
              </div>

              <div>
                <p className="text-xs text-slate-500 font-medium mb-1">核心目标</p>
                <p className="text-sm text-slate-900 flex items-start gap-2">
                  <span className="text-emerald-500 mt-0.5">•</span>
                  {aiData.summary.coreGoal}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6">
            <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2 mb-4">
              <Activity className="w-4 h-4 text-blue-500" />
              辅助诊断维度
            </h3>
            <div className="space-y-3">
              {diagnostics.map((diagnostic, idx) => (
                <div
                  key={`${diagnostic.title}-${idx}`}
                  className={`p-3 rounded-lg border ${
                    diagnostic.tone === 'warning'
                      ? 'bg-amber-50 border-amber-100'
                      : 'bg-slate-50 border-slate-100'
                  }`}
                >
                  <div className={`flex items-center gap-2 font-medium text-xs mb-1 ${
                    diagnostic.tone === 'warning' ? 'text-amber-800' : 'text-slate-700'
                  }`}>
                    {diagnostic.tone === 'warning' ? (
                      <AlertTriangle className="w-3.5 h-3.5" />
                    ) : (
                      <Target className="w-3.5 h-3.5" />
                    )}
                    {diagnostic.title}
                  </div>
                  <p className={`text-xs ${
                    diagnostic.tone === 'warning' ? 'text-amber-700' : 'text-slate-600'
                  }`}>
                    {diagnostic.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="lg:col-span-2 space-y-4">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-lg font-bold text-slate-900">智能策略建议</h3>
            <button className="text-xs font-medium text-indigo-600 bg-indigo-50 px-3 py-1.5 rounded-lg hover:bg-indigo-100 flex items-center gap-1.5">
              <SplitSquareHorizontal className="w-3.5 h-3.5" />
              生成 A/B 测试方案
            </button>
          </div>

          {recommendations.map((recommendation, idx) => (
            <div
              key={`${recommendation.title}-${idx}`}
              className={`bg-white rounded-2xl shadow-sm p-6 relative overflow-hidden ${
                idx === 0 ? 'border border-indigo-100' : 'border border-slate-200'
              }`}
            >
              <div className={`absolute top-0 left-0 w-1 h-full ${idx === 0 ? 'bg-indigo-500' : 'bg-slate-300'}`}></div>
              <div className="flex justify-between items-start mb-4">
                <div>
                  <span className={`inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider mb-2 ${
                    idx === 0 ? 'bg-indigo-100 text-indigo-700' : 'bg-slate-100 text-slate-600'
                  }`}>
                    {recommendation.tag}
                  </span>
                  <h4 className="text-base font-bold text-slate-900">{recommendation.title}</h4>
                </div>
                {idx === 0 && recommendation.uplift ? (
                  <span className="text-xs font-medium text-emerald-600 bg-emerald-50 px-2 py-1 rounded-md border border-emerald-100">
                    预期转化提升: {recommendation.uplift}
                  </span>
                ) : null}
              </div>

              {idx === 0 ? (
                <div className="space-y-4 mb-6">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="bg-slate-50 p-3 rounded-xl border border-slate-100">
                      <p className="text-xs font-bold text-slate-700 mb-1 flex items-center gap-1.5">
                        <Users className="w-3.5 h-3.5 text-purple-500" />
                        {recommendation.primaryAudienceTitle}
                      </p>
                      <p className="text-xs text-slate-600">{recommendation.primaryAudienceBody}</p>
                    </div>
                    <div className="bg-slate-50 p-3 rounded-xl border border-slate-100">
                      <p className="text-xs font-bold text-slate-700 mb-1 flex items-center gap-1.5">
                        <Users className="w-3.5 h-3.5 text-blue-500" />
                        {recommendation.secondaryAudienceTitle}
                      </p>
                      <p className="text-xs text-slate-600">{recommendation.secondaryAudienceBody}</p>
                    </div>
                  </div>
                  <div>
                    <p className="text-xs text-slate-500 mb-1">适用场景与风险</p>
                    <p className="text-xs text-slate-700">{recommendation.scenarioRisk}</p>
                  </div>
                  <div>
                    <p className="text-xs text-slate-500 mb-1">知识库参考</p>
                    <div className="text-xs text-indigo-600 flex items-center gap-1">
                      <Library className="w-3 h-3" />
                      {recommendation.knowledgeRef}
                    </div>
                  </div>
                </div>
              ) : (
                <p className="text-sm text-slate-600 mb-4">
                  {recommendation.description}
                </p>
              )}

              <div className="flex items-center justify-between pt-4 border-t border-slate-100">
                <div className="flex gap-2">
                  <button 
                    onClick={() => handleFeedback(idx + 1, 'up')}
                    className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-lg border transition-colors ${
                      feedback[idx + 1] === 'up' 
                        ? 'bg-indigo-50 text-indigo-700 border-indigo-200' 
                        : 'text-slate-600 bg-slate-50 hover:bg-slate-100 border-slate-200'
                    }`}
                  >
                    <ThumbsUp className={`w-3.5 h-3.5 ${feedback[idx + 1] === 'up' ? 'fill-current' : ''}`} /> 有用
                  </button>
                  <button 
                    onClick={() => handleFeedback(idx + 1, 'down')}
                    className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-lg border transition-colors ${
                      feedback[idx + 1] === 'down' 
                        ? 'bg-red-50 text-red-700 border-red-200' 
                        : 'text-slate-600 bg-slate-50 hover:bg-slate-100 border-slate-200'
                    }`}
                  >
                    <ThumbsDown className={`w-3.5 h-3.5 ${feedback[idx + 1] === 'down' ? 'fill-current' : ''}`} /> 无用
                  </button>
                </div>
                <button 
                  onClick={() => handleExecute(idx + 1)}
                  className={`flex items-center gap-1.5 px-4 py-1.5 text-xs font-bold rounded-lg transition-colors ${
                    executed[idx + 1]
                      ? 'text-emerald-700 bg-emerald-100 hover:bg-emerald-200'
                      : idx === 0
                        ? 'text-white bg-slate-900 hover:bg-slate-800'
                        : 'text-slate-700 bg-slate-100 hover:bg-slate-200'
                  }`}
                >
                  {executed[idx + 1] ? <CheckCircle2 className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5 fill-current" />}
                  {executed[idx + 1] ? '已执行' : '标记为已执行'}
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  };

  return (
    <div className="flex-1 overflow-y-auto bg-slate-50">
      <div className="max-w-5xl mx-auto p-8">
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-slate-900 tracking-tight">需求提交与策略生成</h2>
          <p className="text-sm text-slate-500 mt-1">输入情绪化、零散的业务需求，AI Agent 将自动结构化并匹配最佳策略。</p>
        </div>

        {/* Input Section */}
        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6 mb-8">
          <div className="flex items-center gap-4 mb-4">
            <label className="text-sm font-medium text-slate-700">生成策略：</label>
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => setStrategy('ai')}
                className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                  strategy === 'ai' 
                    ? 'bg-indigo-100 text-indigo-700 border border-indigo-200' 
                    : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'
                }`}
              >
                <Bot className="w-4 h-4" />
                直接用 AI 生成
              </button>
              <button
                type="button"
                onClick={() => setStrategy('rag')}
                className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                  strategy === 'rag' 
                    ? 'bg-indigo-100 text-indigo-700 border border-indigo-200' 
                    : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'
                }`}
              >
                <Database className="w-4 h-4" />
                用知识库 RAG 生成
              </button>
            </div>
          </div>
          <form onSubmit={handleSubmit}>
            <div className="relative">
              <textarea
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="描述当前遇到的问题，例如：活动上线后付费率不理想，玩家抱怨奖励太少..."
                className="w-full h-32 p-4 pb-12 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 resize-none text-sm"
              />
              <div className="absolute bottom-3 left-3 flex gap-2 items-center">
                <button type="button" className="p-2 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors">
                  <Mic className="w-5 h-5" />
                </button>
                <div className="hidden sm:flex gap-2">
                  {EXAMPLES.map((example, idx) => (
                    <button 
                      key={idx}
                      type="button" 
                      onClick={() => setInput(example.content)} 
                      className="px-3 py-1.5 text-xs font-medium text-slate-600 bg-white border border-slate-200 hover:bg-indigo-50 hover:text-indigo-600 hover:border-indigo-200 rounded-lg transition-colors"
                    >
                      {example.title}
                    </button>
                  ))}
                </div>
              </div>
              <div className="absolute bottom-3 right-3">
                <button 
                  type="submit" 
                  disabled={!input.trim() || status === 'analyzing'}
                  className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white text-sm font-medium rounded-lg hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  {status === 'analyzing' ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
                  {status === 'analyzing' ? '分析中...' : '生成策略'}
                </button>
              </div>
            </div>
          </form>
        </div>

        {/* Results Section */}
        {status === 'done' && (
          <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
            {strategy === 'rag' && (ragData || ragError) && (
              <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6">
                <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2 mb-4">
                  <Database className="w-5 h-5 text-indigo-500" />
                  知识库 RAG 生成结果
                </h3>
                {ragError ? (
                  <div className="p-4 bg-red-50 text-red-700 rounded-xl border border-red-100 text-sm">
                    <div className="font-bold mb-1 flex items-center gap-2">
                      <AlertTriangle className="w-4 h-4" />
                      生成失败
                    </div>
                    <p>{ragError}</p>
                    <p className="mt-2 text-xs opacity-80">
                      提示：请检查 Dify 工作流的开始节点变量名是否包含 `query`、`text` 或 `input`，并确保 API Key 配置正确。
                    </p>
                  </div>
                ) : (
                  <div className="rounded-[28px] border border-indigo-100 bg-gradient-to-br from-indigo-50 via-white to-slate-50 p-6 shadow-sm">
                    {(() => {
                      let content = '';
                      if (ragData?.answer) {
                        content = ragData.answer;
                      } else if (ragData?.data?.outputs?.text) {
                        content = ragData.data.outputs.text;
                      } else if (ragData?.data?.outputs?.result) {
                        content = ragData.data.outputs.result;
                      } else {
                        content = ragData?.data?.outputs ? JSON.stringify(ragData.data.outputs, null, 2) : JSON.stringify(ragData, null, 2);
                      }
                      
                      if (content.startsWith('{') || content.startsWith('[')) {
                        return <pre className="whitespace-pre-wrap rounded-2xl bg-slate-900 p-4 font-sans text-sm text-slate-100">{content}</pre>;
                      }
                      
                      return (
                        <ReactMarkdown remarkPlugins={[remarkGfm]} components={markdownComponents}>
                          {content}
                        </ReactMarkdown>
                      );
                    })()}
                  </div>
                )}
              </div>
            )}

            {strategy === 'ai' && (aiData || aiError) && (
              <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6">
                <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2 mb-4">
                  <Bot className="w-5 h-5 text-indigo-500" />
                  AIHubMix 生成结果
                </h3>
                {aiError ? (
                  <div className="p-4 bg-red-50 text-red-700 rounded-xl border border-red-100 text-sm">
                    <div className="font-bold mb-1 flex items-center gap-2">
                      <AlertTriangle className="w-4 h-4" />
                      生成失败
                    </div>
                    <p>{aiError}</p>
                  </div>
                ) : (
                  renderAiStrategyGrid()
                )}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
