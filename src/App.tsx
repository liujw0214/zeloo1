/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { ActiveTab } from './types';
import Sidebar from './components/Sidebar';
import Header from './components/Header';
import DashboardView from './components/DashboardView';
import VaexView from './components/VaexView';
import HermesView from './components/HermesView';
import OpenClawView from './components/OpenClawView';
import HubMonitorView from './components/HubMonitorView';
import EvolutionView from './components/EvolutionView';
import SettingsView from './components/SettingsView';

export default function App() {
  // Main states
  const [activeTab, setActiveTab] = useState<ActiveTab>('dashboard');
  const [systemOnline, setSystemOnline] = useState<boolean>(true);
  const [systemLatency, setSystemLatency] = useState<number>(12);
  const [mode, setMode] = useState<'standard' | 'overclocked' | 'stealth'>('standard');
  const [notificationCount, setNotificationCount] = useState<number>(3);
  const [searchQuery, setSearchQuery] = useState<string>('');

  // Global synchronized stats
  const [stats, setStats] = useState({
    nodeCount: 42891,
    activeConnections: 156024,
    agentCount: 2,
    taskPercent: 20,
    todayCost: 142.85,
    reqPerSecond: 1204
  });

  const handleGlobalRefresh = () => {
    // Simulated live refresh jittering stats values
    setStats(prev => ({
      ...prev,
      activeConnections: prev.activeConnections + Math.floor(Math.random() * 20 - 10),
      todayCost: prev.todayCost + (Math.random() * 0.1),
      reqPerSecond: Math.floor(prev.reqPerSecond * (0.95 + Math.random() * 0.1))
    }));
    setNotificationCount(Math.min(9, notificationCount + 1));
    alert("全量神经节点及数字孪生状态已触发重新对齐。");
  };

  const renderActiveViewport = () => {
    switch (activeTab) {
      case 'dashboard':
        return (
          <DashboardView 
            setActiveTab={setActiveTab}
            systemOnline={systemOnline}
            systemLatency={systemLatency}
            stats={stats}
          />
        );
      case 'vaex':
        return (
          <VaexView 
            stats={stats}
            setStats={setStats}
            searchQuery={searchQuery}
          />
        );
      case 'hermes':
        return (
          <HermesView 
            stats={stats}
            setStats={setStats}
            searchQuery={searchQuery}
          />
        );
      case 'openclaw':
        return (
          <OpenClawView 
            stats={stats}
            setStats={setStats}
            searchQuery={searchQuery}
          />
        );
      case 'hub_monitor':
        return (
          <HubMonitorView 
            stats={stats}
            setStats={setStats}
            searchQuery={searchQuery}
          />
        );
      case 'evolution':
        return <EvolutionView />;
      case 'settings':
        return (
          <SettingsView 
            systemOnline={systemOnline}
            setSystemOnline={setSystemOnline}
            systemLatency={systemLatency}
            setSystemLatency={setSystemLatency}
            mode={mode}
            setMode={setMode}
            stats={stats}
            setStats={setStats}
          />
        );
      default:
        return (
          <div className="flex items-center justify-center h-96 text-outline-variant font-mono">
            Subsystem viewport loading or unavailable...
          </div>
        );
    }
  };

  return (
    <div className="min-h-screen bg-background text-on-surface select-none">
      
      {/* Absolute background grid */}
      <div className="fixed inset-0 bg-[radial-gradient(circle_at_bottom_left,#121622_0%,#0e111a_100%)] z-0 pointer-events-none" />
      <div className="fixed inset-0 bg-[linear-gradient(rgba(255,255,255,0.005)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.005)_1px,transparent_1px)] bg-[size:32px_32px] opacity-40 z-0 pointer-events-none" />

      {/* Main layout container */}
      <div className="relative z-10">
        
        {/* Sidebar Left Component */}
        <Sidebar 
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          systemOnline={systemOnline}
          setSystemOnline={setSystemOnline}
          systemLatency={systemLatency}
        />

        {/* Global Header Top Component */}
        <Header 
          activeTab={activeTab}
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          onRefresh={handleGlobalRefresh}
          systemOnline={systemOnline}
          setSystemOnline={setSystemOnline}
          mode={mode}
          setMode={setMode}
          notificationCount={notificationCount}
          setNotificationCount={setNotificationCount}
        />

        {/* Viewport content area */}
        <main className="ml-64 pt-16 min-h-[calc(100vh-64px)] overflow-x-hidden">
          <div className="p-6 md:p-8 max-w-7xl mx-auto">
            {renderActiveViewport()}
          </div>
        </main>

      </div>
    
    </div>
  );
}

