import React from 'react';
import { LoadingState } from '../types';
import { Wand2, Loader2, RotateCcw, Download } from 'lucide-react';

interface StepThreeProps {
  personUrl: string;
  clothingUrl: string;
  resultUrl: string | null;
  loading: LoadingState;
  onGenerate: () => void;
  onReset: () => void;
}

const StepThree: React.FC<StepThreeProps> = ({ 
  personUrl, 
  clothingUrl, 
  resultUrl, 
  loading, 
  onGenerate,
  onReset
}) => {
  return (
    <div className="w-full max-w-4xl mx-auto text-center">
      
      {!resultUrl ? (
        <div className="bg-white p-8 rounded-3xl shadow-xl border border-gray-100 max-w-lg mx-auto">
          <h2 className="text-2xl font-bold text-gray-800 mb-2">准备生成</h2>
          <p className="text-gray-500 mb-8">点击下方按钮，让 Nano Banana 为你施展魔法。</p>
          
          <div className="flex justify-center items-center gap-8 mb-8">
             <div className="relative w-20 h-20 rounded-full overflow-hidden border-2 border-gray-200">
               <img src={personUrl} className="w-full h-full object-cover" alt="Person" />
             </div>
             <div className="text-gray-300 text-2xl">+</div>
             <div className="relative w-20 h-20 rounded-full overflow-hidden border-2 border-gray-200">
               <img src={clothingUrl} className="w-full h-full object-cover" alt="Clothes" />
             </div>
          </div>

          <button
            onClick={onGenerate}
            disabled={loading !== 'idle'}
            className="w-full py-4 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-xl font-bold text-lg shadow-lg hover:shadow-indigo-500/30 active:scale-[0.98] transition-all flex justify-center items-center gap-3 disabled:opacity-70 disabled:cursor-not-allowed"
          >
            {loading === 'generating-tryon' ? (
              <>
                <Loader2 className="animate-spin" />
                正在生成中...
              </>
            ) : (
              <>
                <Wand2 />
                开始换装
              </>
            )}
          </button>
        </div>
      ) : (
        <div className="animate-fade-in">
           <h2 className="text-2xl font-bold text-gray-800 mb-6">换装完成!</h2>
           
           <div className="relative w-full max-w-md mx-auto aspect-[3/4] rounded-2xl overflow-hidden shadow-2xl mb-8 group">
             <img src={resultUrl} alt="Result" className="w-full h-full object-cover" />
             <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-4">
                <a 
                  href={resultUrl} 
                  download="ai-tryon-result.png"
                  className="p-3 bg-white rounded-full text-gray-800 hover:bg-gray-100 transition-colors"
                  title="Download"
                >
                  <Download size={24} />
                </a>
             </div>
           </div>

           <div className="flex justify-center gap-4">
             <button
              onClick={onReset}
              className="px-6 py-2 bg-gray-200 text-gray-700 rounded-full font-medium hover:bg-gray-300 transition-colors flex items-center gap-2"
             >
               <RotateCcw size={18} />
               再试一次
             </button>
           </div>
        </div>
      )}
    </div>
  );
};

export default StepThree;
