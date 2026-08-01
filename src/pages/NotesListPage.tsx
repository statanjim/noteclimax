import React, { useState, useMemo } from 'react';
import { Book } from '../types';
import { Search, Filter, BookOpen, Eye, ArrowRight, Sparkles, X, Check } from 'lucide-react';

interface NotesListPageProps {
  books: Book[];
  onNavigate: (route: string) => void;
  initialClassFilter?: string;
  initialSubjectFilter?: string;
  initialSearchQuery?: string;
}

export const NotesListPage: React.FC<NotesListPageProps> = ({
  books,
  onNavigate,
  initialClassFilter = 'all',
  initialSubjectFilter = 'all',
  initialSearchQuery = '',
}) => {
  const [searchQuery, setSearchQuery] = useState(initialSearchQuery);
  const [selectedClass, setSelectedClass] = useState<string>(initialClassFilter);
  const [selectedSubject, setSelectedSubject] = useState<string>(initialSubjectFilter);
  const [selectedType, setSelectedType] = useState<'all' | 'free' | 'premium'>('all');

  // Extract unique subjects from available books
  const availableSubjects = useMemo(() => {
    const set = new Set<string>();
    books.forEach(b => {
      if (b.subject) set.add(b.subject);
    });
    return Array.from(set);
  }, [books]);

  // Filter logic
  const filteredBooks = useMemo(() => {
    return books.filter((book) => {
      // Class level filter
      if (selectedClass !== 'all') {
        const targetLevel = parseInt(selectedClass, 10);
        if (targetLevel === 9) {
          if (book.class_level !== 9 && book.class_level !== 10) return false;
        } else if (targetLevel === 11) {
          if (book.class_level !== 11 && book.class_level !== 12) return false;
        } else if (book.class_level !== targetLevel) {
          return false;
        }
      }

      // Subject filter
      if (selectedSubject !== 'all' && book.subject !== selectedSubject) {
        return false;
      }

      // Type filter
      if (selectedType === 'free' && !book.is_free) return false;
      if (selectedType === 'premium' && book.is_free) return false;

      // Search query filter (matches title, subject, chapter, description)
      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase();
        const matchesTitle = book.title.toLowerCase().includes(query);
        const matchesSubject = book.subject.toLowerCase().includes(query);
        const matchesChapter = (book.chapter || '').toLowerCase().includes(query);
        const matchesDesc = book.description.toLowerCase().includes(query);
        if (!matchesTitle && !matchesSubject && !matchesChapter && !matchesDesc) {
          return false;
        }
      }

      return true;
    });
  }, [books, selectedClass, selectedSubject, selectedType, searchQuery]);

  const clearFilters = () => {
    setSearchQuery('');
    setSelectedClass('all');
    setSelectedSubject('all');
    setSelectedType('all');
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      
      {/* Header */}
      <div className="bg-gradient-to-r from-[#0E6B4D] to-[#0A523B] text-white p-6 sm:p-8 rounded-3xl shadow-lg space-y-2">
        <h1 className="text-2xl sm:text-4xl font-bold font-['Hind_Siliguri']">
          সকল নোটসমূহ (All Notes Portal)
        </h1>
        <p className="text-xs sm:text-sm text-emerald-100 max-w-2xl font-medium">
          আপনার পছন্দমতো শ্রেণী, বিষয় ও অধ্যায় ফিল্টার করে সম্পূর্ণ হ্যান্ডনোট ও প্রশ্ন ব্যাংক খুঁজে নিন।
        </p>
      </div>

      {/* FILTER BAR */}
      <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-4">
        
        {/* Search Input */}
        <div className="relative">
          <Search className="w-5 h-5 text-slate-400 absolute left-3.5 top-3" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="শিরোনাম, অধ্যায় বা কিওয়ার্ড দিয়ে সার্চ করুন (যেমন: কোয়ান্টাম সংখ্যা)..."
            className="w-full pl-10 pr-10 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#0E6B4D] focus:bg-white transition-all"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-3 top-3 text-slate-400 hover:text-slate-600"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* Dropdowns Filter Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-3 lg:grid-cols-4 gap-3 text-xs">
          
          {/* Class Filter */}
          <div>
            <label className="block text-slate-600 font-bold mb-1">শ্রেণী (Class Level):</label>
            <select
              value={selectedClass}
              onChange={(e) => setSelectedClass(e.target.value)}
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 font-semibold focus:outline-none focus:ring-2 focus:ring-[#0E6B4D]"
            >
              <option value="all">সকল শ্রেণী (All Classes)</option>
              <option value="6">ষষ্ঠ শ্রেণী (Class 6)</option>
              <option value="7">সপ্তম শ্রেণী (Class 7)</option>
              <option value="8">অষ্টম শ্রেণী (Class 8)</option>
              <option value="9">নবম-দশম শ্রেণী (SSC)</option>
              <option value="11">একাদশ-দ্বাদশ শ্রেণী (HSC)</option>
              <option value="12">ভর্তি পরীক্ষা (Admission)</option>
            </select>
          </div>

          {/* Subject Filter */}
          <div>
            <label className="block text-slate-600 font-bold mb-1">বিষয় (Subject):</label>
            <select
              value={selectedSubject}
              onChange={(e) => setSelectedSubject(e.target.value)}
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 font-semibold focus:outline-none focus:ring-2 focus:ring-[#0E6B4D]"
            >
              <option value="all">সকল বিষয় (All Subjects)</option>
              {availableSubjects.map((sub) => (
                <option key={sub} value={sub}>{sub}</option>
              ))}
            </select>
          </div>

          {/* Type Filter */}
          <div>
            <label className="block text-slate-600 font-bold mb-1">নোটের ধরন (Type):</label>
            <select
              value={selectedType}
              onChange={(e) => setSelectedType(e.target.value as any)}
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 font-semibold focus:outline-none focus:ring-2 focus:ring-[#0E6B4D]"
            >
              <option value="all">সব ধরনের (Free + Premium)</option>
              <option value="free">ফ্রি নোট (Free Only)</option>
              <option value="premium">প্রিমিয়াম নোট (Premium Only)</option>
            </select>
          </div>

          {/* Clear Filters Button */}
          <div className="flex items-end">
            <button
              onClick={clearFilters}
              className="w-full py-2 px-3 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold rounded-xl transition-colors flex items-center justify-center gap-1.5"
            >
              <X className="w-3.5 h-3.5" />
              <span>ফিল্টার রিসেট করুন</span>
            </button>
          </div>

        </div>

      </div>

      {/* RESULTS BAR */}
      <div className="flex items-center justify-between text-xs text-slate-500 font-medium px-1">
        <span>মোট <strong>{filteredBooks.length}</strong> টি নোট পাওয়া গেছে</span>
        {(selectedClass !== 'all' || selectedSubject !== 'all' || selectedType !== 'all' || searchQuery) && (
          <span className="text-[#0E6B4D] font-bold">ফিল্টার সচল রয়েছে</span>
        )}
      </div>

      {/* NOTES GRID */}
      {filteredBooks.length === 0 ? (
        <div className="bg-white rounded-2xl p-12 text-center border border-slate-200 space-y-4 max-w-lg mx-auto shadow-sm">
          <div className="w-14 h-14 rounded-full bg-slate-100 text-slate-400 flex items-center justify-center mx-auto text-2xl font-bold">
            🔍
          </div>
          <div className="space-y-1">
            <h3 className="text-lg font-bold text-slate-800 font-['Hind_Siliguri']">
              কোনো নোট খুঁজে পাওয়া যায়নি
            </h3>
            <p className="text-xs text-slate-500">
              আপনার সার্চ কিওয়ার্ড বা ফিল্টার পরিবর্তন করে আবার চেষ্টা করুন।
            </p>
          </div>
          <button
            onClick={clearFilters}
            className="px-4 py-2 bg-[#0E6B4D] text-white rounded-xl text-xs font-bold hover:bg-[#0A523B]"
          >
            সকল ফিল্টার মুছুন
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredBooks.map((book) => (
            <div
              key={book.id}
              onClick={() => onNavigate(`/notes/${book.slug}`)}
              className="bg-white rounded-2xl border border-slate-200 hover:border-[#0E6B4D] shadow-sm hover:shadow-xl transition-all duration-300 cursor-pointer overflow-hidden flex flex-col justify-between group"
            >
              <div>
                {/* Thumbnail Header */}
                <div className="relative h-44 bg-emerald-950 overflow-hidden">
                  <img
                    src={book.thumbnail_url || 'https://images.unsplash.com/photo-1456513080510-7bf3a84b82f8?w=600&q=80'}
                    alt={book.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 opacity-90"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/30 to-transparent"></div>

                  <div className="absolute top-3 left-3 flex gap-2">
                    <span className="px-2.5 py-1 rounded-md text-xs font-bold bg-[#0E6B4D] text-white shadow">
                      {book.class_label}
                    </span>
                  </div>

                  <div className="absolute top-3 right-3">
                    {book.is_free ? (
                      <span className="px-2.5 py-1 rounded-md text-xs font-bold bg-emerald-500 text-white shadow">
                        FREE PDF
                      </span>
                    ) : (
                      <span className="px-2.5 py-1 rounded-md text-xs font-bold bg-[#FFB400] text-[#0E6B4D] shadow">
                        ৳{book.price} প্রিমিয়াম
                      </span>
                    )}
                  </div>

                  <div className="absolute bottom-3 left-3 right-3 text-white">
                    <p className="text-xs text-emerald-300 font-semibold">
                      {book.subject} • {book.chapter || 'অধ্যায়'}
                    </p>
                  </div>
                </div>

                {/* Body */}
                <div className="p-5 space-y-2">
                  <h3 className="font-bold text-slate-900 text-base line-clamp-2 group-hover:text-[#0E6B4D] transition-colors font-['Hind_Siliguri'] leading-snug">
                    {book.title}
                  </h3>
                  <p className="text-xs text-slate-500 line-clamp-2 leading-relaxed">
                    {book.description}
                  </p>
                </div>
              </div>

              {/* Footer */}
              <div className="p-4 bg-slate-50 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
                <span className="flex items-center gap-1 font-medium">
                  <Eye className="w-3.5 h-3.5 text-slate-400" />
                  {book.views || 0} ভিউ
                </span>
                <span className="font-bold text-[#0E6B4D] group-hover:underline flex items-center gap-1">
                  নোট বিস্তারিত দেখুন →
                </span>
              </div>

            </div>
          ))}
        </div>
      )}

    </div>
  );
};
