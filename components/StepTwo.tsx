import React, { useState, useRef } from 'react';
import { ImageAsset, LoadingState } from '../types';
import { Upload, Check, Sparkles, Loader2 } from 'lucide-react';
import { fileToBase64 } from '../services/utils';
import { generateClothingImage } from '../services/geminiService';

interface StepTwoProps {
  presets: ImageAsset[];
  selectedId: string | null;
  onSelect: (asset: ImageAsset) => void;
  onAddNewAsset: (asset: ImageAsset) => void;
  personImage?: string; // Context from step 1
}

const StepTwo: React.FC<StepTwoProps> = ({ presets, selectedId, onSelect, onAddNewAsset, personImage }) => {
  const [prompt, setPrompt] = useState('');
  const [loading, setLoading] = useState<LoadingState>('idle');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      const base64 = await fileToBase64(file);
      const newAsset: ImageAsset = {
        id: `custom-c-${Date.now()}`,
        url: base64,
        type: 'clothing',
        label: '上传服饰'
      };
      onAddNewAsset(newAsset);
      onSelect(newAsset);
    } catch (err) {
      console.error("File upload failed", err);
    }
  };

  const handleGenerate = async () => {
    if (!prompt.trim()) return;
    setLoading('generating-clothes');
    try {
      const base64 = await generateClothingImage(prompt);
      const newAsset: ImageAsset = {
        id: `gen-c-${Date.now()}`,
        url: base64,
        type: 'clothing',
        label: prompt
      };
      onAddNewAsset(newAsset);
      onSelect(newAsset);
      setPrompt('');
    } catch (error) {
      alert("生成衣服失败，请重试");
    } finally {
      setLoading('idle');
    }
  };

  return (
    <div className="w-full max-w-3xl mx-auto">
      
      {/* Context Header */}
      {personImage && (
        <div className="flex items-center justify-center mb-6 opacity-70 hover:opacity-100 transition-opacity">
          <span className="text-sm text-gray-500 mr-3">当前人物:</span>
          <img src={personImage} alt="Selected Person" className="w-10 h-10 rounded-full object-cover border border-gray-300" />
        </div>
      )}

      <h2 className="text-xl font-bold text-gray-800 mb-4 text-center">选择、上传或生成服饰</h2>

      {/* AI Generation Input */}
      <div className="mb-8 flex gap-2">
        <input
          type="text"
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          placeholder="描述你想穿的衣服 (例如: 红色碎花复古连衣裙)"
          className="flex-1 px-4 py-3 rounded-xl border border-gray-200 focus:border-purple-500 focus:ring-2 focus:ring-purple-200 outline-none transition-all"
          disabled={loading !== 'idle'}
        />
        <button
          onClick={handleGenerate}
          disabled={loading !== 'idle' || !prompt.trim()}
          className="bg-gradient-to-r from-purple-500 to-indigo-600 text-white px-6 py-3 rounded-xl font-medium hover:shadow-lg active:scale-95 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
        >
          {loading === 'generating-clothes' ? <Loader2 className="animate-spin" /> : <Sparkles size={20} />}
          AI 生成
        </button>
      </div>
      
      {/* Grid */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        {/* Upload Button */}
        <div 
          onClick={() => fileInputRef.current?.click()}
          className="aspect-square rounded-xl border-2 border-dashed border-gray-300 bg-gray-50 hover:bg-gray-100 cursor-pointer flex flex-col items-center justify-center transition-colors group"
        >
          <Upload className="text-gray-400 mb-2 group-hover:scale-110 transition-transform" />
          <span className="text-xs font-medium text-gray-500">上传图片</span>
          <input 
            type="file" 
            ref={fileInputRef} 
            className="hidden" 
            accept="image/*" 
            onChange={handleFileUpload}
          />
        </div>

        {/* Presets & Generated */}
        {presets.map((preset) => (
          <div 
            key={preset.id}
            onClick={() => onSelect(preset)}
            className={`relative aspect-square rounded-xl overflow-hidden cursor-pointer transition-all shadow-sm bg-white ${
              selectedId === preset.id ? 'ring-4 ring-purple-500 ring-offset-2' : 'hover:shadow-md hover:-translate-y-1'
            }`}
          >
            <img src={preset.url} alt={preset.label} className="w-full h-full object-cover" />
            {selectedId === preset.id && (
              <div className="absolute inset-0 bg-purple-900/20 flex items-center justify-center">
                <div className="bg-purple-500 rounded-full p-1">
                  <Check className="text-white w-5 h-5" />
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default StepTwo;
