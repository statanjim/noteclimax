import React, { useState, useEffect } from 'react';
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';
import { SupabaseSetupModal } from './components/SupabaseSetupModal';
import { HomePage } from './pages/HomePage';
import { NotesListPage } from './pages/NotesListPage';
import { NoteDetailPage } from './pages/NoteDetailPage';
import { DashboardPage } from './pages/DashboardPage';
import { LoginPage } from './pages/LoginPage';
import { AdminLoginPage } from './pages/AdminLoginPage';
import { AdminDashboardPage } from './pages/AdminDashboardPage';

import { Book, Purchase, UserProfile } from './types';
import { 
  getStoredBooks, saveStoredBooks, 
  getStoredPurchases, saveStoredPurchases, 
  getStoredUser, saveStoredUser,
  checkIsAdminEmail, ADMIN_EMAIL, isSupabaseConfigured, supabase
} from './lib/supabaseClient';

export default function App() {
  const [currentRoute, setCurrentRoute] = useState<string>(() => {
    if (typeof window !== 'undefined' && window.location.pathname && window.location.pathname !== '/') {
      return window.location.pathname;
    }
    return '/';
  });
  const [books, setBooks] = useState<Book[]>([]);
  const [purchases, setPurchases] = useState<Purchase[]>([]);
  const [profiles, setProfiles] = useState<UserProfile[]>([]);
  const [currentUser, setCurrentUser] = useState<{ email: string; full_name?: string } | null>(null);
  const [showSetupModal, setShowSetupModal] = useState(false);

  // Parse path and query params on load
  useEffect(() => {
    // Load local storage initial state
    const initialBooks = getStoredBooks();
    setBooks(initialBooks);

    const initialPurchases = getStoredPurchases();
    setPurchases(initialPurchases);

    const initialUser = getStoredUser();
    if (initialUser) {
      setCurrentUser(initialUser);
      setProfiles([{
        id: '1',
        email: initialUser.email,
        full_name: initialUser.full_name || initialUser.email.split('@')[0],
        role: checkIsAdminEmail(initialUser.email) ? 'admin' : 'student'
      }]);
    }

    // Attempt to sync with Supabase if configured
    if (isSupabaseConfigured) {
      syncWithSupabase();
    }
  }, []);

  const syncWithSupabase = async () => {
    try {
      const { data: dbBooks } = await supabase.from('books').select('*').order('created_at', { ascending: false });
      if (dbBooks && dbBooks.length > 0) {
        setBooks(dbBooks as Book[]);
        saveStoredBooks(dbBooks as Book[]);
      }

      const { data: dbPurchases } = await supabase.from('purchases').select('*');
      if (dbPurchases) {
        setPurchases(dbPurchases as Purchase[]);
        saveStoredPurchases(dbPurchases as Purchase[]);
      }
    } catch (e) {
      console.warn('Supabase fetch notice: using local state fallback.', e);
    }
  };

  const handleNavigate = (route: string) => {
    setCurrentRoute(route);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleStudentLogin = (email: string, fullName?: string) => {
    const userObj = { email, full_name: fullName };
    setCurrentUser(userObj);
    saveStoredUser(userObj);

    // Update profiles list
    setProfiles((prev) => {
      if (prev.some(p => p.email === email)) return prev;
      return [...prev, {
        id: String(Date.now()),
        email,
        full_name: fullName || email.split('@')[0],
        role: checkIsAdminEmail(email) ? 'admin' : 'student'
      }];
    });

    if (checkIsAdminEmail(email)) {
      handleNavigate('/admin/dashboard');
    } else {
      handleNavigate('/dashboard');
    }
  };

  const handleAdminLoginSuccess = (email: string) => {
    const userObj = { email, full_name: 'Owner Admin' };
    setCurrentUser(userObj);
    saveStoredUser(userObj);

    setProfiles((prev) => {
      if (prev.some(p => p.email === email)) return prev;
      return [...prev, {
        id: String(Date.now()),
        email,
        full_name: 'Owner Admin',
        role: 'admin'
      }];
    });

    handleNavigate('/admin/dashboard');
  };

  const handleLogout = () => {
    setCurrentUser(null);
    saveStoredUser(null);
    handleNavigate('/');
  };

  const handleSaveBook = (bookData: Partial<Book>) => {
    setBooks((prevBooks) => {
      let updated: Book[];
      if (bookData.id) {
        // Edit
        updated = prevBooks.map((b) => b.id === bookData.id ? { ...b, ...bookData } as Book : b);
      } else {
        // Create new
        const newBook: Book = {
          id: String(Date.now()),
          title: bookData.title || '',
          slug: bookData.slug || `note-${Date.now()}`,
          class_level: bookData.class_level || 9,
          class_label: bookData.class_label || 'নবম-দশম শ্রেণী (SSC)',
          subject: bookData.subject || 'পদার্থবিজ্ঞান',
          chapter: bookData.chapter || '',
          description: bookData.description || '',
          content_html: bookData.content_html || '',
          price: bookData.price || 0,
          is_free: bookData.is_free ?? true,
          is_featured: bookData.is_featured ?? false,
          pdf_url: bookData.pdf_url || '',
          thumbnail_url: bookData.thumbnail_url || '',
          views: 0,
          created_at: new Date().toISOString(),
        };
        updated = [newBook, ...prevBooks];
      }
      saveStoredBooks(updated);
      return updated;
    });

    if (isSupabaseConfigured) {
      supabase.from('books').upsert([bookData]).then(({ error }) => {
        if (error) console.error('Supabase upsert book error:', error);
      });
    }
  };

  const handleDeleteBook = (bookId: string) => {
    setBooks((prev) => {
      const updated = prev.filter((b) => b.id !== bookId);
      saveStoredBooks(updated);
      return updated;
    });

    if (isSupabaseConfigured) {
      supabase.from('books').delete().eq('id', bookId).then(({ error }) => {
        if (error) console.error('Supabase delete book error:', error);
      });
    }
  };

  const handleIncrementViews = (bookId: string) => {
    setBooks((prev) => {
      const updated = prev.map((b) => b.id === bookId ? { ...b, views: (b.views || 0) + 1 } : b);
      saveStoredBooks(updated);
      return updated;
    });

    if (isSupabaseConfigured) {
      const target = books.find(b => b.id === bookId);
      if (target) {
        supabase.from('books').update({ views: (target.views || 0) + 1 }).eq('id', bookId).then();
      }
    }
  };

  const handleRecordPurchase = (bookId: string, amount: number, trxId: string) => {
    const book = books.find(b => b.id === bookId);
    const newPurchase: Purchase = {
      id: String(Date.now()),
      user_id: currentUser?.email || 'guest',
      user_email: currentUser?.email || 'guest',
      book_id: bookId,
      book_title: book?.title,
      amount,
      trx_id: trxId,
      created_at: new Date().toISOString(),
    };

    setPurchases((prev) => {
      const updated = [newPurchase, ...prev];
      saveStoredPurchases(updated);
      return updated;
    });

    if (isSupabaseConfigured) {
      supabase.from('purchases').insert([newPurchase]).then();
    }
  };

  const handleResetSampleData = () => {
    setBooks([]);
    setPurchases([]);
    saveStoredBooks([]);
    saveStoredPurchases([]);
  };

  // Render current view component
  const renderCurrentPage = () => {
    const route = currentRoute.split('?')[0];

    if (route === '/') {
      return (
        <HomePage
          books={books}
          onNavigate={handleNavigate}
          currentUser={currentUser}
          onOpenSetupModal={() => setShowSetupModal(true)}
        />
      );
    }

    if (route === '/notes') {
      const urlParams = new URLSearchParams(currentRoute.split('?')[1] || '');
      return (
        <NotesListPage
          books={books}
          onNavigate={handleNavigate}
          initialClassFilter={urlParams.get('class') || 'all'}
          initialSubjectFilter={urlParams.get('subject') || 'all'}
          initialSearchQuery={urlParams.get('search') || ''}
        />
      );
    }

    if (route.startsWith('/notes/')) {
      const slug = route.replace('/notes/', '');
      return (
        <NoteDetailPage
          slug={slug}
          books={books}
          purchases={purchases}
          currentUser={currentUser}
          onNavigate={handleNavigate}
          onRecordPurchase={handleRecordPurchase}
          onIncrementViews={handleIncrementViews}
        />
      );
    }

    if (route === '/dashboard') {
      return (
        <DashboardPage
          currentUser={currentUser}
          books={books}
          purchases={purchases}
          onNavigate={handleNavigate}
        />
      );
    }

    if (route === '/login') {
      return (
        <LoginPage
          onLogin={handleStudentLogin}
          onNavigate={handleNavigate}
        />
      );
    }

    // SECRET ADMIN ENTRY POINT - No links or buttons exist anywhere on the site for this route
    if (route === '/owner-access-noteclimax-tanjimsource') {
      return (
        <AdminLoginPage
          onAdminLoginSuccess={handleAdminLoginSuccess}
          onNavigate={handleNavigate}
          onOpenSetupModal={() => setShowSetupModal(true)}
        />
      );
    }

    // PROTECTED ADMIN DASHBOARD ROUTES: Only accessible if logged-in user email strictly matches VITE_ADMIN_EMAIL
    if (route === '/admin' || route === '/admin/dashboard') {
      if (!checkIsAdminEmail(currentUser?.email)) {
        // Not authorized as owner admin -> redirect to home page
        return (
          <HomePage
            books={books}
            onNavigate={handleNavigate}
            currentUser={currentUser}
            onOpenSetupModal={() => setShowSetupModal(true)}
          />
        );
      }

      return (
        <AdminDashboardPage
          currentUser={currentUser}
          books={books}
          purchases={purchases}
          profiles={profiles}
          onNavigate={handleNavigate}
          onLogout={handleLogout}
          onSaveBook={handleSaveBook}
          onDeleteBook={handleDeleteBook}
          onResetSampleData={handleResetSampleData}
          onOpenSetupModal={() => setShowSetupModal(true)}
        />
      );
    }

    // Default fallback to Home
    return (
      <HomePage
        books={books}
        onNavigate={handleNavigate}
        currentUser={currentUser}
        onOpenSetupModal={() => setShowSetupModal(true)}
      />
    );
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#F6FFFB]">
      <Navbar
        currentRoute={currentRoute}
        onNavigate={handleNavigate}
        currentUser={currentUser}
        onLogout={handleLogout}
      />

      <main className="flex-1">
        {renderCurrentPage()}
      </main>

      <Footer onNavigate={handleNavigate} />

      {/* Supabase Schema Modal */}
      {showSetupModal && (
        <SupabaseSetupModal onClose={() => setShowSetupModal(false)} />
      )}
    </div>
  );
}
