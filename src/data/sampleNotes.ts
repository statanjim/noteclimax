import { Book } from '../types';

export const SAMPLE_PRESET_NOTES: Partial<Book>[] = [
  {
    title: "এসএসসি পদার্থবিজ্ঞান: ১ম অধ্যায় - ভৌত রাশি ও পরিমাপ (সম্পূর্ণ নোট)",
    slug: "ssc-physics-ch1-physical-quantities-measurement",
    class_level: 9,
    class_label: "নবম-দশম শ্রেণী (SSC)",
    subject: "পদার্থবিজ্ঞান",
    chapter: "অধ্যায় ১: ভৌত রাশি ও পরিমাপ",
    description: "এসএসসি পরীক্ষার জন্য ভৌত রাশি, পরিমাপের একক, ভার্নিয়ার স্কেল, স্লাইড ক্যালিপার্স ও স্ক্রু গজ সংক্রান্ত সম্পূর্ণ ব্যাখ্যা ও গাণিতিক সূত্রের হ্যান্ডনোট।",
    is_free: true,
    is_featured: true,
    price: 0,
    pdf_url: "https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf",
    thumbnail_url: "https://images.unsplash.com/photo-1636466497217-26a8cbeaf0aa?w=600&q=80",
    content_html: `
      <h2>১.১ ভৌত রাশি ও এর প্রকারভেদ</h2>
      <p>এই জগতে যা কিছু পরিমাপ করা যায় তাকেই <strong>ভৌত রাশি</strong> বলে। যেমন: দৈর্ঘ্য, ভর, সময়, তাপমাত্রা, তড়িৎ প্রবাহ ইত্যাদি।</p>
      
      <div class="highlight-box">
        <strong>📌 মনে রাখার বিষয়:</strong> ভৌত রাশি প্রধানত দুই প্রকার — (১) মৌলিক রাশি এবং (২) লব্ধ রাশি।
      </div>

      <h3>মৌলিক রাশি সমূহের তালিকা (SI Unit)</h3>
      <table>
        <thead>
          <tr>
            <th>রাশির নাম</th>
            <th>এস.আই একক (SI Unit)</th>
            <th>এককের প্রতীক</th>
            <th>মাত্রা (Dimension)</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>দৈর্ঘ্য (Length)</td>
            <td>মিটার (Meter)</td>
            <td>m</td>
            <td>L</td>
          </tr>
          <tr>
            <td>ভর (Mass)</td>
            <td>কিলোগ্রাম (Kilogram)</td>
            <td>kg</td>
            <td>M</td>
          </tr>
          <tr>
            <td>সময় (Time)</td>
            <td>সেকেন্ড (Second)</td>
            <td>s</td>
            <td>T</td>
          </tr>
          <tr>
            <td>তাপমাত্রা (Temperature)</td>
            <td>কেলভিন (Kelvin)</td>
            <td>K</td>
            <td>Θ</td>
          </tr>
          <tr>
            <td>তড়িৎ প্রবাহ (Electric Current)</td>
            <td>অ্যাম্পিয়ার (Ampere)</td>
            <td>A</td>
            <td>I</td>
          </tr>
        </tbody>
      </table>

      <h2>১.২ স্লাইড ক্যালিপার্স ও ভার্নিয়ার ধ্রুবক (Vernier Constant)</h2>
      <p>প্রধান স্কেলের ক্ষুদ্রতম এক ভাগের চেয়ে ভার্নিয়ার স্কেলের এক ভাগ কতটুকু ছোট, তার পরিমাণকে <strong>ভার্নিয়ার ধ্রুবক (VC)</strong> বলে।</p>
      
      <div class="warning-box">
        <strong>💡 গাণিতিক সূত্র:</strong><br>
        <code>VC = s / n</code><br>
        যেখানে s = প্রধান স্কেলের ১ ভাগের দৈর্ঘ্য (সাধারণত ১ মিমি) এবং n = ভার্নিয়ার স্কেলের মোট ভাগ সংখ্যা।
      </div>

      <h3>পরিমাপের প্রয়োজনীয় গাণিতিক সূত্রাবলী</h3>
      <table>
        <thead>
          <tr>
            <th>বিষয়</th>
            <th>গাণিতিক সূত্র</th>
            <th>ব্যাখ্যা</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>মোট দৈর্ঘ্য পরিমাপ</td>
            <td>L = M + (V × VC)</td>
            <td>M = প্রধান স্কেল পাঠ, V = ভার্নিয়ার সমপাতন</td>
          </tr>
          <tr>
            <td>স্ক্রু গজের পিচ (Pitch)</td>
            <td>Pitch = রৈখিক স্কেলের সরণ / ঘূর্ণন সংখ্যা</td>
            <td>বৃত্তাকার স্কেলের ১ পূর্ণ ঘূর্ণনে রৈখিক স্কেলের সরণ</td>
          </tr>
          <tr>
            <td>লঘিষ্ঠ গণন (Least Count)</td>
            <td>LC = Pitch / N</td>
            <td>N = বৃত্তাকার স্কেলের মোট ভাগ সংখ্যা</td>
          </tr>
        </tbody>
      </table>
    `
  },
  {
    title: "এইচএসসি রসায়ন ১ম পত্র: ২য় অধ্যায় - গুণগত রসায়ন (প্রিমিয়াম গাইড)",
    slug: "hsc-chemistry-ch2-qualitative-chemistry-premium",
    class_level: 11,
    class_label: "একাদশ-দ্বাদশ শ্রেণী (HSC)",
    subject: "রসায়ন",
    chapter: "অধ্যায় ২: গুণগত রসায়ন",
    description: "কোয়ান্টাম সংখ্যা, বোর পরমাণু মডেল, আবফাউ নীতি, দ্রাব্যতা ও দ্রাব্যতা গুণফল (Ksp) এর ওপর সম্পূর্ণ এডভান্সড গাণিতিক শর্টকাট নোট।",
    is_free: false,
    is_featured: true,
    price: 99,
    pdf_url: "https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf",
    thumbnail_url: "https://images.unsplash.com/photo-1603126857599-f6e157fa2fe6?w=600&q=80",
    content_html: `
      <h2>২.১ কোয়ান্টাম সংখ্যা ও পরমাণুর ইলেকট্রন বিন্যাস</h2>
      <p>পরমাণুতে ইলেকট্রনের সঠিক অবস্থান, কক্ষপথের আকার, আকৃতি এবং দিক-বিন্যাস প্রকাশের জন্য ব্যবহৃত ৪টি সংখ্যাকে <strong>কোয়ান্টাম সংখ্যা</strong> বলা হয়।</p>

      <div class="highlight-box">
        <strong>গুরুত্বপূর্ণ নীতিসমূহ:</strong>
        <ul>
          <li><strong>আবফাউ নীতি (Aufbau Principle):</strong> ইলেকট্রন প্রথমে নিম্ন শক্তির অরবিটালে প্রবেশ করে এবং পরে ক্রমান্বয়ে উচ্চ শক্তির অরবিটালে গমন করে। (n + l নিয়ম)</li>
          <li><strong>পাউলির বর্জন নীতি (Pauli Exclusion Principle):</strong> একটি পরমাণুর যেকোনো দুটি ইলেকট্রনের চারটি কোয়ান্টাম সংখ্যার মান কখনোই একই হতে পারে না।</li>
          <li><strong>হুন্ডের নীতি (Hund's Rule):</strong> সমশক্তিসম্পন্ন অরবিটালে ইলেকট্রনগুলো এমনভাবে অবস্থান করবে যেন তারা সর্বাধিক বিজোড় অবস্থায় থাকে।</li>
        </ul>
      </div>

      <h3>অরবিটাল সমূহের শক্তি ক্রম (n + l)</h3>
      <table>
        <thead>
          <tr>
            <th>অরবিটাল</th>
            <th>n এর মান</th>
            <th>l এর মান</th>
            <th>(n + l) মান</th>
            <th>শক্তির ক্রম</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>1s</td>
            <td>1</td>
            <td>0</td>
            <td>1</td>
            <td>সর্বনিম্ন শক্তি</td>
          </tr>
          <tr>
            <td>2s</td>
            <td>2</td>
            <td>0</td>
            <td>2</td>
            <td>নিম্ন শক্তি</td>
          </tr>
          <tr>
            <td>2p</td>
            <td>2</td>
            <td>1</td>
            <td>3</td>
            <td>মাঝারি শক্তি</td>
          </tr>
          <tr>
            <td>3d vs 4s</td>
            <td>3d (3+2=5)</td>
            <td>4s (4+0=4)</td>
            <td>4s < 3d</td>
            <td>4s এ ইলেকট্রন আগে প্রবেশ করবে</td>
          </tr>
        </tbody>
      </table>
    `
  }
];
