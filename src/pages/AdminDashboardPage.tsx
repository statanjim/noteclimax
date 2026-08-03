import React, { useState, useEffect } from 'react';
import { Book, Purchase, UserProfile } from '../types';
import { checkIsAdminEmail, ADMIN_EMAIL, isSupabaseConfigured, supabase } from '../lib/supabaseClient';
import { SAMPLE_PRESET_NOTES } from '../data/sampleNotes';
import {
  ShieldCheck, LogOut, PlusCircle, FileText, Users, DollarSign,
  Eye, Edit3, Trash2, Database, AlertOctagon, CheckCircle2, Sparkles,
  Upload, Copy, RefreshCw, BarChart3, Layers, Settings, ExternalLink, AlertTriangle, Image as ImageIcon, X
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
  currentUser, books, purchases, profiles, onNavigate, onLogout, onSaveBook, onDeleteBook, onResetSampleData, onOpenSetupModal,
}) => {
  const isAdmin = checkIsAdminEmail(currentUser?.email);
  const [activeTab, setActiveTab] = useState<'overview' | 'manage' | 'add' | 'users' | 'purchases' | 'settings'>('overview');
  const [editingBookId, setEditingBookId] = useState<string | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    title: '', slug: '', class_level: 9, class_label: 'নবম-দশম শ্রেণী (SSC)',
    subject: 'পদার্থবিজ্ঞান', chapter: '', description: '', content_html: '',
    price: 0, is_free: true, is_featured: false, pdf_url: '', thumbnail_url: '',
  });

  const [pdfUploading, setPdfUploading] = useState(false);
  const [pdfProgress, setPdfProgress] = useState<number | null>(null);
  const [pdfFileName, setPdfFileName] = useState<string>('');
  const [pdfUploadError, setPdfUploadError] = useState<string | null>(null);
  const [pdfDragActive, setPdfDragActive] = useState(false);

  const [thumbUploading, setThumbUploading] = useState(false);
  const [thumbProgress, setThumbProgress] = useState<number | null>(null);
  const [thumbFileName, setThumbFileName] = useState<string>('');
  const [thumbUploadError, setThumbUploadError] = useState<string | null>(null);
  const [thumbDragActive, setThumbDragActive] = useState(false);
  const [thumbPreview, setThumbPreview] = useState<string>('');

  // NEW PREVIEW IMAGES STATE
  const [previewImages, setPreviewImages] = useState<string[]>([]);
  const [previewUploading, setPreviewUploading] = useState(false);
  const [previewProgress, setPreviewProgress] = useState<number | null>(null);
  const [previewUploadError, setPreviewUploadError] = useState<string | null>(null);
  const [previewDragActive, setPreviewDragActive] = useState(false);

  const handlePdfUpload = async (file: File) => {
    if (!file) return;
    if (!file.name.toLowerCase().endsWith('.pdf') && file.type!== 'application/pdf') {
      setPdfUploadError('শুধুমাত্র PDF ফাইল (.pdf) আপলোড করা যাবে।'); return;
    }
    setPdfFileName(file.name); setPdfUploading(true); setPdfProgress(30); setPdfUploadError(null);
    try {
      const fileExt = file.name.split('.').pop() || 'pdf';
      const cleanName = file.name.replace(/[^a-zA-Z0-9]/g, '_');
      const fileName = `${Date.now()}_${cleanName}.${fileExt}`;
      const filePath = `pdfs/${fileName}`;
      setPdfProgress(60);
      if (isSupabaseConfigured) {
        const { error } = await supabase.storage.from('notes-pdf').upload(filePath, file, { upsert: true });
        if (error) throw error;
        const { data: publicData } = supabase.storage.from('notes-pdf').getPublicUrl(filePath);
        setFormData(prev => ({...prev, pdf_url: publicData.publicUrl }));
        setPdfProgress(100);
      } else {
        const localUrl = URL.createObjectURL(file);
        setFormData(prev => ({...prev, pdf_url: localUrl }));
        setPdfProgress(100);
      }
    } catch (err: any) {
      setPdfUploadError(`${err?.message || 'PDF আপলোডে সমস্যা'} (Bucket 'notes-pdf' আছে কিনা দেখুন)`);
      const localUrl = URL.createObjectURL(file);
      setFormData(prev => ({...prev, pdf_url: localUrl }));
    } finally { setPdfUploading(false); }
  };

  const handleThumbnailUpload = async (file: File) => {
    if (!file) return;
    if (!file.type.startsWith('image/')) { setThumbUploadError('শুধু ইমেজ ফাইল'); return; }
    setThumbFileName(file.name);
    const localPreview = URL.createObjectURL(file);
    setThumbPreview(localPreview);
    setThumbUploading(true); setThumbProgress(30); setThumbUploadError(null);
    try {
      const fileExt = file.name.split('.').pop() || 'jpg';
      const cleanName = file.name.replace(/[^a-zA-Z0-9]/g, '_');
      const fileName = `${Date.now()}_${cleanName}.${fileExt}`;
      const filePath = `thumbnails/${fileName}`;
      setThumbProgress(60);
      if (isSupabaseConfigured) {
        const { error } = await supabase.storage.from('note-thumbnails').upload(filePath, file, { upsert: true });
        if (error) throw error;
        const { data: publicData } = supabase.storage.from('note-thumbnails').getPublicUrl(filePath);
        setFormData(prev => ({...prev, thumbnail_url: publicData.publicUrl }));
        setThumbProgress(100);
      } else { setFormData(prev => ({...prev, thumbnail_url: localPreview })); setThumbProgress(100); }
    } catch (err: any) {
      setThumbUploadError(`${err?.message || 'Thumb error'}`);
      setFormData(prev => ({...prev, thumbnail_url: localPreview }));
    } finally { setThumbUploading(false); }
  };

  const handlePreviewImagesUpload = async (files: FileList) => {
    if (!files || files.length === 0) return;
    setPreviewUploading(true); setPreviewProgress(10); setPreviewUploadError(null);
    try {
      const uploaded: string[] = [...previewImages];
      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        if (!file.type.startsWith('image/')) continue;
        const ext = file.name.split('.').pop() || 'jpg';
        const clean = file.name.replace(/[^a-zA-Z0-9]/g, '_');
        const fileName = `${Date.now()}_${i}_${clean}.${ext}`;
        const filePath = `previews/${fileName}`;
        if (isSupabaseConfigured) {
          const { error } = await supabase.storage.from('note-thumbnails').upload(filePath, file, { upsert: true });
          if (error) throw error;
          const { data } = supabase.storage.from('note-thumbnails').getPublicUrl(filePath);
          uploaded.push(data.publicUrl);
        } else { uploaded.push(URL.createObjectURL(file)); }
        setPreviewProgress(Math.round(((i + 1) / files.length) * 100));
      }
      setPreviewImages(uploaded.slice(0, 6));
    } catch (err: any) { setPreviewUploadError(err.message || 'Preview upload failed'); }
    finally { setPreviewUploading(false); setPreviewProgress(null); }
  };

  const clearPdfUpload = () => { setFormData(prev => ({...prev, pdf_url: '' })); setPdfFileName(''); setPdfUploadError(null); setPdfProgress(null); };
  const clearThumbUpload = () => { setFormData(prev => ({...prev, thumbnail_url: '' })); setThumbFileName(''); setThumbPreview(''); setThumbUploadError(null); setThumbProgress(null); };
  const removePreviewImage = (idx: number) => { setPreviewImages(prev => prev.filter((_, i) => i!== idx)); };

  if (!currentUser ||!isAdmin) {
    return (
      <div className="max-w-xl mx-auto my-16 bg-white p-8 rounded-3xl border-2 border-rose-300 shadow-2xl text-center space-y-5">
        <div className="w-16 h-16 rounded-full bg-rose-100 text-rose-600 flex items-center justify-center mx-auto"><AlertOctagon className="w-8 h-8" /></div>
        <h2 className="text-2xl font-black">Access Denied</h2>
        <p className="text-sm">শুধু {ADMIN_EMAIL} প্রবেশ করতে পারবে</p>
        <button onClick={() => onNavigate('/admin/login')} className="w-full py-3 bg-[#0E6B4D] text-white font-bold rounded-xl">Admin Login এ যান</button>
      </div>
    );
  }

  const handleTitleChange = (val: string) => {
    const slugified = val.toLowerCase().replace(/[^\w\u0980-\u09FF]+/g, '-').replace(/^-+|-+$/g, '');
    setFormData((prev) => ({...prev, title: val, slug: prev.slug || slugified || `note-${Date.now()}` }));
  };
  const handleClassLevelChange = (level: number) => {
    let label = 'নবম-দশম শ্রেণী (SSC)';
    if (level === 6) label = 'ষষ্ঠ শ্রেণী (Class 6)'; if (level === 7) label = 'সপ্তম শ্রেণী'; if (level === 8) label = 'অষ্টম শ্রেণী';
    if (level === 9 || level === 10) label = 'নবম-দশম শ্রেণী (SSC)'; if (level === 11 || level === 12) label = 'একাদশ-দ্বাদশ শ্রেণী (HSC)';
    setFormData((prev) => ({...prev, class_level: level, class_label: label }));
  };

  const handleEditClick = (book: Book) => {
    setEditingBookId(book.id);
    setPdfFileName(book.pdf_url? 'সংরক্ষিত PDF' : ''); setThumbFileName(book.thumbnail_url? 'সংরক্ষিত কভার' : '');
    setThumbPreview(book.thumbnail_url || '');
    const previews = (book as any).preview_images;
    if (previews) {
      try { const arr = typeof previews === 'string'? JSON.parse(previews) : previews; if (Array.isArray(arr)) setPreviewImages(arr); }
      catch { if (typeof previews === 'string' && previews) setPreviewImages([previews]); }
    } else setPreviewImages([]);
    setFormData({
      title: book.title, slug: book.slug, class_level: book.class_level, class_label: book.class_label,
      subject: book.subject, chapter: book.chapter || '', description: book.description,
      content_html: book.content_html, price: book.price, is_free: book.is_free,
      is_featured: book.is_featured, pdf_url: book.pdf_url || '', thumbnail_url: book.thumbnail_url || '',
    });
    setActiveTab('add');
  };

  const resetForm = () => {
    setEditingBookId(null); setPdfFileName(''); setPdfUploadError(null); setPdfProgress(null);
    setThumbFileName(''); setThumbPreview(''); setThumbUploadError(null); setThumbProgress(null);
    setPreviewImages([]); setPreviewUploadError(null);
    setFormData({ title: '', slug: '', class_level: 9, class_label: 'নবম-দশম শ্রেণী (SSC)', subject: 'পদার্থবিজ্ঞান', chapter: '', description: '', content_html: '', price: 0, is_free: true, is_featured: false, pdf_url: '', thumbnail_url: '', });
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title.trim() ||!formData.content_html.trim()) { alert('শিরোনাম ও কনটেন্ট দিন'); return; }
    onSaveBook({...(editingBookId? { id: editingBookId } : {}),...formData, slug: formData.slug || `note-${Date.now()}`, preview_images: JSON.stringify(previewImages) } as any);
    setToastMessage(editingBookId? 'আপডেট হয়েছে!' : 'নতুন নোট আপলোড হয়েছে!'); resetForm(); setActiveTab('manage');
  };

  const showToast = (msg: string) => { setToastMessage(msg); setTimeout(() => setToastMessage(null), 3000); };
  const totalNotes = books.length; const freeNotes = books.filter(b => b.is_free).length;
  const premiumNotes = books.filter(b =>!b.is_free).length; const totalRevenue = purchases.reduce((acc, p) => acc + p.amount, 0);
  const totalViews = books.reduce((acc, b) => acc + (b.views || 0), 0);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      <div className="bg-gradient-to-r from-[#0E6B4D] via-[#094733] to-[#0A523B] text-white rounded-3xl p-6 sm:p-8 shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-6 border-2 border-[#FFB400]">
        <div className="flex items-center gap-4"><div className="w-14 h-14 rounded-2xl bg-[#FFB400] text-[#0E6B4D] flex items-center justify-center font-black text-2xl"><ShieldCheck className="w-8 h-8" /></div><div><h1 className="text-2xl font-black">Secured Admin — Only Owner Access</h1><p className="text-xs font-mono mt-0.5">Logged in as: <strong className="text-[#FFB400]">{currentUser.email}</strong></p></div></div>
        <div className="flex items-center gap-2"><button onClick={onOpenSetupModal} className="px-3.5 py-2 bg-emerald-800 text-emerald-100 rounded-xl text-xs font-bold border border-emerald-600 flex gap-1.5"><Database className="w-3.5 h-3.5 text-[#FFB400]" />SQL</button><button onClick={onLogout} className="px-4 py-2 bg-rose-600 text-white font-bold rounded-xl text-xs flex gap-1.5"><LogOut className="w-3.5 h-3.5" />লগআউট</button></div>
      </div>
      {toastMessage && <div className="p-4 bg-emerald-600 text-white rounded-2xl text-sm font-bold shadow-lg text-center">{toastMessage}</div>}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
        <div className="bg-white p-4 rounded-2xl border shadow-sm"><span className="text-xs text-slate-500 block">মোট নোট</span><span className="text-2xl font-black">{totalNotes}</span></div>
        <div className="bg-white p-4 rounded-2xl border shadow-sm"><span className="text-xs text-slate-500 block">ফ্রি</span><span className="text-2xl font-black text-emerald-700">{freeNotes}</span></div>
        <div className="bg-white p-4 rounded-2xl border shadow-sm"><span className="text-xs text-slate-500 block">প্রিমিয়াম</span><span className="text-2xl font-black text-amber-600">{premiumNotes}</span></div>
        <div className="bg-white p-4 rounded-2xl border shadow-sm"><span className="text-xs text-slate-500 block">ইউজার</span><span className="text-2xl font-black text-blue-700">{profiles.length || 1}</span></div>
        <div className="bg-white p-4 rounded-2xl border shadow-sm"><span className="text-xs text-slate-500 block">রেভিনিউ</span><span className="text-2xl font-black text-[#0E6B4D]">৳{totalRevenue}</span></div>
        <div className="bg-white p-4 rounded-2xl border shadow-sm"><span className="text-xs text-slate-500 block">ভিউ</span><span className="text-2xl font-black text-purple-700">{totalViews}</span></div>
      </div>
      <div className="bg-white p-2 rounded-2xl border shadow-sm flex gap-2 overflow-x-auto text-xs font-bold">
        <button onClick={() => setActiveTab('overview')} className={`px-4 py-2.5 rounded-xl ${activeTab === 'overview'? 'bg-[#0E6B4D] text-white' : 'text-slate-600 hover:bg-slate-100'}`}>Overview</button>
        <button onClick={() => setActiveTab('manage')} className={`px-4 py-2.5 rounded-xl ${activeTab === 'manage'? 'bg-[#0E6B4D] text-white' : 'text-slate-600 hover:bg-slate-100'}`}>Manage ({books.length})</button>
        <button onClick={() => { resetForm(); setActiveTab('add'); }} className={`px-4 py-2.5 rounded-xl ${activeTab === 'add'? 'bg-[#FFB400] text-[#0E6B4D]' : 'text-slate-600 hover:bg-slate-100'}`}>{editingBookId? 'Edit' : '+ Add New'}</button>
      </div>

      {activeTab === 'add' && (
        <div className="bg-white rounded-3xl p-6 sm:p-8 border shadow-xl space-y-6">
          <h3 className="text-xl font-bold">{editingBookId? 'নোট সম্পাদনা' : 'নতুন নোট যোগ'}</h3>
          <form onSubmit={handleFormSubmit} className="space-y-5 text-xs">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div><label className="font-bold block mb-1">শিরোনাম *</label><input required value={formData.title} onChange={(e) => handleTitleChange(e.target.value)} className="w-full px-3 py-2.5 border rounded-xl" /></div>
              <div><label className="font-bold block mb-1">Slug *</label><input required value={formData.slug} onChange={(e) => setFormData(p => ({...p, slug: e.target.value }))} className="w-full px-3 py-2.5 border rounded-xl font-mono" /></div>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div><label className="font-bold block mb-1">Class Level</label><select value={formData.class_level} onChange={(e) => handleClassLevelChange(parseInt(e.target.value))} className="w-full px-3 py-2.5 border rounded-xl"><option value={6}>Class 6</option><option value={9}>Class 9-10 SSC</option><option value={11}>HSC</option><option value={12}>Admission</option></select></div>
              <div><label className="font-bold block mb-1">বিষয়</label><input required value={formData.subject} onChange={(e) => setFormData(p => ({...p, subject: e.target.value }))} className="w-full px-3 py-2.5 border rounded-xl" /></div>
              <div><label className="font-bold block mb-1">অধ্যায়</label><input value={formData.chapter} onChange={(e) => setFormData(p => ({...p, chapter: e.target.value }))} className="w-full px-3 py-2.5 border rounded-xl" /></div>
            </div>
            <div><label className="font-bold block mb-1">বিবরণ</label><textarea rows={2} value={formData.description} onChange={(e) => setFormData(p => ({...p, description: e.target.value }))} className="w-full px-3 py-2 border rounded-xl" /></div>
            <div><label className="font-bold block mb-1">মূল কনটেন্ট HTML *</label><textarea rows={6} required value={formData.content_html} onChange={(e) => setFormData(p => ({...p, content_html: e.target.value }))} className="w-full p-3 font-mono border rounded-xl" /></div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div className="space-y-1.5">
                <label className="font-bold flex gap-1.5"><FileText className="w-4 h-4" /> PDF Upload *</label>
                <div onDragOver={(e) => { e.preventDefault(); setPdfDragActive(true); }} onDragLeave={() => setPdfDragActive(false)} onDrop={(e) => { e.preventDefault(); setPdfDragActive(false); if (e.dataTransfer.files[0]) handlePdfUpload(e.dataTransfer.files[0]); }} className={`border-2 border-dashed rounded-2xl p-4 text-center ${pdfDragActive? 'border-[#0E6B4D] bg-emerald-50' : 'border-slate-300 bg-slate-50'}`}>
                  <input type="file" accept=".pdf" onChange={(e) => e.target.files && handlePdfUpload(e.target.files[0])} className="absolute inset-0 opacity-0 cursor-pointer" />
                  {pdfUploading? <span>Uploading {pdfProgress}%</span> : formData.pdf_url? <div className="flex justify-between"><span className="truncate">{pdfFileName} ✓</span><button type="button" onClick={clearPdfUpload}><Trash2 className="w-4 h-4" /></button></div> : <span>PDF Drag & Drop</span>}
                </div>
                {pdfUploadError && <p className="text-rose-600">{pdfUploadError}</p>}
              </div>
              <div className="space-y-1.5">
                <label className="font-bold flex gap-1.5"><Sparkles className="w-4 h-4" /> Thumbnail</label>
                <div onDragOver={(e) => { e.preventDefault(); setThumbDragActive(true); }} onDragLeave={() => setThumbDragActive(false)} onDrop={(e) => { e.preventDefault(); setThumbDragActive(false); if (e.dataTransfer.files[0]) handleThumbnailUpload(e.dataTransfer.files[0]); }} className={`border-2 border-dashed rounded-2xl p-4 text-center ${thumbDragActive? 'border-[#0E6B4D] bg-emerald-50' : 'border-slate-300 bg-slate-50'}`}>
                  <input type="file" accept="image/*" onChange={(e) => e.target.files && handleThumbnailUpload(e.target.files[0])} className="absolute inset-0 opacity-0 cursor-pointer" />
                  {thumbUploading? <span>Uploading {thumbProgress}%</span> : formData.thumbnail_url? <img src={thumbPreview || formData.thumbnail_url} className="w-16 h-16 object-cover mx-auto rounded" /> : <span>Cover Image</span>}
                </div>
              </div>
            </div>

            <div className="space-y-2 border-2 border-dashed border-[#FFB400] bg-amber-50/50 p-4 rounded-2xl">
              <label className="font-bold flex gap-1.5 text-sm"><ImageIcon className="w-4 h-4 text-[#0E6B4D]" /> Preview এর জন্য ৩টা ছবি আপলোড করুন (এগুলো Detail Page এ সুন্দর Preview হিসেবে দেখাবে) - Max 6 টা</label>
              <div onDragOver={(e) => { e.preventDefault(); setPreviewDragActive(true); }} onDragLeave={() => setPreviewDragActive(false)} onDrop={(e) => { e.preventDefault(); setPreviewDragActive(false); handlePreviewImagesUpload(e.dataTransfer.files); }} className={`relative border-2 border-dashed rounded-2xl p-6 text-center ${previewDragActive? 'border-[#0E6B4D] bg-emerald-50' : 'border-slate-300 bg-white'}`}>
                <input type="file" accept="image/*" multiple onChange={(e) => e.target.files && handlePreviewImagesUpload(e.target.files)} className="absolute inset-0 w-full h-full opacity-0 cursor-pointer" />
                {previewUploading? <span className="font-bold">Uploading {previewProgress}%...</span> : <div><Upload className="w-6 h-6 mx-auto mb-1" /><p>Preview ছবি Drag করুন বা Click করে Select করুন (৩টা PDF এর Screenshot)</p></div>}
              </div>
              {previewImages.length > 0 && (
                <div className="grid grid-cols-3 gap-3 mt-3">
                  {previewImages.map((url, idx) => (
                    <div key={idx} className="relative group"><img src={url} className="w-full h-32 object-cover rounded-xl border shadow-sm" /><button type="button" onClick={() => removePreviewImage(idx)} className="absolute -top-2 -right-2 bg-rose-600 text-white rounded-full p-1"><X className="w-3 h-3" /></button><span className="absolute bottom-1 left-1 bg-black/70 text-white text- px-1.5 rounded">Page {idx+1}</span></div>
                  ))}
                </div>
              )}
              {previewUploadError && <p className="text-rose-600">{previewUploadError}</p>}
            </div>

            <div className="flex gap-3"><input type="checkbox" checked={formData.is_free} onChange={(e) => setFormData(p => ({...p, is_free: e.target.checked }))} /><label>ফ্রি?</label><input type="number" value={formData.price} onChange={(e) => setFormData(p => ({...p, price: parseInt(e.target.value) || 0 }))} className="border rounded px-2 py-1 w-20" placeholder="Price" /></div>
            <div className="flex justify-end gap-3 pt-4 border-t"><button type="button" onClick={resetForm} className="px-5 py-2.5 bg-slate-100 rounded-xl">বাতিল</button><button type="submit" className="px-8 py-3 bg-[#0E6B4D] text-white font-bold rounded-xl">{editingBookId? 'আপডেট' : 'Publish'}</button></div>
          </form>
        </div>
      )}
      {activeTab === 'manage' && <div className="bg-white rounded-3xl p-6 border"><h3 className="font-bold mb-4">Manage Notes ({books.length})</h3><div className="overflow-x-auto"><table className="w-full text-xs"><thead><tr className="bg-[#0E6B4D] text-white"><th className="p-3">Title</th><th className="p-3">Action</th></tr></thead><tbody>{books.map(b => <tr key={b.id} className="border-b"><td className="p-3">{b.title}</td><td className="p-3"><button onClick={() => handleEditClick(b)} className="px-2 py-1 bg-slate-100 rounded mr-2">Edit</button><button onClick={() => { if(confirm('Delete?')) onDeleteBook(b.id); }} className="px-2 py-1 bg-rose-100 text-rose-700 rounded">Delete</button></td></tr>)}</tbody></table></div></div>}
    </div>
  );
};
