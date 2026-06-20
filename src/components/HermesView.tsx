import React, { useState, useEffect } from 'react';
import { 
  Sparkles, 
  Plus, 
  Database, 
  FileText, 
  Filter, 
  Download, 
  CheckCircle, 
  AlertTriangle, 
  TrendingUp, 
  CircleDollarSign,
  Play,
  RotateCw,
  Clock,
  ArrowUpRight
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { LLMProvider, InferenceRecord } from '../types';

interface HermesViewProps {
  stats: {
    todayCost: number;
  };
  setStats: React.Dispatch<React.SetStateAction<any>>;
  searchQuery: string;
}

export default function HermesView({ stats, setStats, searchQuery }: HermesViewProps) {
  
  // List of providers
  const [providers, setProviders] = useState<LLMProvider[]>([
    { id: 'claude', name: 'Claude 3.5', provider: 'Anthropic', quota: 85, type: 'claude', color: 'bg-[#D97757]' },
    { id: 'gpt', name: 'GPT-4o', provider: 'OpenAI', quota: 42, type: 'gpt', color: 'bg-[#10A37F]' },
    { id: 'doubao', name: '豆包 (Doubao)', provider: 'ByteDance', quota: 24, type: 'doubao', color: 'bg-[#2D5CF6]' },
    { id: 'gemini', name: 'Gemini 2.5 Flash', provider: 'Google AI Studio', quota: 60, type: 'gemini', color: 'bg-[#528dff]' }
  ]);

  // Request History logs
  const [logs, setLogs] = useState<InferenceRecord[]>([
    { id: 'INF-001', time: '14:22:05', model: 'Claude-3.5-S', tokens: 1240, latency: '1.2s', preview: '解析量子纠缠在宏观架构下的同步效率...', status: 'success' },
    { id: 'INF-002', time: '14:21:58', model: 'GPT-4o-Main', tokens: 452, latency: '0.8s', preview: '生成的系统安全协议需要三级加密验证...', status: 'success' },
    { id: 'INF-003', time: '14:21:42', model: 'Doubao-L-Pro', tokens: 3120, latency: '4.5s', preview: '深度检索数据库中关于半人马座星系的所有历史记录...', status: 'success' },
    { id: 'INF-004', time: '14:21:30', model: 'Claude-3.5-S', tokens: 118, latency: '0.3s', preview: '确认指令：引擎重启程序已就绪。', status: 'success' },
    { id: 'INF-005', time: '14:21:15', model: 'GPT-4o-Main', tokens: 0, latency: '--', preview: '请求被拦截：检测到敏感安全协议冲突...', status: 'error' },
    { id: 'INF-006', time: '14:20:55', model: 'GPT-4o-Main', tokens: 890, latency: '1.5s', preview: '分析外部探测器传回的引力波异常信号数据...', status: 'success' },
    { id: 'INF-007', time: '14:20:40', model: 'Doubao-L-Pro', tokens: 2100, latency: '3.1s', preview: '对现有神经网络进行剪枝优化的可行性评估...', status: 'success' }
  ]);

  // Selected state for provider configure
  const [selectedProviderId, setSelectedProviderId] = useState<string>('claude');

  // Mini Sandbox Command parameters
  const [sandboxPrompt, setSandboxPrompt] = useState<string>('');
  const [sandboxModel, setSandboxModel] = useState<string>('Gemini-2.5-F');
  const [sandboxExecuting, setSandboxExecuting] = useState<boolean>(false);
  const [sandboxResponse, setSandboxResponse] = useState<string>('');
  const [showAddProviderModal, setShowAddProviderModal] = useState<boolean>(false);

  // New Provider form parameters
  const [newProvName, setNewProvName] = useState('');
  const [newProvCompany, setNewProvCompany] = useState('');
  const [newProvQuota, setNewProvQuota] = useState(50);
  const [newProvType, setNewProvType] = useState<'claude' | 'gpt' | 'doubao' | 'gemini'>('gemini');

  // Triggering interval simulator to generate background random calls just as highlighted in Image 3
  useEffect(() => {
    const interval = setInterval(() => {
      // randomly append a log representation of backend workload
      const samplePrompts = [
        '同步数字孪生核心 Panda-Alpha 姿态向量数据...',
        '检测到分布式 OpenClaw 任务队列有溢出趋势，自动分流中...',
        '评估 Hermes 智库中英文多语言语义关联度分布规律...',
        '重算三区域隔离能限，对齐 VAEX CORE 冗余缓冲...',
        '安全检测：正在审计飞书 Lark 外部 Webhook 接口特征码...'
      ];
      const modelNames = ['Claude-3.5-S', 'GPT-4o-Main', 'Gemini-2.5-F', 'Doubao-L-Pro'];
      const finalModel = modelNames[Math.floor(Math.random() * modelNames.length)];
      const randomTokens = Math.floor(Math.random() * 2000) + 120;
      const isOk = Math.random() > 0.12;

      const rightNow = new Date();
      const timeStr = `${rightNow.getHours().toString().padStart(2, '0')}:${rightNow.getMinutes().toString().padStart(2, '0')}:${rightNow.getSeconds().toString().padStart(2, '0')}`;

      const newRecord: InferenceRecord = {
        id: `INF-${Math.floor(Math.random() * 900) + 100}`,
        time: timeStr,
        model: finalModel,
        tokens: isOk ? randomTokens : 0,
        latency: isOk ? `${(Math.random() * 2.8 + 0.2).toFixed(1)}s` : '--',
        preview: isOk ? samplePrompts[Math.floor(Math.random() * samplePrompts.length)] : '指令失败：安全网锁触发，阻抗失衡！',
        status: isOk ? 'success' : 'error'
      };

      setLogs(prev => [newRecord, ...prev.slice(0, 15)]);

      // update dynamic cost structure
      if (isOk) {
        setStats((prev: any) => ({
          ...prev,
          todayCost: prev.todayCost + (randomTokens * 0.000015)
        }));
      }

    }, 8000);

    return () => clearInterval(interval);
  }, [setStats]);

  const executeSandboxPrompt = (e: React.FormEvent) => {
    e.preventDefault();
    if (!sandboxPrompt.trim()) return;

    setSandboxExecuting(true);
    setSandboxResponse('');

    const tokenMultiplier = Math.floor(Math.random() * 1200) + 150;
    
    // Cybernetic mock generation responses
    const responseSentences = [
      `[DECISION PIPELINE] 正在评估指令特征向量...\n[RESOLVING GRAPH] 链接 VAEX 模型拓扑，在短期内解析。`,
      `[HERMES SCHEDULER] 选择物理通道 ${sandboxModel}。指令参数同步中。`,
      `[CORE RESPONSE] 指令验证完成。\n解析结果：宏观耦合效率符合预期，阻抗对齐。花费约 ${tokenMultiplier} tk。`,
      `[SECURITY VERIFIED] 本轮运算记录已上传飞书/Telegram Bot安全同步渠道。`
    ];

    let currentIdx = 0;
    const interval = setInterval(() => {
      if (currentIdx < responseSentences.length) {
        setSandboxResponse(prev => prev + (prev ? '\n' : '') + responseSentences[currentIdx]);
        currentIdx++;
      } else {
        clearInterval(interval);
        setSandboxExecuting(false);

        // write normal log entry
        const rightNow = new Date();
        const timeStr = `${rightNow.getHours().toString().padStart(2, '0')}:${rightNow.getMinutes().toString().padStart(2, '0')}:${rightNow.getSeconds().toString().padStart(2, '0')}`;
        const finalLog: InferenceRecord = {
          id: `INF-${Math.floor(Math.random() * 900) + 100}`,
          time: timeStr,
          model: sandboxModel,
          tokens: tokenMultiplier,
          latency: '1.2s',
          preview: sandboxPrompt,
          status: 'success'
        };

        setLogs(prev => [finalLog, ...prev]);
        setStats((prev: any) => ({
          ...prev,
          todayCost: prev.todayCost + (tokenMultiplier * 0.00003)
        }));
      }
    }, 400);
  };

  const addCustomProvider = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newProvName.trim()) return;

    const added: LLMProvider = {
      id: newProvName.toLowerCase().replace(/\s+/g, '_'),
      name: newProvName,
      provider: newProvCompany || 'Generic Cloud Engine',
      quota: newProvQuota,
      type: newProvType,
      color: newProvType === 'gemini' ? 'bg-[#528dff]' : 'bg-[#7c03d3]'
    };

    setProviders(prev => [...prev, added]);
    setShowAddProviderModal(false);
    
    // Clean
    setNewProvName('');
    setNewProvCompany('');
    setNewProvQuota(60);
    alert(`LLM服务商 ${newProvName} 配置加载就绪。`);
  };

  // filter logs based on search
  const filteredLogs = logs.filter(l => {
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      return l.model.toLowerCase().includes(q) || l.preview.toLowerCase().includes(q);
    }
    return true;
  });

  const activeProvider = providers.find(p => p.id === selectedProviderId) || providers[0];

  return (
    <div className="grid grid-cols-12 gap-6 h-[calc(100vh-140px)] overflow-hidden font-mono text-xs select-none">
      
      {/* LEFT: LLM Provider Configuration (Image 3 Left Panel) */}
      <section className="col-span-3 flex flex-col gap-6 overflow-y-auto pr-1">
        
        <div className="glass-panel hermes-glow rounded-xl p-5 space-y-4">
          <h3 className="font-sans font-extrabold text-base text-tertiary flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-tertiary animate-pulse" />
            服务商配置
          </h3>
          
          <div className="space-y-3">
            {providers.map((p) => {
              const isSelected = p.id === selectedProviderId;
              return (
                <div 
                  key={p.id}
                  onClick={() => setSelectedProviderId(p.id)}
                  className={`p-3.5 rounded-lg border transition-all duration-300 cursor-pointer flex flex-col justify-between gap-3
                    ${isSelected 
                      ? 'bg-surface-container border-tertiary/70 glow-green' 
                      : 'bg-surface-container-low/50 border-white/5 hover:border-white/10 hover:bg-surface-container/40'}`}
                >
                  <div className="flex justify-between items-start">
                    <div className="flex items-center gap-3">
                      <div className={`w-8 h-8 rounded ${p.color}/20 flex items-center justify-center`}>
                        <Database className={`w-4 h-4 text-on-surface`} />
                      </div>
                      <div>
                        <div className="font-bold text-on-surface text-xs">{p.name}</div>
                        <div className="text-[10px] text-outline-variant">{p.provider}</div>
                      </div>
                    </div>
                    <span className="w-1.5 h-1.5 rounded-full bg-tertiary animate-ping" />
                  </div>

                  <div className="space-y-1.5">
                    <div className="flex justify-between text-[10px]">
                      <span className="text-outline-variant">流量分配配额</span>
                      <span className="text-on-surface font-bold">{p.quota}%</span>
                    </div>
                    <div className="w-full h-1 bg-surface-container-highest rounded-full overflow-hidden">
                      <div className={`h-full ${p.color} rounded-full`} style={{ width: `${p.quota}%` }} />
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          <button 
            onClick={() => setShowAddProviderModal(true)}
            className="w-full py-2.5 border border-white/10 hover:border-tertiary/50 hover:bg-tertiary/5 transition-all rounded font-bold text-tertiary flex items-center justify-center gap-1 cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>添加服务商 (New API Core)</span>
          </button>
        </div>

        {/* Cognitive Load dial */}
        <div className="glass-panel rounded-xl p-5 space-y-4">
          <h4 className="font-sans font-bold text-xs uppercase tracking-wider text-outline-variant">
            网关吞吐负载指标 / Load Level
          </h4>
          <div className="flex items-center gap-4">
            <div className="relative w-14 h-14 shrink-0">
              <svg className="w-full h-full transform -rotate-90" viewBox="0 0 36 36">
                <circle cx="18" cy="18" r="16" fill="none" stroke="rgba(255, 255, 255, 0.05)" strokeWidth="3" />
                <motion.circle 
                  cx="18" 
                  cy="18" 
                  r="16" 
                  fill="none" 
                  stroke="#4edea3" 
                  strokeWidth="3" 
                  strokeDasharray="75, 100" 
                  strokeLinecap="round"
                  initial={{ strokeDasharray: "0, 100" }}
                  animate={{ strokeDasharray: "75, 100" }}
                  transition={{ duration: 1.2 }}
                />
              </svg>
              <div className="absolute inset-0 flex items-center justify-center text-xs font-bold text-tertiary">
                75%
              </div>
            </div>
            <div>
              <div className="text-on-surface font-bold text-xs">网关状态：正常运行</div>
              <div className="text-[10px] text-outline-variant">监测到高并发业务网络信道</div>
            </div>
          </div>
        </div>
      </section>

      {/* MIDDLE: Real-time request log records (Image 3 Main Table & AI Prompt Sandbox) */}
      <section className="col-span-6 flex flex-col gap-6 overflow-hidden">
        
        {/* Dynamic AI Prompt Sandbox (Real server proxy simulation) */}
        <div className="glass-panel rounded-xl p-4 space-y-3 shrink-0 bg-gradient-to-r from-surface-container-low to-transparent">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-1.5 text-primary">
              <Play className="w-4 h-4 text-primary animate-pulse" />
              <span className="font-bold uppercase tracking-wider text-xs">Hermes 智库交互沙盒</span>
            </div>
            <span className="text-[10px] text-outline">大模型网关实时分流遥测</span>
          </div>

          <form onSubmit={executeSandboxPrompt} className="flex gap-2.5">
            <input 
              type="text"
              value={sandboxPrompt}
              onChange={(e) => setSandboxPrompt(e.target.value)}
              placeholder="在沙盒中向智能核心提出疑问 (例如: 自主量子同步协议)..."
              className="flex-1 bg-surface-container-lowest border border-outline-variant rounded-lg px-3 py-2 text-xs text-on-surface placeholder:text-outline-variant outline-none focus:border-primary/80"
              disabled={sandboxExecuting}
            />
            <select
              value={sandboxModel}
              onChange={(e) => setSandboxModel(e.target.value)}
              className="bg-surface-container border border-outline-variant text-[11px] rounded-lg px-2 text-on-surface outline-none"
              disabled={sandboxExecuting}
            >
              <option value="Claude-3.5-S">Claude 3.5</option>
              <option value="GPT-4o-Main">GPT-4o</option>
              <option value="Gemini-2.5-F">Gemini 2.5</option>
              <option value="Doubao-L-Pro">Doubao Pro</option>
            </select>
            <button 
              type="submit"
              disabled={sandboxExecuting || !sandboxPrompt.trim()}
              className="px-4 py-2 bg-primary hover:bg-primary-container text-on-primary font-bold rounded-lg transition-transform active:scale-95 disabled:opacity-40 disabled:scale-100 flex items-center gap-1 cursor-pointer"
            >
              {sandboxExecuting ? <RotateCw className="w-4 h-4 animate-spin" /> : <Sparkles className="w-4 h-4" />}
              <span>输入</span>
            </button>
          </form>

          {sandboxResponse && (
            <motion.div 
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              className="p-3 bg-black/40 rounded-lg text-[11px] text-primary space-y-1 overflow-x-auto border border-primary/10 max-h-24 overflow-y-auto"
            >
              <p className="whitespace-pre-line text-xs italic">{sandboxResponse}</p>
            </motion.div>
          )}
        </div>

        {/* Inference Log records Table */}
        <div className="glass-panel rounded-xl flex flex-col flex-1 overflow-hidden">
          <div className="p-4 border-b border-white/10 flex justify-between items-center bg-white/5 shrink-0">
            <div className="flex items-center gap-2">
              <FileText className="w-4 h-4 text-secondary" />
              <h3 className="font-sans font-extrabold text-sm text-on-surface">实时推理记录</h3>
            </div>
            <div className="flex gap-2 text-[11px]">
              <button 
                onClick={() => {
                  const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(logs, null, 2));
                  const downloadAnchor = document.createElement('a');
                  downloadAnchor.setAttribute("href", dataStr);
                  downloadAnchor.setAttribute("download", "neural_core_inference_logs.json");
                  document.body.appendChild(downloadAnchor);
                  downloadAnchor.click();
                  downloadAnchor.remove();
                  alert("推理日志 JSON 导出成功。");
                }}
                className="bg-surface-container hover:bg-surface-container-high px-3 py-1 rounded text-[11px] border border-white/10 flex items-center gap-1 cursor-pointer"
              >
                <Download className="w-3.5 h-3.5" />
                <span>导出 JSON</span>
              </button>
              <button 
                onClick={() => alert("过滤器已重置为：全部模型。")}
                className="bg-surface-container hover:bg-surface-container-high px-3 py-1 rounded border border-white/10 flex items-center gap-1 cursor-pointer"
              >
                <Filter className="w-3.5 h-3.5" />
                <span>过滤器</span>
              </button>
            </div>
          </div>

          <div className="flex-1 overflow-y-auto custom-scrollbar">
            <table className="w-full text-left border-collapse">
              <thead className="bg-surface-container-low text-outline-variant uppercase tracking-wider text-[10px] sticky top-0 z-20 border-b border-white/5">
                <tr>
                  <th className="px-4 py-3">请求时间</th>
                  <th className="px-4 py-3">模型节点</th>
                  <th className="px-4 py-3">Token 消耗</th>
                  <th className="px-4 py-3">耗时</th>
                  <th className="px-4 py-3">内容预览</th>
                  <th className="px-4 py-3 text-center">状态</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5 text-[11px]">
                <AnimatePresence initial={false}>
                  {filteredLogs.map((log) => (
                    <motion.tr 
                      key={log.id}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      className="hover:bg-white/5 transition-colors cursor-pointer group"
                    >
                      <td className="px-4 py-3 text-on-surface-variant font-mono whitespace-nowrap">
                        {log.time}
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap">
                        <span className={`px-2 py-0.5 rounded text-[10px] border font-bold
                          ${log.model.includes('Claude') ? 'bg-[#D97757]/10 text-[#D97757] border-[#D97757]/20' : ''}
                          ${log.model.includes('GPT') ? 'bg-[#10A37F]/10 text-[#10A37F] border-[#10A37F]/20' : ''}
                          ${log.model.includes('Gemini') ? 'bg-[#528dff]/10 text-[#528dff] border-[#528dff]/20' : ''}
                          ${log.model.includes('Doubao') ? 'bg-[#2D5CF6]/10 text-[#2D5CF6] border-[#2D5CF6]/20' : ''}
                        `}>
                          {log.model}
                        </span>
                      </td>
                      <td className="px-4 py-3 font-bold text-on-surface">
                        {log.tokens > 0 ? (
                          <>
                            {log.tokens.toLocaleString()} <span className="opacity-40 text-[9px] font-normal">tk</span>
                          </>
                        ) : '--'}
                      </td>
                      <td className="px-4 py-3 text-outline-variant">{log.latency}</td>
                      <td className="px-4 py-3 max-w-[180px] truncate italic text-outline-variant">
                        "{log.preview}"
                      </td>
                      <td className="px-4 py-3 text-center">
                        {log.status === 'success' ? (
                          <CheckCircle className="w-4 h-4 text-tertiary mx-auto" />
                        ) : (
                          <AlertTriangle className="w-4 h-4 text-error mx-auto animate-pulse" />
                        )}
                      </td>
                    </motion.tr>
                  ))}
                </AnimatePresence>
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* RIGHT: Token metrics visual charts & Predicted budget (Image 3 Right Panel) */}
      <section className="col-span-3 flex flex-col gap-6 overflow-y-auto pr-1">
        
        {/* Token consumption trend mock charts inside section */}
        <div className="glass-panel rounded-xl p-5 border-t-2 border-primary space-y-4">
          <h3 className="font-sans font-bold text-xs text-primary flex items-center gap-2">
            <TrendingUp className="w-4 h-4" />
            Token 消耗趋势
          </h3>
          
          {/* Luminous Custom SVG Chart block */}
          <div className="h-40 w-full flex items-end justify-between gap-1.5 px-1 relative pt-4">
            <div className="absolute right-0 top-0 text-[10px] text-outline font-bold bg-surface-container p-1 rounded border border-white/5">
              CUR: 14.5k/s
            </div>
            
            {/* Custom SVG/HTML chart heights */}
            <div className="w-full bg-primary/20 hover:bg-primary/40 transition-all rounded relative group h-[60%]">
              <div className="absolute -top-6 left-1/2 -translate-x-1/2 text-[9px] hidden group-hover:block bg-surface-container px-1 py-0.5 rounded border border-white/5 whitespace-nowrap">8.5k</div>
            </div>
            <div className="w-full bg-primary/20 hover:bg-primary/40 transition-all rounded relative group h-[45%]" />
            <div className="w-full bg-primary/20 hover:bg-primary/40 transition-all rounded relative group h-[85%]" />
            <div className="w-full bg-primary/20 hover:bg-primary/40 transition-all rounded relative group h-[30%]" />
            <div className="w-full bg-primary/20 hover:bg-primary/40 transition-all rounded relative group h-[55%]" />
            <div className="w-full bg-primary/20 hover:bg-primary/40 transition-all rounded relative group h-[70%]" />
            <div className="w-full bg-primary rounded relative group h-[95%] shadow-[0_0_12px_#afc6ff]">
              <div className="absolute -top-6 left-1/2 -translate-x-1/2 text-[9px] bg-primary text-on-primary font-bold px-1 rounded">CUR</div>
            </div>
          </div>

          <div className="flex justify-between text-[9px] text-outline-variant font-bold border-t border-white/5 pt-1.5">
            <span>08:00</span>
            <span>10:00</span>
            <span>12:00</span>
            <span>14:00</span>
          </div>
        </div>

        {/* Model ratio Pie representation */}
        <div className="glass-panel rounded-xl p-5 border-t-2 border-secondary space-y-4">
          <h3 className="font-sans font-bold text-xs text-secondary flex items-center gap-2">
            <Database className="w-4 h-4" />
            模型分配占比
          </h3>

          <div className="flex flex-col items-center gap-3">
            <div className="relative w-28 h-28 transform hover:scale-105 transition-transform duration-350">
              {/* Conic gradient representation */}
              <div className="w-full h-full rounded-full" style={{ background: 'conic-gradient(#4edea3 0% 45%, #afc6ff 45% 75%, #ddb8ff 75% 100%)' }} />
              <div className="absolute inset-2 bg-surface-container rounded-full flex flex-col items-center justify-center font-sans">
                <span className="text-[10px] text-outline-variant uppercase">Total</span>
                <span className="font-extrabold text-sm text-on-surface">2.4M tk</span>
              </div>
            </div>

            <div className="w-full space-y-2 text-[11px]">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-tertiary" />
                  <span className="text-on-surface-variant">Claude 3.5</span>
                </div>
                <span className="font-bold">45%</span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-primary" />
                  <span className="text-on-surface-variant">GPT-4o</span>
                </div>
                <span className="font-bold">30%</span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-secondary" />
                  <span className="text-on-surface-variant">豆包</span>
                </div>
                <span className="font-bold">25%</span>
              </div>
            </div>
          </div>
        </div>

        {/* Today Estimated Cost indicators card */}
        <div className="glass-panel rounded-xl p-5 bg-gradient-to-br from-tertiary/10 to-transparent flex flex-col justify-between h-32 relative overflow-hidden">
          <div className="absolute right-0 bottom-0 pointer-events-none opacity-10">
            <CircleDollarSign className="w-24 h-24 text-tertiary -mr-3 -mb-3" />
          </div>
          <div className="space-y-1.5 relative z-10">
            <div className="text-[10px] text-outline-variant font-bold uppercase tracking-wider">本日预计消耗 cost</div>
            <div className="text-3xl font-extrabold text-tertiary tracking-tight font-sans">
              ${stats.todayCost.toFixed(2)}
            </div>
          </div>
          <div className="text-[10px] text-on-surface-variant flex items-center gap-1.5 border-t border-white/5 pt-2 relative z-10">
            <span className="text-tertiary font-bold flex items-center gap-0.5">
              <ArrowUpRight className="w-3 h-3" />
              <span>↑ 12%</span>
            </span> 
            <span>较昨日同期水平</span>
          </div>
        </div>

      </section>

      {/* Show Add Provider Modal */}
      <AnimatePresence>
        {showAddProviderModal && (
          <div className="absolute inset-0 bg-background/80 backdrop-blur-md z-50 flex items-center justify-center p-4">
            <motion.div 
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="glass-panel-heavy p-6 rounded-xl max-w-sm w-full border border-white/10 space-y-4"
            >
              <div className="flex justify-between items-center border-b border-white/5 pb-2">
                <h3 className="font-bold text-sm text-transparent bg-clip-text bg-gradient-to-r from-primary to-secondary">
                  创建新 API 节点 (NEW API PROVIDER)
                </h3>
                <button 
                  onClick={() => setShowAddProviderModal(false)}
                  className="p-1 hover:bg-white/5 rounded-md text-outline hover:text-on-surface"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={addCustomProvider} className="space-y-4 text-xs">
                <div className="space-y-1">
                  <label className="text-outline uppercase text-[10px]">模型名称 / 通信标识 (Name)</label>
                  <input 
                    type="text" 
                    value={newProvName}
                    onChange={(e) => setNewProvName(e.target.value)}
                    placeholder="例如: DeepSeek-V3"
                    className="w-full bg-surface-container-lowest border border-outline-variant rounded-lg p-2.5 outline-none focus:border-primary text-on-surface font-mono"
                    required
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-outline uppercase text-[10px]">服务商提供商主体 (Provider Corporate)</label>
                  <input 
                    type="text" 
                    value={newProvCompany}
                    onChange={(e) => setNewProvCompany(e.target.value)}
                    placeholder="例如: DeepSeek Inc."
                    className="w-full bg-surface-container-lowest border border-outline-variant rounded-lg p-2.5 outline-none focus:border-primary text-on-surface font-mono"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-outline uppercase text-[10px]">类别 (Routing Tag)</label>
                    <select 
                      value={newProvType}
                      onChange={(e: any) => setNewProvType(e.target.value)}
                      className="w-full bg-surface-container-lowest border border-outline-variant rounded-lg p-2 outline-none focus:border-primary text-on-surface"
                    >
                      <option value="gemini">Gemini Core</option>
                      <option value="claude">Anthropic Gate</option>
                      <option value="gpt">OpenAI Secure</option>
                    </select>
                  </div>

                  <div className="space-y-1">
                    <label className="text-outline uppercase text-[10px]">分配流量 ({newProvQuota}%)</label>
                    <input 
                      type="range"
                      min="5"
                      max="100"
                      value={newProvQuota}
                      onChange={(e) => setNewProvQuota(parseInt(e.target.value))}
                      className="w-full accent-tertiary cursor-pointer"
                    />
                  </div>
                </div>

                <div className="pt-2">
                  <button 
                    type="submit"
                    className="w-full py-3 bg-primary text-on-primary font-bold rounded-lg hover:shadow-lg glow-primary hover:bg-primary-container transition-all text-xs outline-none"
                  >
                    配置激活全路由链路 (Activate Routing)
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
}

// Simple Helper X close icon duplicate representation from lucide
function X({ className }: { className?: string }) {
  return (
    <svg className={className} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
      <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
    </svg>
  );
}
