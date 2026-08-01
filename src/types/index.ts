export interface Book {
  id: string;
  title: string;
  slug: string;
  class_level: number; // 6, 7, 8, 9, 10, 11, 12
  class_label: string; // e.g. "নবম-দশম শ্রেণী (SSC)"
  subject: string;
  chapter?: string;
  description: string;
  content_html: string;
  price: number;
  is_free: boolean;
  is_featured: boolean;
  pdf_url?: string;
  thumbnail_url?: string;
  views: number;
  created_at: string;
}

export interface Purchase {
  id: string;
  user_id: string;
  user_email?: string;
  book_id: string;
  book_title?: string;
  amount: number;
  trx_id: string;
  created_at: string;
  book?: Book;
}

export interface UserProfile {
  id: string;
  email: string;
  role: 'student' | 'admin';
  full_name: string;
  created_at?: string;
}

export interface ClassCategory {
  level: number | string;
  name: string;
  shortName: string;
  badge: string;
  iconName: string;
  description: string;
}
