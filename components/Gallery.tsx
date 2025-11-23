import React from 'react';
import { HistoryItem } from '../types';
import { Clock } from 'lucide-react';

interface GalleryProps {
  history: HistoryItem[];
  onSelectHistory: (item: HistoryItem) => void;
}

const Gallery: React.FC<GalleryProps> = ({ history, onSelectHistory }) => {
  if (history.length === 0) return null;

  return (
    <div className="w-full">
      <div className="flex items-center justify-between mb-2">
         <div className="flex items-center gap-1.5 text-gray-400 text-xs font-medium">
            <Clock size={12} />
            <span>最近生成</span>
         </div>
         <span className="text-[10px] text-gray-300">{history.length} 张</span>
      </div>
      
      <div className="flex gap-3 overflow-x-auto gallery-scroll pb-1 -mx-1 px-1">
        {history.map((item) => (
          <div 
            key={item.id} 
            onClick={() => onSelectHistory(item)}
            className="flex-shrink-0 w-14 h-20 rounded-lg overflow-hidden cursor-pointer border border-gray-200 relative active:scale-95 transition-transform"
          >
            <img src={item.resultUrl} alt="History" className="w-full h-full object-cover" />
          </div>
        ))}
      </div>
    </div>
  );
};

export default Gallery;