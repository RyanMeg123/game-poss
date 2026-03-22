import { Globe, Shield, Database, Bell } from 'lucide-react';

export default function Settings() {
  return (
    <div className="p-8 max-w-7xl mx-auto">
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-slate-900 tracking-tight">系统设置</h2>
        <p className="text-sm text-slate-500 mt-1">多语言、多租户隔离与权限管理</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Language Settings */}
        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6">
          <div className="flex items-center gap-3 mb-6">
            <div className="p-2 bg-indigo-50 text-indigo-600 rounded-lg">
              <Globe className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-slate-900">多语言支持</h3>
          </div>
          <div className="space-y-4">
            <label className="flex items-center justify-between p-3 border border-slate-200 rounded-lg cursor-pointer hover:bg-slate-50 transition-colors">
              <span className="text-sm font-medium text-slate-700">简体中文 (Chinese)</span>
              <input type="radio" name="language" className="text-indigo-600 focus:ring-indigo-500" defaultChecked />
            </label>
            <label className="flex items-center justify-between p-3 border border-slate-200 rounded-lg cursor-pointer hover:bg-slate-50 transition-colors">
              <span className="text-sm font-medium text-slate-700">English</span>
              <input type="radio" name="language" className="text-indigo-600 focus:ring-indigo-500" />
            </label>
            <label className="flex items-center justify-between p-3 border border-slate-200 rounded-lg cursor-pointer hover:bg-slate-50 transition-colors">
              <span className="text-sm font-medium text-slate-700">日本語 (Japanese)</span>
              <input type="radio" name="language" className="text-indigo-600 focus:ring-indigo-500" />
            </label>
            <label className="flex items-center justify-between p-3 border border-slate-200 rounded-lg cursor-pointer hover:bg-slate-50 transition-colors">
              <span className="text-sm font-medium text-slate-700">한국어 (Korean)</span>
              <input type="radio" name="language" className="text-indigo-600 focus:ring-indigo-500" />
            </label>
            <label className="flex items-center justify-between p-3 border border-slate-200 rounded-lg cursor-pointer hover:bg-slate-50 transition-colors">
              <span className="text-sm font-medium text-slate-700">العربية (Arabic - RTL)</span>
              <input type="radio" name="language" className="text-indigo-600 focus:ring-indigo-500" />
            </label>
          </div>
        </div>

        {/* Tenant & Permissions */}
        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6">
          <div className="flex items-center gap-3 mb-6">
            <div className="p-2 bg-emerald-50 text-emerald-600 rounded-lg">
              <Shield className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-slate-900">多租户与权限</h3>
          </div>
          <div className="space-y-4">
            <div className="p-4 bg-slate-50 rounded-lg border border-slate-100">
              <p className="text-xs font-bold text-slate-500 mb-1 uppercase tracking-wider">当前租户</p>
              <p className="text-sm font-medium text-slate-900">Global Games Inc.</p>
              <p className="text-xs text-emerald-600 mt-1 flex items-center gap-1">
                <Database className="w-3 h-3" /> 数据已隔离
              </p>
            </div>
            <div className="p-4 bg-slate-50 rounded-lg border border-slate-100">
              <p className="text-xs font-bold text-slate-500 mb-1 uppercase tracking-wider">当前角色</p>
              <p className="text-sm font-medium text-slate-900">运营专员 (Operator)</p>
              <p className="text-xs text-slate-500 mt-1">权限: 提交需求、查看建议、回填数据</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
