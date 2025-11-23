import React from 'react';
import { AppStep } from '../types';
import { User, Shirt, Wand2, ChevronRight } from 'lucide-react';

interface TopVisualsProps {
  currentStep: AppStep;
  personUrl: string | null;
  clothingUrl: string | null;
  resultUrl: string | null;
}

const TopVisuals: React.FC<TopVisualsProps> = ({ currentStep, personUrl, clothingUrl, resultUrl }) => {
  
  const getCardClasses = (step: number) => {
    const isActive = currentStep === step;
    const isCompleted = currentStep > step || (step === 3 && resultUrl);
    
    let base = "relative aspect-[3/4] rounded-xl flex flex-col items-center justify-center overflow-hidden transition-all duration-500 border-2 shadow-sm ";
    
    if (isActive) {
      base += "border-indigo-500 ring-2 ring-indigo-100 scale-105 bg-white z-10 shadow-indigo-200 ";
    } else if (isCompleted) {
      base += "border-indigo-200 bg-indigo-50/50 grayscale-[0.1] ";
    } else {
      base += "border-gray-100 bg-gray-50/50 opacity-70 ";
    }
    
    return base;
  };

  const renderContent = (step: number, url: string | null, Icon: React.ElementType, label: string) => {
     if (url) {
         return <img src={url} alt={label} className="w-full h-full object-cover" />;
     }
     return (
         <div className="flex flex-col items-center text-gray-400 p-2 text-center">
             <Icon size={20} className="mb-1.5" />
             <span className="text-[10px] font-medium whitespace-nowrap text-gray-500">{label}</span>
         </div>
     );
  };

  return (
    <div className="w-full px-4 pt-4 pb-2 bg-white shadow-sm z-20 sticky top-14">
        <div className="max-w-lg mx-auto grid grid-cols-[1fr_auto_1fr_auto_1fr] items-center gap-2 md:gap-4">
            
            {/* Step 1 */}
            <div className={getCardClasses(1)}>
                {renderContent(1, personUrl, User, "选人")}
                <div className="absolute bottom-0 inset-x-0 bg-black/40 text-white text-[10px] text-center py-0.5 backdrop-blur-md font-medium">
                    1.人物
                </div>
            </div>

            <ChevronRight className={`w-4 h-4 transition-colors ${currentStep > 1 ? 'text-indigo-400' : 'text-gray-200'}`} />

            {/* Step 2 */}
            <div className={getCardClasses(2)}>
                {renderContent(2, clothingUrl, Shirt, "选衣")}
                <div className="absolute bottom-0 inset-x-0 bg-black/40 text-white text-[10px] text-center py-0.5 backdrop-blur-md font-medium">
                    2.服饰
                </div>
            </div>

            <ChevronRight className={`w-4 h-4 transition-colors ${currentStep > 2 ? 'text-indigo-400' : 'text-gray-200'}`} />

            {/* Step 3 */}
            <div className={getCardClasses(3)}>
                 {renderContent(3, resultUrl, Wand2, "生成")}
                 <div className="absolute bottom-0 inset-x-0 bg-black/40 text-white text-[10px] text-center py-0.5 backdrop-blur-md font-medium">
                    3.效果
                </div>
            </div>

        </div>
    </div>
  );
};

export default TopVisuals;