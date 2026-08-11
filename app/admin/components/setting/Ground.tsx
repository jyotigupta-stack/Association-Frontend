'use client';

import React, { useState, useEffect } from 'react';
import { ChevronDown, MoveRight, Loader2, CheckCircle2, AlertCircle, Save } from 'lucide-react';
import { apiFetch } from "@/app/lib/api";

// --- Sub-components ---

const InputField: React.FC<{ 
  label: string; 
  name: string; 
  value: string | number; 
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void; 
  placeholder?: string;
  error?: string;
  readonly?: boolean 
}> = ({ label, name, value, onChange, placeholder = "", error, readonly = false }) => (
  <div className="flex flex-col gap-2 flex-1">
    <label className="text-xs font-medium text-gray-500">{label}</label>
    <input 
      name={name}
      value={value}
      onChange={onChange}
      readOnly={readonly}
      placeholder={placeholder}
      className={`w-full border rounded-xl p-3 text-xs outline-none transition-all ${
        error ? 'border-red-500 bg-red-50/30' : 'border-gray-100 bg-gray-50'
      } ${
        readonly ? 'text-gray-400 cursor-default' : 'text-gray-800 focus:border-black'
      }`}
    />
    {error && (
      <span className="text-[10px] text-red-500 font-medium flex items-center gap-1">
        <AlertCircle size={10} /> {error}
      </span>
    )}
  </div>
);

const SelectField: React.FC<{ 
  label: string; 
  name: string; 
  value: string; 
  options: string[]; 
  onChange: (e: React.ChangeEvent<HTMLSelectElement>) => void 
}> = ({ label, name, value, options, onChange }) => (
  <div className="flex flex-col gap-2 flex-1">
    <label className="text-xs font-medium text-gray-500">{label}</label>
    <div className="relative">
      <select
        name={name}
        value={value}
        onChange={onChange}
        className="w-full bg-gray-50 border border-gray-100 rounded-xl p-3 text-xs text-gray-800 outline-none appearance-none cursor-pointer focus:border-black"
      >
        {options.map(opt => <option key={opt} value={opt}>{opt}</option>)}
      </select>
      <ChevronDown size={18} className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
    </div>
  </div>
);

