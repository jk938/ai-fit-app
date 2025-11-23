import React, { useRef } from 'react';
import { ImageAsset } from '../types';
import { Upload, Check, User } from 'lucide-react';
import { fileToBase64 } from '../services/utils';

interface StepOneProps {
  presets: ImageAsset[];
  selectedId: string | null;
  onSelect: (asset: ImageAsset) => void;
  onAddNew?: (asset: ImageAsset) => void; // Added optional prop for consistency
}

const StepOne: React.FC<StepOneProps> = ({ presets, selectedId, onSelect, onAddNew }) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      const base64 = await fileToBase64(file);
      const newAsset: ImageAsset = {
        id: `custom-p-${Date.now()}`,
        url: base64,
        type: 'person',
        label: '上传照片'
      };
      
      if (onAddNew) {
        onAddNew(newAsset);
      } else {
        onSelect(newAsset);
      }
    } catch (err) {
      console.error("File upload failed", err);
      alert("图片上传失败");
    }
  };

  return (
    <div className="w-full mx-auto">
      <h2 className="text-lg font-bold text-gray-800 mb-4 flex items-center">
        <div className="w-1 h-5 bg-indigo-500 rounded-full mr-2"></div>
        选择模特
      </h2>
      
      <div className="grid grid-cols-2 gap-3 md:grid-cols-3">
        {/* Upload Button */}
        <div 
          onClick={() => fileInputRef.current?.click()}
          className="aspect-[3/4] rounded-xl border-2 border-dashed border-indigo-200 bg-indigo-50/50 hover:bg-indigo-100 cursor-pointer flex flex-col items-center justify-center transition-all active:scale-95"
        >
          <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center shadow-sm mb-2">
             <Upload className="text-indigo-500 w-5 h-5" />
          </div>
          <span className="text-xs font-medium text-indigo-600">上传照片</span>
          <input 
            type="file" 
            ref={fileInputRef} 
            className="hidden" 
            accept="image/*" 
            onChange={handleFileUpload}
          />
        </div>

        {/* Presets */}
        {presets.map((preset) => (
          <div 
            key={preset.id}
            onClick={() => onSelect(preset)}
            className={`relative aspect-[3/4] rounded-xl overflow-hidden cursor-pointer transition-all active:scale-95 ${
              selectedId === preset.id ? 'ring-2 ring-indigo-500 ring-offset-1 shadow-md' : 'border border-gray-100'
            }`}
          >
            <img src={preset.url} alt={preset.label} className="w-full h-full object-cover" />
            {selectedId === preset.id && (
              <div className="absolute inset-0 bg-black/20 flex items-center justify-center">
                <div className="bg-indigo-500 rounded-full p-1 shadow-sm">
                  <Check className="text-white w-4 h-4" />
                </div>
              </div>
            )}
            {/* Label overlay for clarity */}
             <div className="absolute bottom-0 w-full bg-gradient-to-t from-black/60 to-transparent p-2 pt-6">
                 <p className="text-[10px] text-white truncate text-center opacity-90">{preset.label}</p>
             </div>
          </div>
        ))}
      </div>
      
      <p className="text-xs text-gray-400 mt-6 text-center">
        上传清晰的全身正面照片效果最佳
      </p>
    </div>
  );
};

export default StepOne;