import React, { useState } from 'react';
import { Book } from '../types';
import { 
  BookOpen, Search, Sparkles, ArrowRight, ShieldCheck, 
  FileText, CheckCircle2, Eye, Download, Lock, Star, GraduationCap, Flame
} from 'lucide-react';
import { checkIsAdminEmail } from '../lib/supabaseClient';

interface HomePageProps {
  books: Book[];
  onNavigate: (route: string) => void;
  currentUser: { email: string; full_name?: string } | null;
  onOpenSetupModal: () => void;
}

const CLASS_CARDS = [
  { level: 6, label: "ষষ্ঠ শ্রেণী", sub: "Class 6 Notes", color: "from-emerald-600 to-teal-700", icon: "🌱" },
  { level: 7, label: "সপ্তম শ্রেণী", sub: "Class 7 Notes", color: "from-teal-600 to-cyan-700", icon: "🌿" },
  { level: 8, label: "অষ্টম শ্রেণী", sub: "Class 8 Notes (JSC)", color: "from-cyan-600 to-blue-700", icon: "📘" },
  { level: 9, label: "নবম-দশম শ্রেণী", sub: "SSC Board Notes", color: "from-[#0E6B4D] to-emerald-800", icon: "🎯" },
  { level: 11, label: "একাদশ-দ্বাদশ শ্রেণী", sub: "HSC Board Notes", color: "from-[#0E6B4D] to-emerald-900", icon: "🎓" },
  { level: 12, label: "ভর্তি পরীক্ষা (Admission)", sub: "Varsity & Medical", color: "from-emerald-700 to-amber-700", icon: "🚀" }
];