const SwitchField: React.FC<{ label: string; sub: string; checked: boolean; onChange: () => void }> = ({ label, sub, checked, onChange }) => (
  <div className="flex items-center justify-between py-2 gap-4">
    <div>
      <h4 className="text-[16px] font-semibold text-gray-900">{label}</h4>
      <p className="text-xs text-gray-500 mt-0.5">{sub}</p>
      <button className="flex items-center gap-1.5 mt-3 text-xs font-semibold text-gray-900 hover:text-indigo-600 transition-colors">
        See Details
        <MoveRight size={16} />
      </button>
    </div>
    <button 
      onClick={onChange}
      className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none flex-shrink-0 ${checked ? 'bg-indigo-500' : 'bg-gray-200'}`}
    >
      <span className={`inline-block h-5 w-5 transform rounded-full bg-white transition-transform ${checked ? 'translate-x-5' : 'translate-x-1'}`} />
    </button>
  </div>
);

// --- Main Page Component ---

export const GroundPage: React.FC = () => {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const [formData, setFormData] = useState({
    groundName: "",
    pitchType: "Hard Soil",
    boundarySize: "",
    straightBoundary: "" as string | number,
    sideBoundary: "" as string | number,
    enableGroundAnalytics: true
  });

  // 1. Fetch Data
  useEffect(() => {
    const fetchGroundData = async () => {
      try {
        const response = await apiFetch(`${process.env.NEXT_PUBLIC_Backend_URL}/association/settings`, {
          method: 'GET',
        });
        if (response.ok) {
          const data = await response.json();
          setFormData({
            groundName: data.groundName || "",
            pitchType: data.pitchType || "Hard Soil",
            boundarySize: data.boundarySize || "",
            straightBoundary: data.straightBoundary || "",
            sideBoundary: data.sideBoundary || "",
            enableGroundAnalytics: data.enableGroundAnalytics ?? true
          });
        }
      } catch (error) {
        console.error("Fetch error:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchGroundData();
  }, []);

  // 2. Validation
  const validate = () => {
    const newErrors: Record<string, string> = {};
    const numRegex = /^\d+(\.\d+)?$/;

    if (!formData.groundName.trim()) newErrors.groundName = "Ground name is required";
    
    if (formData.straightBoundary && !numRegex.test(String(formData.straightBoundary))) {
      newErrors.straightBoundary = "Must be a valid number";
    }
    if (formData.sideBoundary && !numRegex.test(String(formData.sideBoundary))) {
      newErrors.sideBoundary = "Must be a valid number";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0; 
  };

  // 3. Save Data
  const handleSaveChanges = async () => {
    if (!validate()) return;

    setSaving(true);
    try {
      const response = await apiFetch(`${process.env.NEXT_PUBLIC_Backend_URL}/association/settings`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          // Convert string inputs to floats for backend
          straightBoundary: parseFloat(String(formData.straightBoundary)) || 0,
          sideBoundary: parseFloat(String(formData.sideBoundary)) || 0
        }),
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

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors(prev => ({ ...prev, [name]: "" }));
  };

  if (loading) return (
    <div className="flex h-screen items-center justify-center">
      <Loader2 className="w-8 h-8 animate-spin text-indigo-500" />
    </div>
  );

  return (
    <div className="max-w-7xl h-screen mx-auto bg-white border border-gray-100 rounded-2xl p-8 shadow-xs overflow-y-auto">
      
      <div className="flex justify-between items-start mb-6 gap-2">
        <div>
          <h1 className="text-xl font-semibold text-gray-900">Ground Settings</h1>
          <p className="text-gray-400 text-xs mt-1 font-medium">Control how grounds behave in your system</p>
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
            className="bg-[#0D0D12] text-white px-2 py-2 md:px-5 md:py-2.5 rounded-lg md:text-sm text-xs font-semibold hover:bg-black transition-all flex items-center gap-2 disabled:opacity-70 active:scale-95"
          >
            {saving ? <Loader2 size={16} className="animate-spin" /> : <Save size={18}/>}
            Save Changes
          </button>
        </div>
      </div>

      <div className="h-px bg-gray-50 w-full mt-2 mb-8" />

      <div className="space-y-8 max-w-4xl">
        <section>
          <InputField 
            label="Default Ground Name" 
            name="groundName" 
            value={formData.groundName} 
            onChange={handleChange} 
            placeholder="e.g. Holkar Cricket Stadium"
            error={errors.groundName}
          />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
            <SelectField 
              label="Default Pitch Type" 
              name="pitchType"
              value={formData.pitchType} 
              onChange={handleChange}
              options={["Hard Soil", "Black Soil (Balanced)", "Green Grass", "Dusty"]} 
            />
            <InputField 
              label="Boundary Size (Average)" 
              name="boundarySize" 
              value={formData.boundarySize} 
              onChange={handleChange} 
              placeholder="e.g. 65 Meters (average)"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
            <InputField 
              label="Straight Boundaries (Meters)" 
              name="straightBoundary" 
              value={formData.straightBoundary} 
              onChange={handleChange} 
              placeholder="eg. 70"
              error={errors.straightBoundary}
            />
            <InputField 
              label="Side Boundaries (Meters)" 
              name="sideBoundary" 
              value={formData.sideBoundary} 
              onChange={handleChange} 
              placeholder="eg. 60"
              error={errors.sideBoundary}
            />
          </div>
        </section>

        <div className="h-px bg-gray-100 w-full" />

        <section>
          <SwitchField 
            label="Enable Ground Analytics" 
            sub="Automatically track and sync venue-specific performance data" 
            checked={formData.enableGroundAnalytics}
            onChange={() => setFormData(p => ({...p, enableGroundAnalytics: !p.enableGroundAnalytics}))}
          />
          <SwitchField
          label="Enable Ground Analytics"
          sub="Automatically track and sync venue-specific perfomance data"
          checked={formData.enableGroundAnalytics}
          onChange={()=>setFormData(p=>({...p,enableGroundAnalytics:!p.enableGroundAnalytics}))}
          />
        </section>
      </div>
    </div>
  );
};