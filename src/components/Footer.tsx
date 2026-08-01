import React from 'react';
import { BookOpen, ShieldCheck, Mail, Phone, Heart, Award, Sparkles } from 'lucide-react';

interface FooterProps {
  onNavigate: (route: string) => void;
}

export const Footer: React.FC<FooterProps> = ({ onNavigate }) => {

  return (
    <footer className="bg-[#094733] text-emerald-100 pt-12 pb-8 border-t border-emerald-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 pb-10 border-b border-emerald-800/60">
          
          {/* Brand Info */}
          <div className="space-y-4 md:col-span-1">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-[#FFB400] text-[#0E6B4D] flex items-center justify-center font-bold text-lg shadow">
                NC
              </div>
              <span className="font-bold text-2xl tracking-tight text-white font-['Hind_Siliguri']">
                NoteClimax
              </span>
            </div>
            <p className="text-sm text-emerald-200 leading-relaxed font-['Hind_Siliguri']">
              ক্লাস ৬ থেকে শুরু করে এইচএসসি (HSC) ও এডমিশন টেস্টের জন্য উচ্চমানের অধ্যায়ভিত্তিক নোট, সাজেশন এবং মডেল টেস্টের ফ্রি ডিজিটাল পোর্টাল।
            </p>
            <div className="flex items-center gap-2 text-xs text-[#FFB400]">
              <Award className="w-4 h-4" />
              <span>১০০% প্রামাণিক শিক্ষক প্রস্তুতকৃত হ্যান্ডনোট</span>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-white font-bold text-base mb-4 flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-[#FFB400]" />
              দ্রুত নেভিগেশন
            </h3>
            <ul className="space-y-2.5 text-sm text-emerald-200">
              <li>
                <button 
                  onClick={() => onNavigate('/')} 
                  className="hover:text-white transition-colors"
                >
                  হোম পেজ
                </button>
              </li>
              <li>
                <button 
                  onClick={() => onNavigate('/notes')} 
                  className="hover:text-white transition-colors"
                >
                  সকল নোটসমূহ (All Notes)
                </button>
              </li>
              <li>
                <button 
                  onClick={() => onNavigate('/dashboard')} 
                  className="hover:text-white transition-colors"
                >
                  আমার লাইব্রেরি (My Library)
                </button>
              </li>
            </ul>
          </div>

          {/* Class Explorer */}
          <div>
            <h3 className="text-white font-bold text-base mb-4">ক্লাস ভিত্তিক নোট</h3>
            <ul className="space-y-2 text-sm text-emerald-200">
              <li>
                <button onClick={() => onNavigate('/notes?class=6')} className="hover:text-white">
                  ষষ্ঠ শ্রেণী (Class 6)
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('/notes?class=7')} className="hover:text-white">
                  সপ্তম শ্রেণী (Class 7)
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('/notes?class=8')} className="hover:text-white">
                  অষ্টম শ্রেণী (Class 8)
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('/notes?class=9')} className="hover:text-white">
                  নবম-দশম শ্রেণী (SSC)
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('/notes?class=11')} className="hover:text-white">
                  একাদশ-দ্বাদশ শ্রেণী (HSC)
                </button>
              </li>
            </ul>
          </div>

          {/* Contact / Help */}
          <div>
            <h3 className="text-white font-bold text-base mb-4">যোগাযোগ ও সহায়তা</h3>
            <p className="text-sm text-emerald-200 mb-3">
              যে কোনো প্রশ্ন বা টেকনিক্যাল সহায়তার জন্য ইমেইল করুন:
            </p>
            <div className="space-y-2 text-sm text-emerald-100">
              <div className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-[#FFB400]" />
                <span>support@noteclimax.com</span>
              </div>
              <div className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-[#FFB400]" />
                <span>+৮৮০ ১৭০০-০০০০০</span>
              </div>
            </div>
            <div className="mt-4 p-3 rounded-lg bg-emerald-900/70 border border-emerald-700/60 text-xs">
              <span className="text-white font-semibold">বিঃদ্রঃ:</span> প্রিমিয়াম নোটের বিকাশ পেমেন্ট সংক্রান্ত হেল্পলাইনের জন্য সরাসরি হোয়াটসঅ্যাপ করুন।
            </div>
          </div>

        </div>

        {/* Bottom Bar */}
        <div className="pt-6 flex flex-col sm:flex-row items-center justify-between text-xs text-emerald-300 gap-4">
          <p>© {new Date().getFullYear()} NoteClimax. সর্বস্বত্ব সংরক্ষিত (All rights reserved).</p>
          <div className="flex items-center gap-1 text-emerald-200">
            <span>নির্মিত</span>
            <Heart className="w-3.5 h-3.5 text-rose-400 fill-rose-400" />
            <span>বাংলাদেশের সকল শিক্ষার্থীদের জন্য</span>
          </div>
        </div>

      </div>
    </footer>
  );
};