export const HomePage: React.FC<HomePageProps> = ({
  books,
  onNavigate,
  currentUser,
  onOpenSetupModal,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const isAdmin = checkIsAdminEmail(currentUser?.email);

  // Count books per class
  const getCountForClass = (level: number) => {
    if (level === 9) return books.filter(b => b.class_level === 9 || b.class_level === 10).length;
    if (level === 11) return books.filter(b => b.class_level === 11 || b.class_level === 12).length;
    return books.filter(b => b.class_level === level).length;
  };

  const featuredBooks = books.filter(b => b.is_featured);
  const totalViews = books.reduce((acc, curr) => acc + (curr.views || 0), 0);
  const freeBooksCount = books.filter(b => b.is_free).length;

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      onNavigate(`/notes?search=${encodeURIComponent(searchQuery.trim())}`);
    } else {
      onNavigate('/notes');
    }
  };

  return (
    <div className="space-y-12 pb-16">
      
      {/* HERO SECTION */}
      <section className="relative overflow-hidden bg-gradient-to-b from-[#0E6B4D] via-[#094733] to-[#0A523B] text-white pt-12 pb-20 px-4 sm:px-6 lg:px-8 shadow-inner">
        
        {/* Decorative Grid */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff0a_1px,transparent_1px),linear-gradient(to_bottom,#ffffff0a_1px,transparent_1px)] bg-[size:24px_24px]"></div>
        
        <div className="relative max-w-5xl mx-auto text-center space-y-6">
          
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#FFB400]/20 border border-[#FFB400]/40 text-[#FFB400] text-xs font-bold tracking-wide shadow-sm">
            <Sparkles className="w-4 h-4" />
            <span>NoteClimax Digital Notes Portal • ২০২৬ সংস্করণ</span>
          </div>

          {/* Title */}
          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black tracking-tight leading-tight text-white font-['Hind_Siliguri']">
            ক্লাস ৬ থেকে HSC — সব নোট এক জায়গায়, <span className="text-[#FFB400] underline decoration-[#FFB400]/40 underline-offset-8">সম্পূর্ণ ফ্রি</span>
          </h1>

          <p className="max-w-3xl mx-auto text-base sm:text-lg text-emerald-100 font-medium leading-relaxed">
            বাংলাদেশের ষষ্ঠ শ্রেণী থেকে শুরু করে এস.এস.সি ও এইচ.এস.সি পরীক্ষার্থীদের জন্য ১০০% নির্ভুল হ্যান্ডনোট, বোর্ড প্রশ্ন সমাধান ও সাজেশনের জন্য নির্ভরযোগ্য ই-লার্নিং প্লাটফর্ম।
          </p>

          {/* Hero Search Box */}
          <form onSubmit={handleSearchSubmit} className="max-w-2xl mx-auto pt-2">
            <div className="relative flex items-center bg-white rounded-2xl shadow-2xl p-2 border-2 border-emerald-300 focus-within:ring-4 focus-within:ring-[#FFB400]/40 transition-all">
              <Search className="w-5 h-5 text-slate-400 ml-3 shrink-0" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="বিষয়, অধ্যায় বা নোটের শিরোনাম দিয়ে খুঁজুন (যেমন: পদার্থবিজ্ঞান)..."
                className="w-full px-3 py-2 text-slate-800 placeholder-slate-400 text-sm font-medium focus:outline-none"
              />
              <button
                type="submit"
                className="px-6 py-3 bg-[#0E6B4D] hover:bg-[#0A523B] text-white font-bold rounded-xl text-sm transition-all shadow-md shrink-0 flex items-center gap-1.5"
              >
                <span>খুঁজুন</span>
                <ArrowRight className="w-4 h-4 text-[#FFB400]" />
              </button>
            </div>
          </form>

          {/* Quick Subject Chips */}
          <div className="flex flex-wrap items-center justify-center gap-2 pt-2 text-xs">
            <span className="text-emerald-200 font-medium">জনপ্রিয় বিষয়সমূহ:</span>
            {['পদার্থবিজ্ঞান', 'রসায়ন', 'উচ্চতর গণিত', 'জীববিজ্ঞান', 'বাংলা', 'English'].map((sub) => (
              <button
                key={sub}
                onClick={() => onNavigate(`/notes?subject=${encodeURIComponent(sub)}`)}
                className="px-3 py-1 rounded-full bg-emerald-800/80 hover:bg-emerald-700 text-emerald-100 hover:text-white border border-emerald-600/50 transition-colors"
              >
                {sub}
              </button>
            ))}
          </div>

        </div>

        {/* Floating Stats Bar */}
        <div className="max-w-5xl mx-auto mt-12 bg-white/10 backdrop-blur-md rounded-2xl p-4 sm:p-6 border border-white/15 grid grid-cols-2 sm:grid-cols-4 gap-4 text-center">
          <div>
            <span className="block text-2xl sm:text-3xl font-black text-[#FFB400]">{books.length}</span>
            <span className="text-xs text-emerald-100 font-medium">মোট নোট (Total Notes)</span>
          </div>
          <div>
            <span className="block text-2xl sm:text-3xl font-black text-white">{freeBooksCount}</span>
            <span className="text-xs text-emerald-100 font-medium">ফ্রি ডাউনলোডসমূহ</span>
          </div>
          <div>
            <span className="block text-2xl sm:text-3xl font-black text-white">{totalViews}</span>
            <span className="text-xs text-emerald-100 font-medium">নোট ভিউ (Total Views)</span>
          </div>
          <div>
            <span className="block text-2xl sm:text-3xl font-black text-[#FFB400]">৬ - ১২</span>
            <span className="text-xs text-emerald-100 font-medium">ক্লাস কভারেজ</span>
          </div>
        </div>

      </section>

      {/* CLASS EXPLORER GRID */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 border-b border-slate-200 pb-4">
          <div>
            <h2 className="text-2xl font-bold text-slate-800 flex items-center gap-2 font-['Hind_Siliguri']">
              <GraduationCap className="w-6 h-6 text-[#0E6B4D]" />
              শ্রেণী ভিত্তিক নোট খুঁজুন (Class Explorer)
            </h2>
            <p className="text-xs text-slate-500">আপনার নিজস্ব ক্লাসের নোট বেছে নিন</p>
          </div>
          <button
            onClick={() => onNavigate('/notes')}
            className="text-sm font-semibold text-[#0E6B4D] hover:underline flex items-center gap-1"
          >
            <span>সব নোট দেখুন</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {CLASS_CARDS.map((item) => {
            const count = getCountForClass(item.level);
            return (
              <div
                key={item.level}
                onClick={() => onNavigate(`/notes?class=${item.level}`)}
                className="group relative bg-white rounded-2xl p-6 border border-slate-200 hover:border-[#0E6B4D] shadow-sm hover:shadow-xl transition-all duration-300 cursor-pointer overflow-hidden flex flex-col justify-between"
              >
                <div className="flex items-start justify-between">
                  <div className="w-12 h-12 rounded-xl bg-[#E6F5F0] text-2xl flex items-center justify-center transform group-hover:scale-110 transition-transform">
                    {item.icon}
                  </div>
                  <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-emerald-50 text-[#0E6B4D] border border-emerald-200">
                    {count} টি নোট
                  </span>
                </div>

                <div className="mt-6 space-y-1">
                  <h3 className="text-xl font-bold text-slate-900 group-hover:text-[#0E6B4D] transition-colors">
                    {item.label}
                  </h3>
                  <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
                    {item.sub}
                  </p>
                </div>

                <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-between text-xs font-bold text-[#0E6B4D] group-hover:translate-x-1 transition-transform">
                  <span>নোটসমূহ দেখুন</span>
                  <ArrowRight className="w-4 h-4" />
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* FEATURED NOTES OR EMPTY STATE */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        
        <div className="flex items-center justify-between border-b border-slate-200 pb-4">
          <div className="flex items-center gap-2">
            <Flame className="w-6 h-6 text-[#FFB400]" />
            <h2 className="text-2xl font-bold text-slate-800 font-['Hind_Siliguri']">
              বিশেষ গুরুত্বপুর্ণ নোট (Featured Notes)
            </h2>
          </div>
          <button
            onClick={() => onNavigate('/notes')}
            className="text-sm font-semibold text-[#0E6B4D] hover:underline"
          >
            সবগুলো দেখুন →
          </button>
        </div>

        {/* FRESH START EMPTY STATE (If no books exist) */}
        {books.length === 0 ? (
          <div className="bg-white rounded-3xl p-10 text-center border-2 border-dashed border-emerald-200 max-w-2xl mx-auto space-y-5 shadow-sm">
            <div className="w-16 h-16 mx-auto rounded-full bg-[#E6F5F0] text-[#0E6B4D] flex items-center justify-center text-3xl font-bold">
              📚
            </div>
            <div className="space-y-2">
              <h3 className="text-xl font-bold text-slate-800 font-['Hind_Siliguri']">
                এখনো কোনো নোট আপলোড করা হয়নি — অ্যাডমিন প্যানেল থেকে শুরু করুন
              </h3>
              <p className="text-sm text-slate-600 max-w-md mx-auto leading-relaxed">
                ওয়েবসাইটটি বর্তমানে প্রস্তুত অবস্থায় রয়েছে। অ্যাডমিন ড্যাশবোর্ড থেকে প্রথম নোট আপলোড করলে তা সাথে সাথে এখানে প্রদর্শিত হবে।
              </p>
            </div>

            <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3">
              {isAdmin && (
                <button
                  onClick={() => onNavigate('/admin')}
                  className="px-6 py-3 bg-[#0E6B4D] hover:bg-[#0A523B] text-white font-bold rounded-xl text-sm shadow-md transition-all flex items-center gap-2"
                >
                  <ShieldCheck className="w-4 h-4 text-[#FFB400]" />
                  <span>অ্যাডমিন থেকে নোট আপলোড করুন</span>
                </button>
              )}

              <button
                onClick={onOpenSetupModal}
                className="px-4 py-3 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold rounded-xl text-xs transition-colors"
              >
                Supabase Schema কোয়েরি দেখুন
              </button>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {(featuredBooks.length > 0 ? featuredBooks : books.slice(0, 6)).map((book) => (
              <div
                key={book.id}
                onClick={() => onNavigate(`/notes/${book.slug}`)}
                className="bg-white rounded-2xl border border-slate-200 hover:border-[#0E6B4D] shadow-sm hover:shadow-lg transition-all duration-300 cursor-pointer overflow-hidden flex flex-col justify-between group"
              >
                <div>
                  {/* Card Header image / Thumbnail */}
                  <div className="relative h-44 bg-emerald-900 overflow-hidden">
                    <img
                      src={book.thumbnail_url || 'https://images.unsplash.com/photo-1456513080510-7bf3a84b82f8?w=600&q=80'}
                      alt={book.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 opacity-90"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent"></div>

                    {/* Top Badges */}
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
                      <p className="text-xs text-emerald-300 font-medium">
                        {book.subject} • {book.chapter || 'অধ্যায়'}
                      </p>
                    </div>
                  </div>

                  {/* Card Body */}
                  <div className="p-5 space-y-2">
                    <h3 className="font-bold text-slate-900 text-base line-clamp-2 group-hover:text-[#0E6B4D] transition-colors font-['Hind_Siliguri'] leading-snug">
                      {book.title}
                    </h3>
                    <p className="text-xs text-slate-500 line-clamp-2 leading-relaxed">
                      {book.description}
                    </p>
                  </div>
                </div>

                {/* Card Footer */}
                <div className="p-4 bg-slate-50 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
                  <span className="flex items-center gap-1 font-medium">
                    <Eye className="w-3.5 h-3.5 text-slate-400" />
                    {book.views || 0} ভিউ
                  </span>
                  <span className="font-bold text-[#0E6B4D] group-hover:underline flex items-center gap-1">
                    পড়ুন ও ডাউনলোড করুন →
                  </span>
                </div>

              </div>
            ))}
          </div>
        )}

      </section>

      {/* WHY NOTECLIMAX FEATURES */}
      <section className="bg-[#E6F5F0] py-12 border-y border-emerald-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-10 space-y-2">
            <h2 className="text-2xl font-bold text-slate-900 font-['Hind_Siliguri']">
              কেন NoteClimax বেছে নেবেন?
            </h2>
            <p className="text-xs text-slate-600">আমাদের নোট পোর্টালের সেরা সুবিধাসমূহ</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-emerald-100 text-center space-y-3">
              <div className="w-12 h-12 rounded-xl bg-[#0E6B4D] text-white flex items-center justify-center mx-auto text-xl font-bold shadow-md">
                100%
              </div>
              <h3 className="font-bold text-slate-800 text-base">নির্ভুল সমাধান ও ব্যাখ্যা</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                জাতীয় শিক্ষাক্রম ও পাঠ্যপুস্তক বোর্ড (NCTB) এর সর্বশেষ সিলেবাস অনুযায়ী অভিজ্ঞ শিক্ষকদের দিয়ে প্রস্তুতকৃত।
              </p>
            </div>

            <div className="bg-white p-6 rounded-2xl shadow-sm border border-emerald-100 text-center space-y-3">
              <div className="w-12 h-12 rounded-xl bg-[#FFB400] text-[#0E6B4D] flex items-center justify-center mx-auto text-xl font-bold shadow-md">
                PDF
              </div>
              <h3 className="font-bold text-slate-800 text-base">তাত্ক্ষণিক ফ্রি PDF ডাউনলোড</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                যে কোনো স্থান থেকে আপনার স্মার্টফোনে বা কম্পিউটারে হাই-কোয়ালিটি PDF ফাইল দ্রুত ডাউনলোড করে অফলাইনে পড়ার সুবিধা।
              </p>
            </div>

            <div className="bg-white p-6 rounded-2xl shadow-sm border border-emerald-100 text-center space-y-3">
              <div className="w-12 h-12 rounded-xl bg-[#0E6B4D] text-white flex items-center justify-center mx-auto text-xl font-bold shadow-md">
                <ShieldCheck className="w-6 h-6 text-[#FFB400]" />
              </div>
              <h3 className="font-bold text-slate-800 text-base">সুরক্ষিত ও প্রিমিয়াম স্টাডি মেটেরিয়াল</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                বিশেষ এডভান্সড প্রস্তুতি ও শর্টকাট টেকনিক সম্বলিত প্রিমিয়াম সাজেশন নোট বিকাশের মাধ্যমে সহজে সংগ্রহের সুযোগ।
              </p>
            </div>
          </div>
        </div>
      </section>

    </div>
  );
};
