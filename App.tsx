import React, { useState, useEffect } from 'react';
import { AppStep, ImageAsset, LoadingState, HistoryItem } from './types';
import { PRESET_PERSONS, PRESET_CLOTHES } from './constants';
import TopVisuals from './components/TopVisuals';
import StepOne from './components/StepOne';
import StepTwo from './components/StepTwo';
import StepThree from './components/StepThree';
import Gallery from './components/Gallery';
import { generateTryOn } from './services/geminiService';
import { ChevronRight, ChevronLeft, Home, RotateCcw, Download, Share2 } from 'lucide-react';

const App: React.FC = () => {
  const [step, setStep] = useState<AppStep>(AppStep.PersonSelection);
  
  // Assets
  const [personList, setPersonList] = useState<ImageAsset[]>(PRESET_PERSONS);
  const [clothingList, setClothingList] = useState<ImageAsset[]>(PRESET_CLOTHES);
  
  // Selections
  const [selectedPerson, setSelectedPerson] = useState<ImageAsset | null>(null);
  const [selectedClothing, setSelectedClothing] = useState<ImageAsset | null>(null);
  const [generatedResult, setGeneratedResult] = useState<string | null>(null);
  
  // State
  const [loading, setLoading] = useState<LoadingState>('idle');
  const [history, setHistory] = useState<HistoryItem[]>([]);
  
  // PWA Install Prompt
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const [isInstallable, setIsInstallable] = useState(false);

  useEffect(() => {
    const handler = (e: any) => {
      e.preventDefault();
      setDeferredPrompt(e);
      setIsInstallable(true);
    };
    window.addEventListener('beforeinstallprompt', handler);
    return () => window.removeEventListener('beforeinstallprompt', handler);
  }, []);

  const handleInstallClick = async () => {
    if (!deferredPrompt) return;
    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    if (outcome === 'accepted') {
      setDeferredPrompt(null);
      setIsInstallable(false);
    }
  };

  const handleShare = async () => {
    try {
      await navigator.clipboard.writeText(window.location.href);
      alert("链接已复制！请发送给用户，让他们在浏览器中打开并添加到主屏幕。");
    } catch (err) {
      console.error('Failed to copy: ', err);
    }
  };

  // Load from LocalStorage on mount
  useEffect(() => {
    const loadAssets = (key: string, setter: React.Dispatch<React.SetStateAction<ImageAsset[]>>) => {
      const stored = localStorage.getItem(key);
      if (stored) {
        try {
          const parsed = JSON.parse(stored);
          if (Array.isArray(parsed)) {
             setter(prev => {
               // Merge and dedup based on ID
               const existingIds = new Set(prev.map(i => i.id));
               const newItems = parsed.filter(i => !existingIds.has(i.id));
               return [...newItems, ...prev];
             });
          }
        } catch (e) {
          console.error(`Failed to load ${key}`, e);
        }
      }
    };

    loadAssets('custom_persons', setPersonList);
    loadAssets('custom_clothes', setClothingList);
    
    // Load history
    const storedHistory = localStorage.getItem('tryon_history');
    if (storedHistory) {
      try {
        setHistory(JSON.parse(storedHistory));
      } catch(e) {}
    }
  }, []);

  // Handlers with persistence
  const handleAddPerson = (asset: ImageAsset) => {
    setPersonList(prev => {
      const updated = [asset, ...prev];
      const customItems = updated.filter(i => i.id.startsWith('custom-'));
      localStorage.setItem('custom_persons', JSON.stringify(customItems));
      return updated;
    });
  };

  const handleAddClothing = (asset: ImageAsset) => {
    setClothingList(prev => {
      const updated = [asset, ...prev];
      // Save items that are custom uploads or generated
      const customItems = updated.filter(i => i.id.startsWith('custom-') || i.id.startsWith('gen-'));
      localStorage.setItem('custom_clothes', JSON.stringify(customItems));
      return updated;
    });
  };

  const handleNext = () => {
    if (step === AppStep.PersonSelection && selectedPerson) {
      setStep(AppStep.ClothingSelection);
    } else if (step === AppStep.ClothingSelection && selectedClothing) {
      setStep(AppStep.Generation);
    }
  };

  const handleBack = () => {
    if (step > 1) setStep(step - 1);
  };

  // Helper for auto-advancing steps with a slight delay for visual feedback
  const autoAdvanceStep = (targetStep: AppStep) => {
    setTimeout(() => {
      setStep(targetStep);
    }, 600);
  };

  const handleTryOn = async () => {
    if (!selectedPerson || !selectedClothing) return;
    
    setLoading('generating-tryon');
    try {
      const resultBase64 = await generateTryOn(selectedPerson.url, selectedClothing.url);
      setGeneratedResult(resultBase64);
      
      // Add to history
      const newItem: HistoryItem = {
        id: Date.now().toString(),
        personUrl: selectedPerson.url,
        clothingUrl: selectedClothing.url,
        resultUrl: resultBase64,
        timestamp: Date.now()
      };
      
      const updatedHistory = [newItem, ...history];
      setHistory(updatedHistory);
      localStorage.setItem('tryon_history', JSON.stringify(updatedHistory.slice(0, 50))); // Keep last 50
    } catch (error: any) {
      console.error("Full Error:", error);
      let msg = "生成失败，请重试。";
      if (error.message) {
        msg += ` 错误信息: ${error.message}`;
      }
      if (error.toString().includes('Failed to fetch')) {
          msg = "网络请求失败。可能是跨域(CORS)问题导致无法下载预设图片，请尝试上传您自己的本地图片。";
      }
      alert(msg);
    } finally {
      setLoading('idle');
    }
  };

  const handleReset = () => {
    setGeneratedResult(null);
    setStep(AppStep.PersonSelection);
    setSelectedPerson(null);
    setSelectedClothing(null);
  };

  const handleHistorySelect = (item: HistoryItem) => {
    const person: ImageAsset = { id: 'hist-p', url: item.personUrl, type: 'person' };
    const clothing: ImageAsset = { id: 'hist-c', url: item.clothingUrl, type: 'clothing' };
    setSelectedPerson(person);
    setSelectedClothing(clothing);
    setGeneratedResult(item.resultUrl);
    setStep(AppStep.Generation);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 font-sans text-slate-800 select-none">
      
      {/* App Header - Mobile Style */}
      <header className="bg-white sticky top-0 z-50 border-b border-gray-100 shadow-sm">
        <div className="px-4 h-14 flex items-center justify-between relative">
          <div className="w-14 flex justify-start">
             {(step > 1 || generatedResult) && (
                <button onClick={handleReset} className="p-2 -ml-2 text-gray-500 hover:text-indigo-600">
                    <Home size={20} />
                </button>
             )}
          </div>
          
          <h1 className="text-lg font-bold text-slate-900 tracking-tight">
            AI 换装室
          </h1>
          
          <div className="w-14 flex justify-end gap-1">
            <button 
              onClick={handleShare}
              className="p-2 text-gray-500 hover:bg-gray-100 rounded-full"
              title="分享链接"
            >
              <Share2 size={20} />
            </button>
            
            {isInstallable && (
              <button 
                onClick={handleInstallClick}
                className="p-2 -mr-2 text-indigo-600 hover:bg-indigo-50 rounded-full animate-pulse"
                title="安装应用"
              >
                <Download size={20} />
              </button>
            )}
          </div>
        </div>
      </header>

      {/* Top Visual Area - Steps Indicator */}
      <TopVisuals 
        currentStep={step}
        personUrl={selectedPerson?.url || null}
        clothingUrl={selectedClothing?.url || null}
        resultUrl={generatedResult}
      />

      {/* Main Content Area */}
      <main className="flex-1 container mx-auto px-4 pt-6 pb-32 w-full max-w-md md:max-w-2xl">
        <div className="transition-all duration-300 ease-in-out">
          {step === AppStep.PersonSelection && (
            <div className="animate-fade-in">
              <StepOne 
                presets={personList} 
                selectedId={selectedPerson?.id || null}
                onSelect={(asset) => {
                    setSelectedPerson(asset);
                    autoAdvanceStep(AppStep.ClothingSelection);
                }}
                onAddNew={(asset) => {
                  handleAddPerson(asset);
                  setSelectedPerson(asset);
                  autoAdvanceStep(AppStep.ClothingSelection);
                }}
              />
            </div>
          )}
          
          {step === AppStep.ClothingSelection && (
            <div className="animate-fade-in">
              <StepTwo 
                presets={clothingList}
                selectedId={selectedClothing?.id || null}
                onSelect={(asset) => {
                    setSelectedClothing(asset);
                    autoAdvanceStep(AppStep.Generation);
                }}
                onAddNewAsset={(asset) => {
                  handleAddClothing(asset);
                  setSelectedClothing(asset);
                  autoAdvanceStep(AppStep.Generation);
                }}
                personImage={selectedPerson?.url}
              />
            </div>
          )}

          {step === AppStep.Generation && selectedPerson && selectedClothing && (
            <div className="animate-fade-in">
              <StepThree 
                personUrl={selectedPerson.url}
                clothingUrl={selectedClothing.url}
                resultUrl={generatedResult}
                loading={loading}
                onGenerate={handleTryOn}
                onReset={handleReset}
              />
            </div>
          )}
        </div>
      </main>

      {/* Bottom Navigation / Action Bar */}
      <div className="fixed bottom-0 left-0 w-full bg-white border-t border-gray-200 pb-safe z-40 shadow-[0_-4px_10px_rgba(0,0,0,0.03)]">
        <div className="max-w-md mx-auto px-4 py-3">
          
          {/* Main Action Buttons */}
          <div className="flex justify-between items-center gap-4">
            {step < 3 ? (
              <>
                <button 
                  onClick={handleBack}
                  disabled={step === 1 || loading !== 'idle'}
                  className={`p-3 rounded-full transition-colors border border-transparent ${
                    step === 1 ? 'text-gray-200' : 'text-gray-600 hover:bg-gray-100 border-gray-100'
                  }`}
                >
                  <ChevronLeft size={24} />
                </button>

                <button 
                  onClick={handleNext}
                  disabled={(step === 1 && !selectedPerson) || (step === 2 && !selectedClothing)}
                  className="flex-1 flex items-center justify-center h-12 bg-indigo-600 text-white rounded-full font-bold shadow-lg shadow-indigo-200 hover:bg-indigo-700 hover:shadow-indigo-300 disabled:opacity-50 disabled:shadow-none transition-all active:scale-[0.97]"
                >
                  <span className="mr-1">下一步</span>
                  <ChevronRight size={20} />
                </button>
              </>
            ) : (
              <div className="w-full">
                 <button 
                  onClick={handleReset}
                  className="w-full flex items-center justify-center h-12 bg-gray-900 text-white rounded-full font-medium shadow-lg hover:bg-black transition-all active:scale-[0.98]"
                >
                  <RotateCcw size={18} className="mr-2" />
                  开始新的换装
                </button>
              </div>
            )}
          </div>
          
          {/* Gallery Preview (Mini) */}
          <div className="mt-3 pt-2 border-t border-gray-100">
             <Gallery history={history} onSelectHistory={handleHistorySelect} />
          </div>

        </div>
      </div>
    </div>
  );
};

export default App;