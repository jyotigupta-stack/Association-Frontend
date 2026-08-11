'use client';

import React, { useState, useEffect } from 'react';
import { ChevronDown, Loader2, CheckCircle2, AlertCircle, Save } from 'lucide-react';
import { apiFetch } from "@/app/lib/api";

// --- Sub-components ---

// Updated SelectField to support active selection and errors
const SelectField: React.FC<{ 
  label: string; 
  name: string;
  value: string; 
  options: string[];
  onChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
  error?: string;
}> = ({ label, name, value, options, onChange, error }) => (
  <div className="flex flex-col gap-2 flex-1">
    <label className="text-xs font-medium text-gray-500">{label}</label>
    <div className="relative">
      <select
        name={name}
        value={value}
        onChange={onChange}
        className={`w-full bg-gray-50 border rounded-xl p-3 text-xs outline-none appearance-none transition-all cursor-pointer ${
          error ? 'border-red-500 ring-1 ring-red-500/10' : 'border-gray-100 focus:border-black'
        } ${value ? 'text-gray-800' : 'text-gray-400'}`}
      >
        <option value="" disabled>Select Option</option>
        {options.map(opt => <option key={opt} value={opt}>{opt}</option>)}
      </select>
      <ChevronDown size={18} className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-300 pointer-events-none" />
    </div>
    {error && (
      <span className="text-[10px] text-red-500 font-medium flex items-center gap-1">
        <AlertCircle size={10} /> {error}
      </span>
    )}
  </div>
);

