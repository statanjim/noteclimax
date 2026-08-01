import React from 'react';
import { Book, Purchase } from '../types';
import { FolderDown, BookOpen, Clock, Download, ShieldCheck, User, Sparkles } from 'lucide-react';
import { checkIsAdminEmail } from '../lib/supabaseClient';

interface DashboardPageProps {
  currentUser: { email: string; full_name?: string } | null;
  books: Book[];
  purchases: Purchase[];
  onNavigate: (route: string) => void;
}

export const DashboardPage: React.FC<DashboardPageProps> = ({
  currentUser,
  books,
  purchases,
  onNavigate,
}) => {
  const isAdmin = checkIsAdminEmail(currentUser?.email);

  if (!currentUser) {
    return (
      <div className="max-w-md mx-auto my-16 bg-white p-8 rounded-3xl border border-slate-200 shadow-xl text-center space-y-5">
        <div className="w-14 h-14 rounded-2xl bg-emerald-100 text-[#0E6B4D] flex items-center justify-center mx-auto text-2xl font-bold">
          🔒
        </div>
        <div className="space-y-2">
          <h2 className="text-xl font-bold text-slate-900 font-['Hind_Siliguri']">
            আমার লাইব্রেরি দেখতে লগইন করুন
          </h2>
          <p className="text-xs text-slate-500 leading-relaxed">
            আপনার সংগৃহীত ফ্রি পিডিএফ ও প্রিমিয়াম ক্রয়কৃত নোটসমূহ দেখতে আপনার একাউন্টে প্রবেশ করুন।
          </p>
        </div>
        <button
          onClick={() => onNavigate('/login')}
          className="w-full py-3 bg-[#0E6B4D] hover:bg-[#0A523B] text-white font-bold rounded-xl text-sm shadow-md"
        >
          লগইন করুন (Login)
        </button>
      </div>
    );
  }

  // Filter purchased books
  const userPurchases = purchases.filter((p) => p.user_id === currentUser.email || p.user_email === currentUser.email);
  const purchasedBookIds = new Set(userPurchases.map((p) => p.book_id));
  const myPurchasedBooks = books.filter((b) => purchasedBookIds.has(b.id));

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      
      {/* Profile Header */}
      <div className="bg-gradient-to-r from-[#0E6B4D] to-[#0A523B] text-white rounded-3xl p-6 sm:p-8 shadow-lg flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 rounded-2xl bg-[#FFB400] text-[#0E6B4D] flex items-center justify-center font-black text-2xl shadow-inner border-2 border-white">
            {currentUser.email.charAt(0).toUpperCase()}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-2xl font-bold text-white font-['Hind_Siliguri']">
                {currentUser.full_name || currentUser.email.split('@')[0]}
              </h1>
              {isAdmin && (
                <span className="px-2.5 py-0.5 rounded text-[10px] font-bold bg-[#FFB400] text-[#0E6B4D]">
                  Owner Admin
                </span>
              )}
            </div>
            <p className="text-xs text-emerald-100 font-mono mt-0.5">{currentUser.email}</p>
            <p className="text-[11px] text-emerald-200 mt-1">
              NoteClimax Student Membership • Active
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          {isAdmin && (
            <button
              onClick={() => onNavigate('/admin')}
              className="px-4 py-2 bg-[#FFB400] text-[#0E6B4D] font-bold rounded-xl text-xs shadow-md hover:bg-amber-400 flex items-center gap-1.5"
            >
              <ShieldCheck className="w-4 h-4" />
              <span>অ্যাডমিন ড্যাশবোর্ড</span>
            </button>
          )}
        </div>
      </div>

      {/* Stats Summary */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-1">
          <span className="text-xs text-slate-500 font-semibold block">ক্রয়কৃত প্রিমিয়াম নোট</span>
          <span className="text-2xl font-black text-[#0E6B4D]">{myPurchasedBooks.length} টি</span>
        </div>
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-1">
          <span className="text-xs text-slate-500 font-semibold block">মোট ট্রানজেকশন</span>
          <span className="text-2xl font-black text-slate-800">{userPurchases.length} টি</span>
        </div>
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-1">
          <span className="text-xs text-slate-500 font-semibold block">অ্যাকাউন্ট স্ট্যাটাস</span>
          <span className="text-sm font-bold text-emerald-700 flex items-center gap-1">
            <Sparkles className="w-4 h-4 text-[#FFB400]" />
            Verified Student
          </span>
        </div>
      </div>

      {/* MY LIBRARY SECTION */}
      <section className="space-y-4">
        <div className="border-b border-slate-200 pb-3 flex items-center justify-between">
          <h2 className="text-xl font-bold text-slate-800 flex items-center gap-2 font-['Hind_Siliguri']">
            <FolderDown className="w-5 h-5 text-[#0E6B4D]" />
            আমার সংগৃহীত ও ক্রয়কৃত নোটসমূহ (My Library)
          </h2>
          <button
            onClick={() => onNavigate('/notes')}
            className="text-xs font-bold text-[#0E6B4D] hover:underline"
          >
            আরো নোট খুঁজুন →
          </button>
        </div>

        {myPurchasedBooks.length === 0 ? (
          <div className="bg-white rounded-2xl p-10 text-center border border-slate-200 space-y-3">
            <p className="text-sm text-slate-600 font-medium">
              আপনার কাছে বর্তমানে কোনো ক্রয়কৃত প্রিমিয়াম নোট নেই।
            </p>
            <button
              onClick={() => onNavigate('/notes')}
              className="px-4 py-2 bg-[#0E6B4D] text-white font-bold rounded-xl text-xs hover:bg-[#0A523B]"
            >
              নোটসমূহ ব্রাউজ করুন
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {myPurchasedBooks.map((book) => (
              <div
                key={book.id}
                onClick={() => onNavigate(`/notes/${book.slug}`)}
                className="bg-white rounded-2xl border border-slate-200 hover:border-[#0E6B4D] shadow-sm hover:shadow-md transition-all cursor-pointer overflow-hidden p-5 flex flex-col justify-between"
              >
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-xs font-bold">
                    <span className="px-2 py-0.5 rounded bg-emerald-100 text-[#0E6B4D]">
                      {book.class_label}
                    </span>
                    <span className="text-emerald-600">Purchased ✓</span>
                  </div>
                  <h3 className="font-bold text-slate-900 text-base font-['Hind_Siliguri']">
                    {book.title}
                  </h3>
                  <p className="text-xs text-slate-500 line-clamp-2">
                    {book.description}
                  </p>
                </div>

                <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs font-bold text-[#0E6B4D]">
                  <span className="flex items-center gap-1">
                    <Download className="w-3.5 h-3.5" />
                    ডাউনলোড করুন
                  </span>
                  <span>নোট খুলুন →</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* TRANSACTION HISTORY TABLE */}
      {userPurchases.length > 0 && (
        <section className="space-y-3">
          <h3 className="text-base font-bold text-slate-800">পেমেন্ট হিস্ট্রি (Purchase Logs)</h3>
          <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="bg-[#0E6B4D] text-white">
                  <th className="p-3.5">তারিখ</th>
                  <th className="p-3.5">নোটের নাম</th>
                  <th className="p-3.5">পরিমাণ</th>
                  <th className="p-3.5">TrxID</th>
                  <th className="p-3.5">স্ট্যাটাস</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-slate-700">
                {userPurchases.map((p) => (
                  <tr key={p.id} className="hover:bg-slate-50">
                    <td className="p-3.5">{new Date(p.created_at).toLocaleDateString()}</td>
                    <td className="p-3.5 font-bold">{p.book_title || 'Note Purchase'}</td>
                    <td className="p-3.5 font-bold text-[#0E6B4D]">৳{p.amount}</td>
                    <td className="p-3.5 font-mono">{p.trx_id}</td>
                    <td className="p-3.5">
                      <span className="px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 font-bold">
                        সফল (Success)
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      )}

    </div>
  );
};
