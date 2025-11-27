import React, { useState, useRef } from 'react';
import { analyzeContent } from './services/geminiService';
import { AnalysisResponse, AppState } from './types';
import { ResultCard } from './components/ResultCard';
import { 
  ShieldAlert, 
  BookOpen, 
  Search, 
  MessageSquareText, 
  Quote, 
  FileText, 
  AlertTriangle, 
  Send,
  Upload,
  Loader2,
  X,
  Copy
} from 'lucide-react';

const App: React.FC = () => {
  const [input, setInput] = useState('');
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [appState, setAppState] = useState<AppState>(AppState.IDLE);
  const [result, setResult] = useState<AnalysisResponse | null>(null);
  const [errorMessage, setErrorMessage] = useState('');
  
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setSelectedImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const clearImage = () => {
    setSelectedImage(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() && !selectedImage) return;

    setAppState(AppState.ANALYZING);
    setErrorMessage('');
    setResult(null);

    try {
      const data = await analyzeContent(input, selectedImage || undefined);
      setResult(data);
      setAppState(AppState.SUCCESS);
    } catch (error: any) {
      setAppState(AppState.ERROR);
      setErrorMessage(error.message || 'خطایی در برقراری ارتباط با هوش مصنوعی رخ داد.');
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 font-sans pb-12">
      {/* Header */}
      <header className="bg-emerald-800 text-white shadow-lg sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <ShieldAlert className="w-8 h-8 text-emerald-300" />
            <div>
              <h1 className="text-xl font-bold">تحلیلگر هوشمند بصیرت</h1>
              <p className="text-xs text-emerald-200 opacity-90">دستیار مقابله با جنگ ترکیبی و شایعات</p>
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-6 max-w-3xl">
        
        {/* Input Section */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 mb-8">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                متن، لینک یا شبهه مورد نظر را وارد کنید:
              </label>
              <textarea
                value={input}
                onChange={(e) => setInput(e.target.value)}
                className="w-full p-4 border border-gray-300 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition-all min-h-[120px] resize-y"
                placeholder="مثال: متنی که در فضای مجازی دیده‌اید را اینجا کپی کنید..."
                dir="auto"
              />
            </div>

            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
              <div className="relative">
                <input 
                  type="file" 
                  accept="image/*"
                  className="hidden"
                  ref={fileInputRef}
                  onChange={handleImageUpload}
                />
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="flex items-center gap-2 px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg transition-colors text-sm"
                >
                  <Upload className="w-4 h-4" />
                  {selectedImage ? 'تغییر تصویر' : 'افزودن تصویر (اختیاری)'}
                </button>
              </div>
              
              {selectedImage && (
                <div className="relative inline-block">
                  <img src={selectedImage} alt="Preview" className="h-16 w-16 object-cover rounded-md border border-gray-300" />
                  <button 
                    type="button" 
                    onClick={clearImage}
                    className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-0.5 shadow-sm hover:bg-red-600"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </div>
              )}
            </div>

            <button
              type="submit"
              disabled={appState === AppState.ANALYZING || (!input && !selectedImage)}
              className="w-full bg-emerald-700 hover:bg-emerald-800 disabled:bg-gray-400 text-white font-bold py-3 px-6 rounded-xl transition-all flex items-center justify-center gap-2 shadow-md hover:shadow-lg transform active:scale-[0.99]"
            >
              {appState === AppState.ANALYZING ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  در حال تحلیل هوشمند...
                </>
              ) : (
                <>
                  <Send className="w-5 h-5" />
                  شروع تحلیل
                </>
              )}
            </button>
          </form>
        </div>

        {/* Error Message */}
        {appState === AppState.ERROR && (
          <div className="bg-red-50 border-r-4 border-red-500 p-4 rounded-lg mb-8 flex items-start gap-3">
            <AlertTriangle className="w-6 h-6 text-red-500 flex-shrink-0 mt-0.5" />
            <div>
              <h3 className="font-bold text-red-800">خطا در پردازش</h3>
              <p className="text-red-700 text-sm mt-1">{errorMessage}</p>
            </div>
          </div>
        )}

        {/* Results Section */}
        {appState === AppState.SUCCESS && result && (
          <div className="space-y-6 animate-fade-in">
            <div className="flex items-center gap-2 mb-4 border-b border-gray-200 pb-2">
              <FileText className="w-6 h-6 text-emerald-700" />
              <h2 className="text-xl font-bold text-gray-800">نتیجه تحلیل بصیرتی</h2>
            </div>

            {/* 1. Fact Check */}
            <ResultCard 
              title="۱. بررسی صحت و استناد تاریخی" 
              content={result.factCheck} 
              icon={Search}
              colorClass="bg-blue-600" 
            />

            {/* 2. Insult Check */}
            <ResultCard 
              title="۲. بررسی توهین به مقدسات" 
              content={result.insultCheck} 
              icon={AlertTriangle}
              colorClass="bg-red-600" 
            />

             {/* 3. Soft War Analysis */}
             <ResultCard 
              title="۳. تحلیل جنگ نرم و ناتوی فرهنگی" 
              content={result.softWarCheck} 
              icon={ShieldAlert}
              colorClass="bg-orange-600" 
            />

            {/* 4. Source Origin */}
            <ResultCard 
              title="۴. منبع‌شناسی و ریشه‌یابی" 
              content={result.sourceOrigin} 
              icon={Search}
              colorClass="bg-purple-600" 
            />

            {/* 5. Argument */}
            <ResultCard 
              title="۵. استدلال منطقی و کوبنده" 
              content={result.argument} 
              icon={BookOpen}
              colorClass="bg-emerald-600" 
              allowCopy
            />

            {/* 6. Suggested Comment - Highly prominent */}
            <div className="bg-gradient-to-br from-emerald-50 to-green-50 rounded-xl shadow-md border border-emerald-200 overflow-hidden mb-4 ring-2 ring-emerald-100">
              <div className="px-4 py-3 border-b border-emerald-200 flex items-center justify-between bg-emerald-100 bg-opacity-50">
                <div className="flex items-center gap-2">
                  <MessageSquareText className="w-5 h-5 text-emerald-800" />
                  <h3 className="font-bold text-emerald-800">۶. متن پیشنهادی برای پاسخ (کامنت)</h3>
                </div>
                <button 
                  onClick={() => {
                    navigator.clipboard.writeText(result.suggestedResponse);
                    alert('متن پاسخ کپی شد');
                  }}
                  className="text-emerald-700 hover:bg-emerald-200 p-1.5 rounded-lg transition-colors flex items-center gap-1 text-xs font-medium"
                >
                  <Copy className="w-4 h-4" />
                  <span>کپی متن</span>
                </button>
              </div>
              <div className="p-5 text-gray-800 leading-loose text-base border-l-4 border-emerald-500 bg-white">
                {result.suggestedResponse}
              </div>
            </div>

            {/* 7. Religious Quote */}
            <ResultCard 
              title="۷. کلام نور (آیه/حدیث/رهبری)" 
              content={result.religiousQuote} 
              icon={Quote}
              colorClass="bg-amber-500" 
            />

            <div className="text-center mt-8 text-sm text-gray-500">
              <p>تحلیل تولید شده توسط هوش مصنوعی با نظارت کاربر قابل استفاده است.</p>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default App;