const SwitchField: React.FC<{ 
  label: string; 
  sub: string; 
  checked: boolean; 
  onChange: () => void 
}> = ({ label, sub, checked, onChange }) => (
  <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between py-4 gap-4 transition-all -mx-2 px-2 rounded-xl hover:bg-gray-50/50">
    <div className="flex-1 min-w-0">
      <h4 className="text-[15px] font-semibold text-gray-900 leading-tight">{label}</h4>
      <p className="text-xs text-gray-500 mt-1 leading-snug">{sub}</p>
    </div>
    <button 
      onClick={onChange}
      type="button"
      className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none flex-shrink-0 ${checked ? 'bg-indigo-500' : 'bg-gray-200'}`}
    >
      <span className={`inline-block h-5 w-5 transform rounded-full bg-white transition-transform ${checked ? 'translate-x-5' : 'translate-x-1'}`} />
    </button>
  </div>
);

// --- Main Page ---

export const AnalyticsPage: React.FC = () => {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const [formData, setFormData] = useState({
    defaultCameraSetup: "",
    videoQuality: "",
    frameRate: "",
    biomechanicsAnalysis: true,
    ballTracking: true,
    battingAndBowlingAnalysis: true,
    enableAutoInsights: true,
    enableAutoReplay: true
  });

  // 1. Fetch Data on mount
  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        const response = await apiFetch(`${process.env.NEXT_PUBLIC_Backend_URL}/association/settings`, {
          method: 'GET',
        });
        if (response.ok) {
          const data = await response.json();
          setFormData({
            defaultCameraSetup: data.defaultCameraSetup || "6 Cameras Enabled",
            videoQuality: data.videoQuality || "High (1080p)",
            frameRate: data.frameRate || "60 FPS",
            biomechanicsAnalysis: data.biomechanicsAnalysis ?? true,
            ballTracking: data.ballTracking ?? true,
            battingAndBowlingAnalysis: data.battingAndBowlingAnalysis ?? true,
            enableAutoInsights: data.enableAutoInsights ?? true,
            enableAutoReplay: data.enableAutoReplay ?? true
          });
        }
      } catch (error) {
        console.error("Failed to fetch analytics:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchAnalytics();
  }, []);

  // 2. Validation
  const validate = () => {
    const newErrors: Record<string, string> = {};
    if (!formData.defaultCameraSetup) newErrors.defaultCameraSetup = "Required";
    if (!formData.videoQuality) newErrors.videoQuality = "Required";
    if (!formData.frameRate) newErrors.frameRate = "Required";
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // 3. Save Logic
  const handleSaveChanges = async () => {
    if (!validate()) return;
    setSaving(true);
    setSaveSuccess(false);

    try {
      const response = await apiFetch(`${process.env.NEXT_PUBLIC_Backend_URL}/association/settings`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        setSaveSuccess(true);
        setTimeout(() => setSaveSuccess(false), 3000);
      }
    } catch (error) {
      console.error("Save error:", error);
    } finally {
      setSaving(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors(prev => ({ ...prev, [name]: "" }));
  };

  const toggleSetting = (key: keyof typeof formData) => {
    setFormData(prev => ({ ...prev, [key]: !prev[key as keyof typeof prev] }));
  };

  if (loading) return (
    <div className="flex h-screen items-center justify-center">
      <Loader2 className="w-8 h-8 animate-spin text-indigo-500" />
    </div>
  );

  return (
    <div className="flex-1 h-screen max-w-7xl mx-auto bg-white border border-gray-100 rounded-2xl p-8 shadow-xs flex flex-col">
      
      <div className="flex justify-between items-start mb-6">
        <div>
          <h1 className="text-xl font-semibold text-gray-900">Analytics Settings</h1>
          <p className="text-gray-400 text-xs mt-1 font-medium leading-tight">Improve Player Performance by Our Analytics Tips</p>
        </div>
        <div className="flex items-center gap-3">
          {saveSuccess && (
            <span className="text-green-600 text-xs font-medium flex items-center gap-1">
              <CheckCircle2 size={14} /> Saved Successfully
            </span>
          )}
          <button 
            onClick={handleSaveChanges}
            disabled={saving}
            className="bg-[#0D0D12] text-white px-1 md:px-5 md:py-2.5  py-1 rounded-lg text-xs md:text-sm font-semibold hover:bg-black transition-all flex items-center gap-2 disabled:opacity-70 active:scale-95"
          >
            {saving ? <Loader2 size={16} className="animate-spin" /> : <Save size={18} />}
            Save Changes
          </button>
        </div>
      </div>

      <div className="h-px bg-gray-50 w-full mt-2 mb-5" />

      <div className="flex-1 space-y-8 overflow-y-auto pr-2 -mr-2">
        <section>
          {/* Default Camera Setup */}
          <SelectField 
            label="Default Camera Setup" 
            name="defaultCameraSetup"
            value={formData.defaultCameraSetup} 
            onChange={handleChange}
            options={["1 Camera", "2 Cameras", "4 Cameras", "6 Cameras Enabled"]}
            error={errors.defaultCameraSetup}
          />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6 pb-2">
            <SelectField 
              label="Video Quality" 
              name="videoQuality"
              value={formData.videoQuality} 
              onChange={handleChange}
              options={["Standard (720p)", "High (1080p)", "Ultra (4K)"]}
              error={errors.videoQuality}
            />
            <SelectField 
              label="Frame Rate" 
              name="frameRate"
              value={formData.frameRate} 
              onChange={handleChange}
              options={["30 FPS", "60 FPS", "120 FPS (Slow-Mo)"]}
              error={errors.frameRate}
            />
          </div>
        </section>

        <div className="h-px bg-gray-100 w-full" />

        <section className="space-y-4 pb-4">
          <SwitchField 
            label="Enable Biomechanics Analysis" 
            sub="Track Body Movement, Angles & Posture" 
            checked={formData.biomechanicsAnalysis}
            onChange={() => toggleSetting('biomechanicsAnalysis')}
          />
          <div className="h-px bg-gray-50 w-full" />
          
          <SwitchField 
            label="Enable Ball Tracking" 
            sub="Analyze trajectory, pitch impact, and line/length" 
            checked={formData.ballTracking}
            onChange={() => toggleSetting('ballTracking')}
          />
          <div className="h-px bg-gray-50 w-full" />
          
          <SwitchField 
            label="Enable Batting & Bowling Analysis" 
            sub="Analyze Shot type, Swing angle, timing, Speed, Release Point" 
            checked={formData.battingAndBowlingAnalysis}
            onChange={() => toggleSetting('battingAndBowlingAnalysis')}
          />
          <div className="h-px bg-gray-50 w-full" />
          
          <SwitchField 
            label="Enable Auto Insight" 
            sub="Generate AI-based Performance Insights" 
            checked={formData.enableAutoInsights}
            onChange={() => toggleSetting('enableAutoInsights')}
          />
          <div className="h-px bg-gray-50 w-full" />
          
          <SwitchField 
            label="Enable Multiple Angle Replay" 
            sub="Allowing Switching Between 6 Camera angles" 
            checked={formData.enableAutoReplay}
            onChange={() => toggleSetting('enableAutoReplay')}
          />
        </section>
      </div>
    </div>
  );
};