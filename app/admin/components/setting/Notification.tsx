'use client';

import React, { useState, useEffect } from 'react';
import { MoveRight, Loader2, CheckCircle2, Save } from 'lucide-react';

// Adjusted interface to match your Backend Entity Columns
interface NotificationSettings {
  liveMatchAlerts: boolean;
  matchChangeAlerts: boolean;
  systemAlerts: boolean;
  playerInsights: boolean;
  matchAlerts: boolean;
}

interface NotificationItem {
  id: keyof NotificationSettings; 
  title: string;
  sub: string;
}

interface SwitchFieldProps extends Omit<NotificationItem, 'id'> {
  checked: boolean;
  onChange: () => void;
}

// --- Sub-components ---

const SwitchField: React.FC<SwitchFieldProps> = ({ title, sub, checked, onChange }) => (
  <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 py-4 sm:py-3 transition-colors rounded-xl px-2 -mx-2 hover:bg-gray-50/50">
    <div className="flex-1 min-w-0">
      <h4 className="text-[16px] font-semibold text-gray-900 leading-tight truncate">{title}</h4>
      <p className="text-xs text-gray-400 mt-1 leading-snug">{sub}</p>
      
      <button className="flex items-center gap-1.5 mt-3 text-xs font-semibold text-gray-900 hover:text-blue-600 transition-colors">
        See Details
        <MoveRight size={14} />
      </button>
    </div>
    
    <button 
      onClick={onChange}
      type="button"
      className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none flex-shrink-0 ${checked ? 'bg-[#6379FC]' : 'bg-gray-200'}`}
    >
      <span className={`inline-block h-5 w-5 transform rounded-full bg-white shadow-sm ring-0 transition-transform ${checked ? 'translate-x-5' : 'translate-x-1'}`} />
    </button>
  </div>
);

// Mapped to your @Column decorators
const notificationItems: NotificationItem[] = [
  { 
    id: 'liveMatchAlerts', 
    title: "Live Match Alerts", 
    sub: "Get notified when a match starts or goes live" 
  },
  { 
    id: 'matchChangeAlerts', 
    title: "Match Changes", 
    sub: "Updates about schedule or venue changes" 
  },
  { 
    id: 'playerInsights', 
    title: "Player Insights", 
    sub: "AI-based performance insights and analytics" 
  },
  { 
    id: 'systemAlerts', 
    title: "System Alerts", 
    sub: "Errors, data sync issues, or system updates." 
  },
  { 
    id: 'matchAlerts', 
    title: "Score Updates", 
    sub: "Receive updates for runs, wickets, and key events." 
  },
];

export const NotificationSettingPage: React.FC = () => {
  const [settings, setSettings] = useState<NotificationSettings>({
    liveMatchAlerts: true,
    matchChangeAlerts: true,
    systemAlerts: true,
    playerInsights: true,
    matchAlerts: true,
  });

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);

  // 1. Fetch Settings from Association route
  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_Backend_URL}/association/settings`, {
          method: 'GET',
          credentials: 'include',
        });
        if (response.ok) {
          const data = await response.json();
          // Map data strictly to the notification columns
          setSettings({
            liveMatchAlerts: data.liveMatchAlerts ?? true,
            matchChangeAlerts: data.matchChangeAlerts ?? true,
            systemAlerts: data.systemAlerts ?? true,
            playerInsights: data.playerInsights ?? true,
            matchAlerts: data.matchAlerts ?? true,
          });
        }
      } catch (error) {
        console.error("Failed to fetch notification settings:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchSettings();
  }, []);

  // 2. Save Settings
  const handleSaveChanges = async () => {
    setSaving(true);
    setSaveSuccess(false);
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_Backend_URL}/association/settings`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(settings),
        credentials: 'include',
      });

      if (response.ok) {
        setSaveSuccess(true);
        setTimeout(() => setSaveSuccess(false), 3000);
      }
    } catch (error) {
      console.error("Failed to save notification settings:", error);
    } finally {
      setSaving(false);
    }
  };

  const toggleSetting = (id: keyof NotificationSettings) => {
    setSettings(prev => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-[#6379FC]" />
      </div>
    );
  }

  return (
    <div className="max-w-7xl h-screen mx-auto bg-white border border-gray-100 rounded-3xl p-8 shadow-xs overflow-y-auto">
      
      {/* Header Section */}
      <div className="flex justify-between items-start mb-6 gap-2">
        <div>
          <h1 className="text-xl font-bold text-gray-900">Notifications</h1>
          <p className="text-xs text-gray-400 mt-1">Manage your alert preferences and system updates.</p>
        </div>
        <div className="flex items-center gap-3">
          {saveSuccess && (
            <span className="text-green-600 text-xs font-medium flex items-center gap-1 animate-in fade-in slide-in-from-right-2">
              <CheckCircle2 size={14} /> Saved Successfully 
            </span>
          )}
          <button 
            onClick={handleSaveChanges}
            disabled={saving}
            className="bg-[#0D0D12] text-white px-1 md:px-5 py-1 md:py-2.5 rounded-lg text-sm font-semibold hover:bg-black transition-all flex items-center gap-2 disabled:opacity-70 active:scale-95"
          >
            {saving ? <Loader2 size={16} className="animate-spin" /> : <Save size={18}/>}
            Save Changes
          </button>
        </div>
      </div>

      <div className="h-px bg-gray-50 w-full mt-2 mb-8" />

      {/* Content Area */}
      <div className="space-y-6">
        {notificationItems.map((item, index) => (
          <React.Fragment key={item.id}>
            <SwitchField 
              title={item.title} 
              sub={item.sub} 
              checked={settings[item.id]}
              onChange={() => toggleSetting(item.id)}
            />
            
            {index < notificationItems.length - 1 && (
              <div className="h-px bg-gray-100 w-full" />
            )}
          </React.Fragment>
        ))}
      </div>
    </div>
  );
};