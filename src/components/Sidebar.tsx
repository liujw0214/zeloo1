import React from 'react';
import { 
  LayoutDashboard, 
  BrainCircuit, 
  Sparkles, 
  Settings as SettingsIcon, 
  LineChart, 
  Wrench, 
  Activity, 
  Power,
  HelpCircle,
  Terminal,
  ShieldCheck
} from 'lucide-react';
import { motion } from 'motion/react';
import { ActiveTab } from '../types';

interface SidebarProps {
  activeTab: ActiveTab;
  setActiveTab: (tab: ActiveTab) => void;
  systemOnline: boolean;
  setSystemOnline: (online: boolean) => void;
  systemLatency: number;
}

export default function Sidebar({ 
  activeTab, 
  setActiveTab, 
  systemOnline, 
  setSystemOnline,
  systemLatency
}: SidebarProps) {
  
  const navItems = [
    { id: 'dashboard' as ActiveTab, label: '主控制台', icon: LayoutDashboard },
    { id: 'vaex' as ActiveTab, label: 'VAEX 神经网络', icon: BrainCircuit },
    { id: 'hermes' as ActiveTab, label: 'Hermes 分布式智库', icon: Sparkles },
    { id: 'openclaw' as ActiveTab, label: 'OpenClaw 智能体主宰', icon: Wrench },
    { id: 'hub_monitor' as ActiveTab, label: 'Hub 数字孪生监控', icon: Activity },
    { id: 'evolution' as ActiveTab, label: 'Evolution 系统演化', icon: LineChart },
    { id: 'settings' as ActiveTab, label: '系统设置与配置', icon: SettingsIcon },
  ];

  return (
    <aside className="h-screen w-64 fixed left-0 top-0 border-r border-white/10 bg-surface-container-lowest/80 backdrop-blur-xl flex flex-col py-6 shadow-2xl z-50">
      {/* Brand Header */}
      <div className="px-6 mb-8">
        <motion.h1 
          className="text-4xl font-extrabold tracking-tighter text-transparent bg-clip-text bg-gradient-to-r from-primary via-secondary to-tertiary"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          神经内核
        </motion.h1>
        <div className="flex items-center gap-2 mt-1.5">
          <span className={`w-2 h-2 rounded-full ${systemOnline ? 'bg-tertiary animate-pulse' : 'bg-error'}`} />
          <p className="font-mono text-xs text-on-surface-variant opacity-70">
            引擎状态: {systemOnline ? '运行正常 • 在线' : '暂停服务 • 离线'}
          </p>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 space-y-1 px-3">
        {navItems.map((item) => {
          const isActive = activeTab === item.id;
          const Icon = item.icon;
          return (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className="w-full relative group rounded-md outline-none transition-all duration-300"
            >
              {isActive && (
                <motion.div 
                  layoutId="active-nav bg"
                  className="absolute inset-0 bg-primary-container/10 border-l-4 border-primary rounded-md"
                  transition={{ type: "spring", stiffness: 300, damping: 30 }}
                />
              )}
              
              <div className={`relative flex items-center gap-3 px-4 py-3 z-10 transition-colors duration-200 ${isActive ? 'text-primary' : 'text-on-surface-variant hover:text-on-surface hover:bg-white/5'}`}>
                <Icon className={`w-5 h-5 transition-transform duration-300 group-hover:scale-110 ${isActive ? 'text-primary' : 'text-on-surface-variant'}`} />
                <div className="text-left">
                  <div className="font-semibold text-sm">{item.label}</div>
                </div>
              </div>
            </button>
          );
        })}
      </nav>

      {/* Footer Controls */}
      <div className="mt-auto px-6 pt-4 border-t border-white/5 space-y-4">
        <button 
          onClick={() => setSystemOnline(!systemOnline)}
          className={`w-full py-3 px-4 rounded-lg font-bold flex items-center justify-center gap-2 active:scale-95 transition-all duration-300 
            ${systemOnline 
              ? 'bg-secondary-container text-on-secondary-container glow-purple border border-secondary/20 hover:bg-secondary-container/90' 
              : 'bg-surface-container-high text-on-surface-variant hover:bg-surface-container-highest border border-white/5'}`}
        >
          <Power className={`w-4 h-4 ${systemOnline ? 'rotate-0' : 'rotate-180'} transition-transform duration-500`} />
          <span className="text-sm font-mono tracking-wider">
            {systemOnline ? '系统运行中' : '系统已下线'}
          </span>
        </button>

        <div className="flex justify-between items-center px-2">
          <div className="flex gap-4">
            <button 
              onClick={() => alert(`当前系统延迟: ${systemLatency}ms | 安全连接状态 (TLS 1.3 强加密)`)}
              className="group"
              title="系统帮助"
            >
              <HelpCircle className="w-5 h-5 text-outline-variant hover:text-primary cursor-pointer transition-colors" />
            </button>
            <button 
              onClick={() => alert('终端诊断日志分析功能加载完整。当前沙箱执行节点十分安全。')}
              className="group"
              title="查看终端日志与诊断"
            >
              <Terminal className="w-5 h-5 text-outline-variant hover:text-primary cursor-pointer transition-colors" />
            </button>
          </div>
          
          <div className="flex items-center gap-1 font-mono text-[10px] text-outline-variant select-none">
            <ShieldCheck className="w-3.5 h-3.5 text-tertiary" />
            <span>安全连接</span>
          </div>
        </div>
      </div>
    </aside>
  );
}
