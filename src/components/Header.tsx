import React from 'react';
import { Search, Bell, Network, Power, RefreshCw } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { ActiveTab } from '../types';

interface HeaderProps {
  activeTab: ActiveTab;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  onRefresh: () => void;
  systemOnline: boolean;
  setSystemOnline: (online: boolean) => void;
  mode: 'standard' | 'overclocked' | 'stealth';
  setMode: (mode: 'standard' | 'overclocked' | 'stealth') => void;
  notificationCount: number;
  setNotificationCount: (count: number) => void;
}

export default function Header({
  activeTab,
  searchQuery,
  setSearchQuery,
  onRefresh,
  systemOnline,
  setSystemOnline,
  mode,
  setMode,
  notificationCount,
  setNotificationCount
}: HeaderProps) {
  
  // Decide placeholder text depending on active tab
  const getSearchPlaceholder = () => {
    switch (activeTab) {
      case 'vaex':
        return '搜索知识节点、关联、实体 (ID, 名称)...';
      case 'hermes':
        return '搜索智库请求指令、模型名称...';
      case 'openclaw':
        return '搜索 Spawn 子代理会话、定时任务...';
      case 'hub_monitor':
        return '在虚拟办公室中检索 Pandas 员工...';
      case 'evolution':
        return '检索历史认知演化时段指标...';
      default:
        return '搜索全局神经集群资源...';
    }
  };

  const getProfileImage = () => {
    if (activeTab === 'vaex') {
      return 'https://lh3.googleusercontent.com/aida-public/AB6AXuAbJUMKm4fRPqA8nP5GrsZCQ_pAZ2iQvzPpJbeh4n0nInJ_mNBWp9fBAc3IU6Eg9YkGhbjbLCEJTSpC5Kpmq16AeR33NVFKAS9XUUP3u2cCph1awHg2oVx5MT4av72wEHLWfuf27HGtiB5jXNUfO7gfW-nnxqGL6DKGo0HPeqKjMrnFkpjof7c-O4Vb4Fs17lpLv6n95Osj-1jBbezwCa9G1_cPcD272ULFN_IMQUmMV_4_cxuytriciQ370ZZWSo90IJ10Duqqienr';
    } else if (activeTab === 'openclaw') {
      return 'https://lh3.googleusercontent.com/aida-public/AB6AXuCVgbB8mHQfhUlNNTgdYb-WCkiOqx6QUYRnIJ0t52zxVXFkurJt-ZfMn_miI0oi4CYg4uhyBtKwEJe0wHYkHIp0AXdQto56xdtxtkwbrv19pPMPSUPbsL1O8xSVvyoVu_sntG4yFkFS8LtS2n4KLwgvdccXG408Y_iqDXbbGYbhe2RL1-2g8iDOcEe93B45dJYek5ADpkqldn2pOC4hyoMt23NAWpmTgm8CHC-z0d61B9a3UncNc2kcQyK-bro3lVcN-Konl9KpfADl';
    } else {
      return 'https://lh3.googleusercontent.com/aida-public/AB6AXuAE9CzYJpwDzEOsRKA3LpIoNZ8VrVYpnU-hOlgO6PmvASUtdnwKz9lsslk1QVkDbPrv8U8asEA-sq98UtEiFpJ4Y5scrjnBiKvDGn24qTuZ8ADwc_7XntGlrKQKeDukDL2iXD3hSGVw7riKIiPK7et2ixn9MTk3rEYErRF2PHXqBO68rP4ogtzIToJqjgb42WYtJxvb7Bn1hPELo22q5qvCGnimlT8WKQcbwQSE6lMaCEOH8_FoFQpMy5wnz8hBPOi0vzEV9x4WvCN_';
    }
  };

  const handleProfileClick = () => {
    alert(`管理员身份已验证。\n邮箱: 383248258@qq.com\n活动页面访问权: ${activeTab.toUpperCase()}\n安全防御评级: 3级绝对管控防线协议。`);
  };

  const cycleMode = () => {
    let next: 'standard' | 'overclocked' | 'stealth' = 'standard';
    if (mode === 'standard') next = 'overclocked';
    else if (mode === 'overclocked') next = 'stealth';
    setMode(next);
  };

  return (
    <header className="fixed top-0 right-0 left-64 h-16 border-b border-white/10 bg-surface-container-lowest/80 backdrop-blur-xl flex justify-between items-center px-6 z-40">
      {/* Search and Brand */}
      <div className="flex items-center gap-6">
        <span className="font-sans font-bold text-lg tracking-wider text-primary select-none shrink-0">
          深空智能 AI
        </span>
        <div className="h-6 w-px bg-white/10 hidden md:block" />
        
        {/* Animated Input Field */}
        <div className="relative w-64 md:w-80">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-outline w-4 h-4" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder={getSearchPlaceholder()}
            className="w-full bg-surface-container-lowest border border-outline-variant/60 focus:border-primary/80 focus:ring-1 focus:ring-primary/40 rounded-full pl-10 pr-4 py-1.5 text-xs text-on-surface placeholder:text-outline-variant outline-none transition-all duration-300"
          />
        </div>
      </div>

      {/* Operations Quick Bar */}
      <div className="flex items-center gap-6">
        <nav className="flex gap-4 items-center border-r border-white/10 pr-6 mr-1 text-[11px] font-mono select-none">
          <button 
            onClick={onRefresh}
            className="text-on-surface-variant hover:text-primary transition-colors flex items-center gap-1.5 group cursor-pointer outline-none"
          >
            <RefreshCw className="w-3.5 h-3.5 group-hover:rotate-180 transition-transform duration-500 text-outline-variant" />
            <span>系统更新同步</span>
          </button>
          
          <button 
            onClick={cycleMode}
            className={`transition-colors font-semibold px-2 py-0.5 rounded border outline-none cursor-pointer
              ${mode === 'overclocked' ? 'text-error bg-error/10 border-error/20' : ''}
              ${mode === 'stealth' ? 'text-secondary bg-secondary/10 border-secondary/20' : ''}
              ${mode === 'standard' ? 'text-on-surface-variant hover:text-primary border-transparent' : ''}
            `}
          >
            引擎运行模式: {mode === 'standard' ? '标准' : mode === 'overclocked' ? '超频' : '隐密'}
          </button>

          <button 
            onClick={() => setSystemOnline(!systemOnline)}
            className="text-on-surface-variant hover:text-error transition-colors flex items-center gap-1.5 outline-none cursor-pointer"
          >
            <Power className="w-3.5 h-3.5 text-outline-variant" />
            <span>{systemOnline ? '挂起引擎' : '唤醒引擎'}</span>
          </button>
        </nav>

        {/* Status Indicators */}
        <div className="flex items-center gap-4 text-outline select-none">
          {/* Notifications Button */}
          <button 
            onClick={() => {
              setNotificationCount(0);
              alert("正在检查局域网信道信号... 所有的物理和逻辑子系统均上报了极佳的运行日志。");
            }} 
            className="relative p-1 hover:text-primary transition-all active:scale-90"
          >
            <Bell className="w-5 h-5 text-outline-variant" />
            <AnimatePresence>
              {notificationCount > 0 && (
                <motion.span 
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  exit={{ scale: 0 }}
                  className="absolute top-0 right-0 w-4 h-4 bg-error text-on-error font-bold font-sans text-[9px] rounded-full flex items-center justify-center border border-surface"
                >
                  {notificationCount}
                </motion.span>
              )}
            </AnimatePresence>
          </button>

          {/* Lan Node Status */}
          <button 
            onClick={() => alert("深空网格集群: 全节点集群 A-Z 同步正常。\n底层互联延迟保持在名义常态。")}
            className="hover:text-primary transition-all active:scale-90"
          >
            <Network className="w-5 h-5 text-outline-variant text-outline-variant" />
          </button>
          
          {/* Main system shut state action icon */}
          <button 
            onClick={() => {
              if (confirm("是否确认关闭完整智能内核集群？这将导致所有后台 Spawn 智能控制进程紧急挂起。")) {
                setSystemOnline(false);
              }
            }}
            className="hover:text-error transition-all active:scale-90 text-outline-variant hover:text-error"
          >
            <Power className="w-5 h-5" />
          </button>
        </div>

        {/* User avatar indicator */}
        <button 
          onClick={handleProfileClick} 
          className="w-8 h-8 rounded-full bg-primary-container flex items-center justify-center overflow-hidden border border-primary/40 ml-2 hover:border-primary cursor-pointer active:scale-90 transition-all duration-300"
          title="验证管理员身份"
        >
          <img 
            className="w-full h-full object-cover rounded-full" 
            referrerPolicy="no-referrer"
            src={getProfileImage()} 
            alt="赛博安全管理员头像" 
          />
        </button>
      </div>
    </header>
  );
}
