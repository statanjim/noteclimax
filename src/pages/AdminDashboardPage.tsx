import React, { useState, useEffect } from 'react';
import { Book, Purchase, UserProfile } from '../types';
import { checkIsAdminEmail, ADMIN_EMAIL, isSupabaseConfigured, supabase } from '../lib/supabaseClient';
import { SAMPLE_PRESET_NOTES } from '../data/sampleNotes';
import { 
  ShieldCheck, LogOut, PlusCircle, FileText, Users, DollarSign, 
  Eye, Edit3, Trash2, Database, AlertOctagon, CheckCircle2, Sparkles, 
  Upload, Copy, RefreshCw, BarChart3, Layers, Settings, ExternalLink, AlertTriangle
} from 'lucide-react';

interface AdminDashboardPageProps {
  currentUser: { email: string; full_name?: string } | null;
  books: Book[];
  purchases: Purchase[];
  profiles: UserProfile[];
  onNavigate: (route: string) => void;
  onLogout: () => void;
  onSaveBook: (bookData: Partial<Book>) => void;
  onDeleteBook: (bookId: string) => void;
  onResetSampleData: () => void;
  onOpenSetupModal: () => void;
}

export const AdminDashboardPage: React.FC<AdminDashboardPageProps> = ({
  currentUser,
  books,
  purchases,
  profiles,
  onNavigate,
  onLogout,
  onSaveBook,
  onDeleteBook,
  onResetSampleData,
  onOpenSetupModal,
}) => {
  // STRICT SECURITY CHECK FOR OWNER ADMIN EMAIL
  const isAdmin = checkIsAdminEmail(currentUser?.email);

  const [activeTab, setActiveTab] = useState<'overview' | 'manage' | 'add' | 'users' | 'purchases' | 'settings'>('overview');
  const [editingBookId, setEditingBookId] = useState<string | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Form State
  const [formData, setFormData] = useState({
    title: '',
    slug: '',
    class_level: 9,
    class_label: 'নবম-দশম শ্রেণী (SSC)',
    subject: 'পদার্থবিজ্ঞান',
    chapter: '',
    description: '',
    content_html: '',
    price: 0,
    is_free: true,
    is_featured: false,
    pdf_url: '',
    thumbnail_url: '',
  });

  // PDF Upload states
  const [pdfUploading, setPdfUploading] = useState(false);
  const [pdfProgress, setPdfProgress] = useState<number | null>(null);
  const [pdfFileName, setPdfFileName] = useState<string>('');
  const [pdfUploadError, setPdfUploadError] = useState<string | null>(null);
  const [pdfDragActive, setPdfDragActive] = useState(false);

  // Thumbnail Upload states
  const [thumbUploading, setThumbUploading] = useState(false);
  const [thumbProgress, setThumbProgress] = useState<number | null>(null);
  const [thumbFileName, setThumbFileName] = useState<string>('');
  const [thumbUploadError, setThumbUploadError] = useState<string | null>(null);
  const [thumbDragActive, setThumbDragActive] = useState(false);
  const [thumbPreview, setThumbPreview] = useState<string>('');

  const handlePdfUpload = async (file: File) => {
    if (!file) return;
    if (!file.name.toLowerCase().endsWith('.pdf') && file.type !== 'application/pdf') {
      setPdfUploadError('শুধুমাত্র PDF ফাইল (.pdf) আপলোড করা যাবে।');
      return;
    }

    setPdfFileName(file.name);
    setPdfUploading(true);
    setPdfProgress(30);
    setPdfUploadError(null);

    try {
      const fileExt = file.name.split('.').pop() || 'pdf';
      const cleanName = file.name.replace(/[^a-zA-Z0-9]/g, '_');
      const fileName = `${Date.now()}_${cleanName}.${fileExt}`;
      const filePath = `pdfs/${fileName}`;

      setPdfProgress(60);

      if (isSupabaseConfigured) {
        const { data, error } = await supabase.storage
          .from('notes-pdf')
          .upload(filePath, file, { upsert: true });

        if (error) {
          throw error;
        }

        const { data: publicData } = supabase.storage
          .from('notes-pdf')
          .getPublicUrl(filePath);

        const publicUrl = publicData.publicUrl;
        setFormData(prev => ({ ...prev, pdf_url: publicUrl }));
        setPdfProgress(100);
      } else {
        const localUrl = URL.createObjectURL(file);
        setFormData(prev => ({ ...prev, pdf_url: localUrl }));
        setPdfProgress(100);
      }
    } catch (err: any) {
      console.error('PDF upload error:', err);
      const msg = err?.message || 'PDF আপলোডে সমস্যা হয়েছে।';
      setPdfUploadError(`${msg} (Supabase Bucket 'notes-pdf' তৈরি করা আছে কি না নিশ্চিত করুন)`);
      const localUrl = URL.createObjectURL(file);
      setFormData(prev => ({ ...prev, pdf_url: localUrl }));
    } finally {
      setPdfUploading(false);
    }
  };

  const handleThumbnailUpload = async (file: File) => {
    if (!file) return;
    if (!file.type.startsWith('image/')) {
      setThumbUploadError('শুধুমাত্র ইমেজ ফাইল (JPG, PNG, WebP) আপলোড করা যাবে।');
      return;
    }

    setThumbFileName(file.name);
    const localPreview = URL.createObjectURL(file);
    setThumbPreview(localPreview);
    setThumbUploading(true);
    setThumbProgress(30);
    setThumbUploadError(null);

    try {
      const fileExt = file.name.split('.').pop() || 'jpg';
      const cleanName = file.name.replace(/[^a-zA-Z0-9]/g, '_');
      const fileName = `${Date.now()}_${cleanName}.${fileExt}`;
      const filePath = `thumbnails/${fileName}`;

      setThumbProgress(60);

      if (isSupabaseConfigured) {
        const { data, error } = await supabase.storage
          .from('note-thumbnails')
          .upload(filePath, file, { upsert: true });

        if (error) {
          throw error;
        }

        const { data: publicData } = supabase.storage
          .from('note-thumbnails')
          .getPublicUrl(filePath);

        const publicUrl = publicData.publicUrl;
        setFormData(prev => ({ ...prev, thumbnail_url: publicUrl }));
        setThumbProgress(100);
      } else {
        setFormData(prev => ({ ...prev, thumbnail_url: localPreview }));
        setThumbProgress(100);
      }
    } catch (err: any) {
      console.error('Thumbnail upload error:', err);
      const msg = err?.message || 'থাম্বনেইল আপলোডে সমস্যা হয়েছে।';
      setThumbUploadError(`${msg} (Supabase Bucket 'note-thumbnails' তৈরি করা আছে কি না নিশ্চিত করুন)`);
      setFormData(prev => ({ ...prev, thumbnail_url: localPreview }));
    } finally {
      setThumbUploading(false);
    }
  };

  const clearPdfUpload = () => {
    setFormData(prev => ({ ...prev, pdf_url: '' }));
    setPdfFileName('');
    setPdfUploadError(null);
    setPdfProgress(null);
  };

  const clearThumbUpload = () => {
    setFormData(prev => ({ ...prev, thumbnail_url: '' }));
    setThumbFileName('');
    setThumbPreview('');
    setThumbUploadError(null);
    setThumbProgress(null);
  };

  // Redirect or block if unauthorized
  if (!currentUser || !isAdmin) {
    return (
      <div className="max-w-xl mx-auto my-16 bg-white p-8 rounded-3xl border-2 border-rose-300 shadow-2xl text-center space-y-5">
        <div className="w-16 h-16 rounded-full bg-rose-100 text-rose-600 flex items-center justify-center mx-auto">
          <AlertOctagon className="w-8 h-8" />
        </div>
        <div className="space-y-2">
          <h2 className="text-2xl font-black text-slate-900 font-['Hind_Siliguri']">
            Access Denied — You are not authorized
          </h2>
          <p className="text-sm text-slate-600 leading-relaxed">
            শুধুমাত্র NoteClimax ওনার ইমেইল (<code>{ADMIN_EMAIL}</code>) এই ড্যাশবোর্ডে প্রবেশ করতে পারবেন।
          </p>
        </div>
        <div className="pt-2 flex flex-col gap-2">
          <button
            onClick={() => onNavigate('/admin/login')}
            className="w-full py-3 bg-[#0E6B4D] hover:bg-[#0A523B] text-white font-bold rounded-xl text-xs shadow-md"
          >
            অ্যাডমিন লগইন পেজে যান (Admin Login)
          </button>
          <button
            onClick={() => onNavigate('/')}
            className="text-xs text-slate-500 hover:text-slate-800"
          >
            হোম পেজে ফিরে যান
          </button>
        </div>
      </div>
    );
  }

  // Handle Title change -> auto generate slug
  const handleTitleChange = (val: string) => {
    const slugified = val
      .toLowerCase()
      .replace(/[^\w\u0980-\u09FF]+/g, '-')
      .replace(/^-+|-+$/g, '');
    setFormData((prev) => ({
      ...prev,
      title: val,
      slug: prev.slug || slugified || `note-${Date.now()}`,
    }));
  };

  const handleClassLevelChange = (level: number) => {
    let label = 'নবম-দশম শ্রেণী (SSC)';
    if (level === 6) label = 'ষষ্ঠ শ্রেণী (Class 6)';
    if (level === 7) label = 'সপ্তম শ্রেণী (Class 7)';
    if (level === 8) label = 'অষ্টম শ্রেণী (Class 8)';
    if (level === 9 || level === 10) label = 'নবম-দশম শ্রেণী (SSC)';
    if (level === 11 || level === 12) label = 'একাদশ-দ্বাদশ শ্রেণী (HSC)';

    setFormData((prev) => ({
      ...prev,
      class_level: level,
      class_label: label,
    }));
  };

  const handleEditClick = (book: Book) => {
    setEditingBookId(book.id);
    setPdfFileName(book.pdf_url ? 'সংরক্ষিত PDF ফাইল' : '');
    setThumbFileName(book.thumbnail_url ? 'সংরক্ষিত কভার ছবি' : '');
    setThumbPreview(book.thumbnail_url || '');
    setPdfUploadError(null);
    setThumbUploadError(null);
    setFormData({
      title: book.title,
      slug: book.slug,
      class_level: book.class_level,
      class_label: book.class_label,
      subject: book.subject,
      chapter: book.chapter || '',
      description: book.description,
      content_html: book.content_html,
      price: book.price,
      is_free: book.is_free,
      is_featured: book.is_featured,
      pdf_url: book.pdf_url || '',
      thumbnail_url: book.thumbnail_url || '',
    });
    setActiveTab('add');
  };

  const resetForm = () => {
    setEditingBookId(null);
    setPdfFileName('');
    setPdfUploadError(null);
    setPdfProgress(null);
    setThumbFileName('');
    setThumbPreview('');
    setThumbUploadError(null);
    setThumbProgress(null);
    setFormData({
      title: '',
      slug: '',
      class_level: 9,
      class_label: 'নবম-দশম শ্রেণী (SSC)',
      subject: 'পদার্থবিজ্ঞান',
      chapter: '',
      description: '',
      content_html: '',
      price: 0,
      is_free: true,
      is_featured: false,
      pdf_url: '',
      thumbnail_url: '',
    });
  };

  const handleLoadPreset = (index: number) => {
    const preset = SAMPLE_PRESET_NOTES[index];
    if (preset) {
      setFormData({
        title: preset.title || '',
        slug: preset.slug || '',
        class_level: preset.class_level || 9,
        class_label: preset.class_label || 'নবম-দশম শ্রেণী (SSC)',
        subject: preset.subject || 'পদার্থবিজ্ঞান',
        chapter: preset.chapter || '',
        description: preset.description || '',
        content_html: preset.content_html || '',
        price: preset.price || 0,
        is_free: preset.is_free ?? true,
        is_featured: preset.is_featured ?? true,
        pdf_url: preset.pdf_url || '',
        thumbnail_url: preset.thumbnail_url || '',
      });
      showToast('নমুনা নোট ফর্মুলারে লোড করা হয়েছে!');
    }
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title.trim() || !formData.content_html.trim()) {
      alert('অনুগ্রহ করে শিরোনাম এবং মূল নোট কনটেন্ট প্রদান করুন।');
      return;
    }

    onSaveBook({
      ...(editingBookId ? { id: editingBookId } : {}),
      ...formData,
      slug: formData.slug || `note-${Date.now()}`,
    });

    showToast(editingBookId ? 'নোটটি সফলভাবে আপডেট করা হয়েছে!' : 'নতুন নোট সফলভাবে আপলোড হয়েছে!');
    resetForm();
    setActiveTab('manage');
  };

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  // Stats Calculations
  const totalNotes = books.length;
  const freeNotes = books.filter(b => b.is_free).length;
  const premiumNotes = books.filter(b => !b.is_free).length;
  const totalRevenue = purchases.reduce((acc, p) => acc + p.amount, 0);
  const totalViews = books.reduce((acc, b) => acc + (b.views || 0), 0);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      
      {/* Top Secured Admin Banner */}
      <div className="bg-gradient-to-r from-[#0E6B4D] via-[#094733] to-[#0A523B] text-white rounded-3xl p-6 sm:p-8 shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-6 border-2 border-[#FFB400]">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-2xl bg-[#FFB400] text-[#0E6B4D] flex items-center justify-center font-black text-2xl shadow-md">
            <ShieldCheck className="w-8 h-8" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-2xl sm:text-3xl font-black font-['Hind_Siliguri']">
                Secured Admin — Only Owner Access
              </h1>
              <span className="px-2.5 py-0.5 rounded text-[10px] font-bold bg-emerald-800 text-emerald-200 border border-emerald-600">
                ACTIVE OWNER
              </span>
            </div>
            <p className="text-xs text-emerald-100 font-mono mt-0.5">
              Logged in as: <strong className="text-[#FFB400]">{currentUser.email}</strong>
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={onOpenSetupModal}
            className="px-3.5 py-2 bg-emerald-800 hover:bg-emerald-700 text-emerald-100 rounded-xl text-xs font-bold border border-emerald-600 flex items-center gap-1.5"
          >
            <Database className="w-3.5 h-3.5 text-[#FFB400]" />
            <span>Supabase SQL</span>
          </button>

          <button
            onClick={onLogout}
            className="px-4 py-2 bg-rose-600 hover:bg-rose-700 text-white font-bold rounded-xl text-xs shadow-sm flex items-center gap-1.5"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>লগআউট (Logout)</span>
          </button>
        </div>
      </div>

      {toastMessage && (
        <div className="p-4 bg-emerald-600 text-white rounded-2xl text-sm font-bold shadow-lg text-center flex items-center justify-center gap-2 animate-bounce">
          <CheckCircle2 className="w-5 h-5 text-[#FFB400]" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* STATS CARDS */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm space-y-1">
          <span className="text-xs text-slate-500 font-semibold block">মোট নোট (Notes)</span>
          <span className="text-2xl font-black text-slate-800">{totalNotes}</span>
        </div>
        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm space-y-1">
          <span className="text-xs text-slate-500 font-semibold block">ফ্রি পিডিএফ (Free)</span>
          <span className="text-2xl font-black text-emerald-700">{freeNotes}</span>
        </div>
        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm space-y-1">
          <span className="text-xs text-slate-500 font-semibold block">প্রিমিয়াম (Premium)</span>
          <span className="text-2xl font-black text-amber-600">{premiumNotes}</span>
        </div>
        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm space-y-1">
          <span className="text-xs text-slate-500 font-semibold block">ব্যবহারকারী (Users)</span>
          <span className="text-2xl font-black text-blue-700">{profiles.length || 1}</span>
        </div>
        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm space-y-1">
          <span className="text-xs text-slate-500 font-semibold block">মোট রেভিনিউ</span>
          <span className="text-2xl font-black text-[#0E6B4D]">৳{totalRevenue}</span>
        </div>
        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm space-y-1">
          <span className="text-xs text-slate-500 font-semibold block">মোট ভিউ</span>
          <span className="text-2xl font-black text-purple-700">{totalViews}</span>
        </div>
      </div>

      {/* ADMIN TABS NAVIGATION */}
      <div className="bg-white p-2 rounded-2xl border border-slate-200 shadow-sm flex items-center gap-2 overflow-x-auto text-xs font-bold">
        <button
          onClick={() => setActiveTab('overview')}
          className={`px-4 py-2.5 rounded-xl transition-all whitespace-nowrap flex items-center gap-1.5 ${
            activeTab === 'overview'
              ? 'bg-[#0E6B4D] text-white shadow-md'
              : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          <BarChart3 className="w-4 h-4" />
          <span>Overview & Charts</span>
        </button>

        <button
          onClick={() => setActiveTab('manage')}
          className={`px-4 py-2.5 rounded-xl transition-all whitespace-nowrap flex items-center gap-1.5 ${
            activeTab === 'manage'
              ? 'bg-[#0E6B4D] text-white shadow-md'
              : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          <FileText className="w-4 h-4" />
          <span>Manage Notes ({books.length})</span>
        </button>

        <button
          onClick={() => {
            resetForm();
            setActiveTab('add');
          }}
          className={`px-4 py-2.5 rounded-xl transition-all whitespace-nowrap flex items-center gap-1.5 ${
            activeTab === 'add'
              ? 'bg-[#FFB400] text-[#0E6B4D] shadow-md font-extrabold'
              : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          <PlusCircle className="w-4 h-4" />
          <span>{editingBookId ? 'Edit Note' : '+ Add New Note'}</span>
        </button>

        <button
          onClick={() => setActiveTab('users')}
          className={`px-4 py-2.5 rounded-xl transition-all whitespace-nowrap flex items-center gap-1.5 ${
            activeTab === 'users'
              ? 'bg-[#0E6B4D] text-white shadow-md'
              : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          <Users className="w-4 h-4" />
          <span>Users ({profiles.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('purchases')}
          className={`px-4 py-2.5 rounded-xl transition-all whitespace-nowrap flex items-center gap-1.5 ${
            activeTab === 'purchases'
              ? 'bg-[#0E6B4D] text-white shadow-md'
              : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          <DollarSign className="w-4 h-4" />
          <span>Purchases ({purchases.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('settings')}
          className={`px-4 py-2.5 rounded-xl transition-all whitespace-nowrap flex items-center gap-1.5 ${
            activeTab === 'settings'
              ? 'bg-[#0E6B4D] text-white shadow-md'
              : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          <Settings className="w-4 h-4" />
          <span>Settings & Schema</span>
        </button>
      </div>

      {/* TAB 1: OVERVIEW */}
      {activeTab === 'overview' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          
          <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-4">
            <h3 className="text-lg font-bold text-slate-800 font-['Hind_Siliguri']">
              শ্রেণী ভিত্তিক নোটের বণ্টন (Notes per Class)
            </h3>
            <div className="space-y-3 text-xs">
              {[
                { label: 'ষষ্ঠ-অষ্টম শ্রেণী (Class 6-8)', count: books.filter(b => b.class_level <= 8).length },
                { label: 'নবম-দশম শ্রেণী (SSC)', count: books.filter(b => b.class_level === 9 || b.class_level === 10).length },
                { label: 'একাদশ-দ্বাদশ শ্রেণী (HSC)', count: books.filter(b => b.class_level === 11 || b.class_level === 12).length },
              ].map((item) => {
                const percent = books.length > 0 ? Math.round((item.count / books.length) * 100) : 0;
                return (
                  <div key={item.label} className="space-y-1">
                    <div className="flex justify-between font-bold text-slate-700">
                      <span>{item.label}</span>
                      <span>{item.count} টি ({percent}%)</span>
                    </div>
                    <div className="w-full bg-slate-100 rounded-full h-3 overflow-hidden">
                      <div
                        className="bg-[#0E6B4D] h-3 rounded-full transition-all duration-500"
                        style={{ width: `${percent}%` }}
                      ></div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-4">
            <h3 className="text-lg font-bold text-slate-800 font-['Hind_Siliguri'] flex items-center justify-between">
              <span>সর্বশেষ আপলোডকৃত নোটসমূহ</span>
              <button onClick={() => setActiveTab('manage')} className="text-xs text-[#0E6B4D] font-bold">
                সবগুলো ম্যানেজ করুন →
              </button>
            </h3>

            {books.length === 0 ? (
              <p className="text-xs text-slate-500 text-center py-6">কোনো নোট নেই। Add New Note ট্যাব থেকে নতুন নোট আপলোড করুন।</p>
            ) : (
              <div className="space-y-2.5">
                {books.slice(0, 4).map((b) => (
                  <div key={b.id} className="p-3 bg-slate-50 rounded-xl flex items-center justify-between text-xs">
                    <div>
                      <p className="font-bold text-slate-800 line-clamp-1">{b.title}</p>
                      <span className="text-slate-500">{b.class_label} • {b.subject}</span>
                    </div>
                    <span className={`px-2 py-0.5 rounded font-bold ${b.is_free ? 'bg-emerald-100 text-[#0E6B4D]' : 'bg-amber-100 text-amber-800'}`}>
                      {b.is_free ? 'FREE' : `৳${b.price}`}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>

        </div>
      )}

      {/* TAB 2: MANAGE NOTES */}
      {activeTab === 'manage' && (
        <div className="bg-white rounded-3xl border border-slate-200 overflow-hidden shadow-sm space-y-4 p-6">
          <div className="flex items-center justify-between border-b border-slate-100 pb-4">
            <h3 className="text-lg font-bold text-slate-800 font-['Hind_Siliguri']">
              নোট ম্যানেজমেন্ট তালিকা (Manage All Notes)
            </h3>
            <button
              onClick={() => {
                resetForm();
                setActiveTab('add');
              }}
              className="px-4 py-2 bg-[#0E6B4D] text-white text-xs font-bold rounded-xl flex items-center gap-1.5"
            >
              <PlusCircle className="w-4 h-4 text-[#FFB400]" />
              <span>নতুন নোট আপলোড</span>
            </button>
          </div>

          {books.length === 0 ? (
            <div className="text-center py-12 space-y-3">
              <p className="text-sm text-slate-600 font-bold">কোনো নোট নেই। নিচে ক্লিক করে নমুনা নোট আপলোড বা নতুন নোট যুক্ত করুন।</p>
              <button
                onClick={() => handleLoadPreset(0)}
                className="px-4 py-2 bg-[#FFB400] text-[#0E6B4D] text-xs font-bold rounded-xl"
              >
                + নমুনা পদার্থবিজ্ঞান নোট আপলোড করুন
              </button>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="bg-[#0E6B4D] text-white">
                    <th className="p-3.5">নোটের শিরোনাম</th>
                    <th className="p-3.5">শ্রেণী</th>
                    <th className="p-3.5">বিষয়</th>
                    <th className="p-3.5">টাইপ / মূল্য</th>
                    <th className="p-3.5">ভিউ</th>
                    <th className="p-3.5 text-right">অ্যাকশন</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-slate-700">
                  {books.map((book) => (
                    <tr key={book.id} className="hover:bg-slate-50">
                      <td className="p-3.5 font-bold max-w-xs truncate">{book.title}</td>
                      <td className="p-3.5">{book.class_label}</td>
                      <td className="p-3.5">{book.subject}</td>
                      <td className="p-3.5">
                        <span className={`px-2 py-0.5 rounded font-bold ${book.is_free ? 'bg-emerald-100 text-[#0E6B4D]' : 'bg-amber-100 text-amber-800'}`}>
                          {book.is_free ? 'FREE' : `৳${book.price}`}
                        </span>
                      </td>
                      <td className="p-3.5">{book.views || 0}</td>
                      <td className="p-3.5 text-right space-x-2">
                        <button
                          onClick={() => handleEditClick(book)}
                          className="px-2.5 py-1 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded font-bold"
                        >
                          এডিট
                        </button>
                        <button
                          onClick={() => {
                            if (confirm(`আপনি কি "${book.title}" মুছে ফেলতে নিশ্চিত?`)) {
                              onDeleteBook(book.id);
                              showToast('নোটটি সফলভাবে মুছে ফেলা হয়েছে!');
                            }
                          }}
                          className="px-2.5 py-1 bg-rose-100 hover:bg-rose-200 text-rose-700 rounded font-bold"
                        >
                          ডিলেট
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {/* TAB 3: ADD / EDIT NOTE FORM */}
      {activeTab === 'add' && (
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-xl space-y-6">
          
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-slate-100 pb-4">
            <div>
              <h3 className="text-xl font-bold text-slate-900 font-['Hind_Siliguri']">
                {editingBookId ? 'নোট সম্পাদনা করুন (Edit Note)' : 'নতুন নোট যোগ করুন (Add New Note)'}
              </h3>
              <p className="text-xs text-slate-500">বাংলা শিরোনাম, সিলেবাস ও HTML কনটেন্ট ফিল্ড পূরণ করুন।</p>
            </div>

            {/* PRESET LOAD BUTTONS FOR QUICK TESTING */}
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-slate-500">দ্রুত টেস্ট প্রিসেট:</span>
              <button
                type="button"
                onClick={() => handleLoadPreset(0)}
                className="px-3 py-1.5 bg-emerald-100 hover:bg-emerald-200 text-[#0E6B4D] font-bold rounded-lg text-xs"
              >
                + SSC পদার্থবিজ্ঞান
              </button>
              <button
                type="button"
                onClick={() => handleLoadPreset(1)}
                className="px-3 py-1.5 bg-amber-100 hover:bg-amber-200 text-amber-800 font-bold rounded-lg text-xs"
              >
                + HSC রসায়ন
              </button>
            </div>
          </div>

          <form onSubmit={handleFormSubmit} className="space-y-5 text-xs">
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block font-bold text-slate-700 mb-1">নোটের শিরোনাম (Title Bengali) *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. এসএসসি পদার্থবিজ্ঞান: ১ম অধ্যায় - ভৌত রাশি ও পরিমাপ"
                  value={formData.title}
                  onChange={(e) => handleTitleChange(e.target.value)}
                  className="w-full px-3 py-2.5 border border-slate-300 rounded-xl text-sm font-semibold focus:ring-2 focus:ring-[#0E6B4D]"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Slug (URL Path) *</label>
                <input
                  type="text"
                  required
                  value={formData.slug}
                  onChange={(e) => setFormData(prev => ({ ...prev, slug: e.target.value }))}
                  className="w-full px-3 py-2.5 border border-slate-300 rounded-xl font-mono text-xs focus:ring-2 focus:ring-[#0E6B4D]"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block font-bold text-slate-700 mb-1">শ্রেণী (Class Level) *</label>
                <select
                  value={formData.class_level}
                  onChange={(e) => handleClassLevelChange(parseInt(e.target.value, 10))}
                  className="w-full px-3 py-2.5 border border-slate-300 rounded-xl font-bold focus:ring-2 focus:ring-[#0E6B4D]"
                >
                  <option value={6}>Class 6 (ষষ্ঠ শ্রেণী)</option>
                  <option value={7}>Class 7 (সপ্তম শ্রেণী)</option>
                  <option value={8}>Class 8 (অষ্টম শ্রেণী)</option>
                  <option value={9}>Class 9-10 (SSC)</option>
                  <option value={11}>Class 11-12 (HSC)</option>
                  <option value={12}>Admission (ভর্তি পরীক্ষা)</option>
                </select>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">বিষয় (Subject) *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. পদার্থবিজ্ঞান / রসায়ন / গণিত"
                  value={formData.subject}
                  onChange={(e) => setFormData(prev => ({ ...prev, subject: e.target.value }))}
                  className="w-full px-3 py-2.5 border border-slate-300 rounded-xl font-bold focus:ring-2 focus:ring-[#0E6B4D]"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">অধ্যায় (Chapter)</label>
                <input
                  type="text"
                  placeholder="e.g. অধ্যায় ১: ভৌত রাশি"
                  value={formData.chapter}
                  onChange={(e) => setFormData(prev => ({ ...prev, chapter: e.target.value }))}
                  className="w-full px-3 py-2.5 border border-slate-300 rounded-xl focus:ring-2 focus:ring-[#0E6B4D]"
                />
              </div>
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1">সংক্ষিপ্ত বিবরণ (Description)</label>
              <textarea
                rows={2}
                placeholder="নোটটির বিষয়বস্তুর সংক্ষিপ্ত পরিচিতি লিখুন..."
                value={formData.description}
                onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                className="w-full px-3 py-2 border border-slate-300 rounded-xl focus:ring-2 focus:ring-[#0E6B4D]"
              />
            </div>

            {/* Rich HTML Editor Textarea */}
            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="block font-bold text-slate-700">মূল নোট কনটেন্ট (Content HTML) *</label>
                <div className="flex items-center gap-1.5">
                  <button
                    type="button"
                    onClick={() => setFormData(p => ({
                      ...p,
                      content_html: p.content_html + `\n<h3>নতুন অনুচ্ছেদ</h3>\n<p>এখানে অনুচ্ছেদের বিবরণ লিখুন...</p>`
                    }))}
                    className="px-2 py-1 bg-slate-100 hover:bg-slate-200 rounded font-semibold text-[11px]"
                  >
                    + হেডিং
                  </button>
                  <button
                    type="button"
                    onClick={() => setFormData(p => ({
                      ...p,
                      content_html: p.content_html + `\n<table>\n  <thead>\n    <tr><th>হেডার ১</th><th>হেডার ২</th></tr>\n  </thead>\n  <tbody>\n    <tr><td>তথ্য ১</td><td>তথ্য ২</td></tr>\n  </tbody>\n</table>`
                    }))}
                    className="px-2 py-1 bg-emerald-100 hover:bg-emerald-200 text-[#0E6B4D] rounded font-semibold text-[11px]"
                  >
                    + টেবিল (Green Header)
                  </button>
                  <button
                    type="button"
                    onClick={() => setFormData(p => ({
                      ...p,
                      content_html: p.content_html + `\n<div class="highlight-box">\n  <strong>📌 মনে রাখার বিষয়:</strong> এখানে বিশেষ নোট লিখুন।\n</div>`
                    }))}
                    className="px-2 py-1 bg-amber-100 hover:bg-amber-200 text-amber-900 rounded font-semibold text-[11px]"
                  >
                    + হাইলাইট বক্স
                  </button>
                </div>
              </div>

              <textarea
                rows={10}
                required
                placeholder="<h2>অধ্যায় ১...</h2><p>নোটের সম্পূর্ণ কনটেন্ট HTML ফরম্যাটে লিখুন...</p>"
                value={formData.content_html}
                onChange={(e) => setFormData(prev => ({ ...prev, content_html: e.target.value }))}
                className="w-full p-3 font-mono text-xs border border-slate-300 rounded-xl focus:ring-2 focus:ring-[#0E6B4D] leading-relaxed"
              />
            </div>

            {/* Pricing & Checkboxes */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 bg-slate-50 p-4 rounded-2xl border border-slate-200">
              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="is_free"
                  checked={formData.is_free}
                  onChange={(e) => setFormData(prev => ({ ...prev, is_free: e.target.checked, price: e.target.checked ? 0 : (prev.price || 99) }))}
                  className="w-4 h-4 text-[#0E6B4D] rounded border-slate-300 focus:ring-[#0E6B4D]"
                />
                <label htmlFor="is_free" className="font-bold text-slate-800">
                  ফ্রি পিডিএফ নোট (Is Free)
                </label>
              </div>

              {!formData.is_free && (
                <div>
                  <label className="block font-bold text-slate-700 mb-1">প্রিমিয়াম নোটের মূল্য (৳ Price) *</label>
                  <input
                    type="number"
                    min={0}
                    value={formData.price}
                    onChange={(e) => setFormData(prev => ({ ...prev, price: parseInt(e.target.value, 10) || 0 }))}
                    className="w-full px-3 py-1.5 border border-slate-300 rounded-xl font-bold"
                  />
                </div>
              )}

              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="is_featured"
                  checked={formData.is_featured}
                  onChange={(e) => setFormData(prev => ({ ...prev, is_featured: e.target.checked }))}
                  className="w-4 h-4 text-[#0E6B4D] rounded border-slate-300 focus:ring-[#0E6B4D]"
                />
                <label htmlFor="is_featured" className="font-bold text-slate-800">
                  হোম পেজ ফিচার্ড নোটে দেখান
                </label>
              </div>
            </div>

            {/* PDF & Thumbnail Direct File Uploads */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5 pt-2">
              {/* PDF Upload Field */}
              <div className="space-y-1.5">
                <label className="block font-bold text-slate-800 text-xs flex items-center gap-1.5">
                  <FileText className="w-4 h-4 text-[#0E6B4D]" />
                  <span>PDF ফাইল আপলোড করুন (Device থেকে) *</span>
                </label>

                <div
                  onDragOver={(e) => { e.preventDefault(); setPdfDragActive(true); }}
                  onDragLeave={() => setPdfDragActive(false)}
                  onDrop={(e) => {
                    e.preventDefault();
                    setPdfDragActive(false);
                    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
                      handlePdfUpload(e.dataTransfer.files[0]);
                    }
                  }}
                  className={`relative border-2 border-dashed rounded-2xl p-4 text-center transition-all ${
                    pdfDragActive
                      ? 'border-[#0E6B4D] bg-emerald-50'
                      : formData.pdf_url
                      ? 'border-emerald-500 bg-emerald-50/60'
                      : 'border-slate-300 hover:border-emerald-600 bg-slate-50 hover:bg-emerald-50/30'
                  }`}
                >
                  <input
                    type="file"
                    accept=".pdf,application/pdf"
                    onChange={(e) => {
                      if (e.target.files && e.target.files[0]) {
                        handlePdfUpload(e.target.files[0]);
                      }
                    }}
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                  />

                  {pdfUploading ? (
                    <div className="py-2 space-y-2">
                      <div className="flex items-center justify-center gap-2 text-xs font-bold text-[#0E6B4D]">
                        <RefreshCw className="w-4 h-4 animate-spin text-[#FFB400]" />
                        <span>PDF আপলোড হচ্ছে {pdfProgress || 40}%...</span>
                      </div>
                      <div className="w-48 mx-auto bg-slate-200 rounded-full h-2 overflow-hidden">
                        <div
                          className="bg-[#0E6B4D] h-2 rounded-full transition-all duration-300"
                          style={{ width: `${pdfProgress || 40}%` }}
                        ></div>
                      </div>
                    </div>
                  ) : formData.pdf_url ? (
                    <div className="flex items-center justify-between px-2 py-1">
                      <div className="flex items-center gap-2 text-emerald-800 text-xs font-bold truncate max-w-[80%]">
                        <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
                        <span className="truncate">{pdfFileName || 'PDF ফাইল সফলভাবে আপলোড হয়েছে ✓'}</span>
                      </div>
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          clearPdfUpload();
                        }}
                        className="p-1.5 rounded-lg bg-rose-100 text-rose-700 hover:bg-rose-200 z-20 font-bold text-xs"
                        title="রিমুভ করুন"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  ) : (
                    <div className="py-2 space-y-1">
                      <Upload className="w-7 h-7 mx-auto text-[#0E6B4D]" />
                      <p className="text-xs font-bold text-slate-700">
                        ডিভাইস থেকে PDF ড্র্যাগ করুন অথবা <span className="text-[#0E6B4D] underline">ব্রাউজ করুন</span>
                      </p>
                      <p className="text-[10px] text-slate-500">Supabase Storage Bucket: notes-pdf</p>
                    </div>
                  )}
                </div>

                {pdfUploadError && (
                  <p className="text-[11px] text-rose-600 font-bold flex items-center gap-1">
                    <AlertTriangle className="w-3.5 h-3.5 shrink-0" />
                    <span>{pdfUploadError}</span>
                  </p>
                )}
              </div>

              {/* Thumbnail Upload Field */}
              <div className="space-y-1.5">
                <label className="block font-bold text-slate-800 text-xs flex items-center gap-1.5">
                  <Sparkles className="w-4 h-4 text-[#FFB400]" />
                  <span>Thumbnail Cover Image আপলোড করুন</span>
                </label>

                <div
                  onDragOver={(e) => { e.preventDefault(); setThumbDragActive(true); }}
                  onDragLeave={() => setThumbDragActive(false)}
                  onDrop={(e) => {
                    e.preventDefault();
                    setThumbDragActive(false);
                    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
                      handleThumbnailUpload(e.dataTransfer.files[0]);
                    }
                  }}
                  className={`relative border-2 border-dashed rounded-2xl p-4 text-center transition-all ${
                    thumbDragActive
                      ? 'border-[#0E6B4D] bg-emerald-50'
                      : formData.thumbnail_url
                      ? 'border-emerald-500 bg-emerald-50/60'
                      : 'border-slate-300 hover:border-emerald-600 bg-slate-50 hover:bg-emerald-50/30'
                  }`}
                >
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => {
                      if (e.target.files && e.target.files[0]) {
                        handleThumbnailUpload(e.target.files[0]);
                      }
                    }}
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                  />

                  {thumbUploading ? (
                    <div className="py-2 space-y-2">
                      <div className="flex items-center justify-center gap-2 text-xs font-bold text-[#0E6B4D]">
                        <RefreshCw className="w-4 h-4 animate-spin text-[#FFB400]" />
                        <span>কভার ছবি আপলোড হচ্ছে {thumbProgress || 40}%...</span>
                      </div>
                      <div className="w-48 mx-auto bg-slate-200 rounded-full h-2 overflow-hidden">
                        <div
                          className="bg-[#0E6B4D] h-2 rounded-full transition-all duration-300"
                          style={{ width: `${thumbProgress || 40}%` }}
                        ></div>
                      </div>
                    </div>
                  ) : formData.thumbnail_url ? (
                    <div className="flex items-center justify-between gap-3">
                      <div className="flex items-center gap-2 text-emerald-800 text-xs font-bold truncate max-w-[80%]">
                        <img
                          src={thumbPreview || formData.thumbnail_url}
                          alt="Thumbnail preview"
                          className="w-10 h-10 object-cover rounded-lg border border-emerald-300 shrink-0 shadow-sm"
                        />
                        <div className="text-left truncate">
                          <p className="truncate text-xs text-slate-800">{thumbFileName || 'কভার ছবি প্রস্তুত ✓'}</p>
                          <span className="text-[10px] text-emerald-600 font-semibold flex items-center gap-1">
                            <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                            আপলোড সম্পন্ন
                          </span>
                        </div>
                      </div>
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          clearThumbUpload();
                        }}
                        className="p-1.5 rounded-lg bg-rose-100 text-rose-700 hover:bg-rose-200 z-20 font-bold text-xs"
                        title="রিমুভ করুন"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  ) : (
                    <div className="py-2 space-y-1">
                      <Upload className="w-7 h-7 mx-auto text-[#0E6B4D]" />
                      <p className="text-xs font-bold text-slate-700">
                        কভার ছবি ড্র্যাগ করুন অথবা <span className="text-[#0E6B4D] underline">ব্রাউজ করুন</span>
                      </p>
                      <p className="text-[10px] text-slate-500">Supabase Storage Bucket: note-thumbnails</p>
                    </div>
                  )}
                </div>

                {thumbUploadError && (
                  <p className="text-[11px] text-rose-600 font-bold flex items-center gap-1">
                    <AlertTriangle className="w-3.5 h-3.5 shrink-0" />
                    <span>{thumbUploadError}</span>
                  </p>
                )}
              </div>
            </div>

            <div className="flex justify-end gap-3 pt-4 border-t border-slate-100">
              {editingBookId && (
                <button
                  type="button"
                  onClick={resetForm}
                  className="px-5 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-xl"
                >
                  বাতিল করুন
                </button>
              )}
              <button
                type="submit"
                className="px-8 py-3 bg-[#0E6B4D] hover:bg-[#0A523B] text-white font-bold rounded-xl text-sm shadow-md"
              >
                {editingBookId ? 'পরিবর্তন সংরক্ষণ করুন' : 'নোটটি প্রকাশ করুন (Publish)'}
              </button>
            </div>

          </form>

        </div>
      )}

      {/* TAB 4: USERS */}
      {activeTab === 'users' && (
        <div className="bg-white rounded-3xl border border-slate-200 overflow-hidden shadow-sm p-6 space-y-4">
          <h3 className="text-lg font-bold text-slate-800 font-['Hind_Siliguri']">
            নিবন্ধিত ইউজার তালিকা (Registered User Profiles)
          </h3>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="bg-[#0E6B4D] text-white">
                  <th className="p-3.5">ইমেইল</th>
                  <th className="p-3.5">নাম</th>
                  <th className="p-3.5">রোল (Role)</th>
                  <th className="p-3.5">স্ট্যাটাস</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-slate-700">
                {profiles.map((p) => (
                  <tr key={p.id || p.email} className="hover:bg-slate-50">
                    <td className="p-3.5 font-mono font-bold">{p.email}</td>
                    <td className="p-3.5 font-bold">{p.full_name || 'Student'}</td>
                    <td className="p-3.5">
                      <span className={`px-2 py-0.5 rounded font-bold ${p.email === ADMIN_EMAIL ? 'bg-[#FFB400] text-[#0E6B4D]' : 'bg-slate-100 text-slate-800'}`}>
                        {p.email === ADMIN_EMAIL ? '👑 Owner Admin' : 'Student'}
                      </span>
                    </td>
                    <td className="p-3.5 text-emerald-700 font-bold">Active</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 5: PURCHASES */}
      {activeTab === 'purchases' && (
        <div className="bg-white rounded-3xl border border-slate-200 overflow-hidden shadow-sm p-6 space-y-4">
          <h3 className="text-lg font-bold text-slate-800 font-['Hind_Siliguri']">
            পেমেন্ট ও ক্রয়কৃত ট্রানজেকশন তালিকা (Purchases Log)
          </h3>
          {purchases.length === 0 ? (
            <p className="text-xs text-slate-500 text-center py-6">এখনো কোনো ক্রয়কৃত পেমেন্ট হিস্ট্রি নেই।</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="bg-[#0E6B4D] text-white">
                    <th className="p-3.5">তারিখ</th>
                    <th className="p-3.5">ইউজার ইমেইল</th>
                    <th className="p-3.5">নোট আইডি</th>
                    <th className="p-3.5">পরিমাণ</th>
                    <th className="p-3.5">TrxID</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-slate-700">
                  {purchases.map((p) => (
                    <tr key={p.id} className="hover:bg-slate-50">
                      <td className="p-3.5">{new Date(p.created_at).toLocaleDateString()}</td>
                      <td className="p-3.5 font-mono">{p.user_email || p.user_id}</td>
                      <td className="p-3.5 font-bold">{p.book_title || p.book_id}</td>
                      <td className="p-3.5 font-bold text-[#0E6B4D]">৳{p.amount}</td>
                      <td className="p-3.5 font-mono">{p.trx_id}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {/* TAB 6: SETTINGS & SCHEMA */}
      {activeTab === 'settings' && (
        <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 space-y-6">
          <h3 className="text-xl font-bold text-slate-900 font-['Hind_Siliguri']">
            অ্যাডমিন সেটিংস ও ডাটাবেস কন্ট্রোল (Settings & Schema)
          </h3>

          <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 space-y-2 text-xs">
            <span className="font-bold text-slate-800 block">অনুমোদিত Admin Email Environment Variable:</span>
            <code className="bg-white px-3 py-1.5 rounded border border-slate-300 block font-mono font-bold text-[#0E6B4D]">
              VITE_ADMIN_EMAIL="{ADMIN_EMAIL}"
            </code>
            <p className="text-[11px] text-slate-500">
              Note: আপনার আসল ইমেইল সেট করতে <code>.env</code> ফাইলে <code>VITE_ADMIN_EMAIL</code> মানটি আপডেট করুন।
            </p>
          </div>

          <div className="pt-4 border-t border-slate-200 flex flex-wrap gap-4">
            <button
              onClick={onOpenSetupModal}
              className="px-5 py-2.5 bg-[#0E6B4D] hover:bg-[#0A523B] text-white font-bold text-xs rounded-xl flex items-center gap-2"
            >
              <Database className="w-4 h-4 text-[#FFB400]" />
              <span>Supabase Schema & RLS SQL দেখুন</span>
            </button>

            <button
              onClick={() => {
                if (confirm('আপনি কি ডাটা ক্যাশ রিসেট করে শুরু করতে চান?')) {
                  onResetSampleData();
                  showToast('ডাটাবেস ক্যাশ রিসেট করা হয়েছে!');
                }
              }}
              className="px-5 py-2.5 bg-rose-100 hover:bg-rose-200 text-rose-800 font-bold text-xs rounded-xl flex items-center gap-2"
            >
              <RefreshCw className="w-4 h-4" />
              <span>ডাটা রিসেট করুন (Reset Cache)</span>
            </button>
          </div>
        </div>
      )}

    </div>
  );
};
