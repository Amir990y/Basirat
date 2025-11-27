import React from 'react';
import { LucideIcon, Copy } from 'lucide-react';

interface ResultCardProps {
  title: string;
  content: string;
  icon: LucideIcon;
  colorClass: string;
  allowCopy?: boolean;
}

export const ResultCard: React.FC<ResultCardProps> = ({ title, content, icon: Icon, colorClass, allowCopy }) => {
  const handleCopy = () => {
    navigator.clipboard.writeText(content);
    alert('متن کپی شد');
  };

  return (
    <div className={`bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden mb-4 transition-all hover:shadow-md`}>
      <div className={`px-4 py-3 border-b border-gray-100 flex items-center justify-between ${colorClass} bg-opacity-10`}>
        <div className="flex items-center gap-2">
          <Icon className={`w-5 h-5 ${colorClass.replace('bg-', 'text-')}`} />
          <h3 className={`font-bold ${colorClass.replace('bg-', 'text-')}`}>{title}</h3>
        </div>
        {allowCopy && (
          <button 
            onClick={handleCopy} 
            className="text-gray-500 hover:text-emerald-700 transition-colors p-1 rounded-full hover:bg-gray-100"
            title="کپی متن"
          >
            <Copy className="w-4 h-4" />
          </button>
        )}
      </div>
      <div className="p-4 text-gray-700 leading-relaxed text-sm md:text-base whitespace-pre-wrap">
        {content}
      </div>
    </div>
  );
};
