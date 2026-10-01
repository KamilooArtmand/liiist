import React from 'react';
import { motion } from 'framer-motion';

export const ManifestoPage: React.FC = () => {
  return (
    <div className="w-full min-h-screen bg-neutral-50 dark:bg-black text-neutral-900 dark:text-neutral-100 flex flex-col items-center selection:bg-neutral-900 selection:text-white dark:selection:bg-white dark:selection:text-black font-sans">
      
      {/* Hero Section */}
      <motion.section 
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        className="w-full max-w-5xl px-6 pt-32 pb-24 flex flex-col items-center text-center border-b border-neutral-200 dark:border-neutral-900"
      >
        <div className="flex items-center space-x-6 mb-12">
          {/* liiist logo rotated -90deg */}
          <div className="transform -rotate-90 flex items-center gap-1">
            <span className="w-1 h-8 bg-black dark:bg-white inline-block"></span>
            <span className="w-1 h-8 bg-black dark:bg-white inline-block"></span>
            <span className="w-1 h-8 bg-black dark:bg-white inline-block"></span>
          </div>
        </div>

        <h1 className="text-5xl md:text-7xl font-black tracking-tighter mb-6 leading-tight">
          یک پروتکل جدید برای تمدن.
        </h1>
        <h2 className="text-xl md:text-3xl text-neutral-500 font-light tracking-tight max-w-3xl mb-12">
          از سطح یک سایت «لیست‌ساز» تا سیستم‌عامل دانش بشری.
        </h2>
        
        <div className="px-6 py-3 rounded-full border border-neutral-200 dark:border-neutral-800 text-sm font-bold tracking-widest uppercase mb-16">
          1 World, 1 Liiist
        </div>

        <blockquote className="text-2xl md:text-4xl font-medium tracking-tight text-neutral-800 dark:text-neutral-200 leading-snug max-w-4xl italic">
          "ما گوگل را برای جستجو، ویکی‌پدیا را برای دانستن، و اینستاگرام را برای دیدن داریم.<br/><br/>
          <span className="text-neutral-400 dark:text-neutral-600">اما هیچکس جهان را مرتب نکرده است. liiist آمده تا جهان را لیست کند."</span>
        </blockquote>
      </motion.section>

      {/* Philosophy Section */}
      <motion.section 
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-100px" }}
        transition={{ duration: 0.8 }}
        className="w-full max-w-4xl px-6 py-24 border-b border-neutral-200 dark:border-neutral-900"
      >
        <div className="flex items-center gap-4 mb-12">
          <div className="w-8 h-8 rounded-full border-2 border-neutral-900 dark:border-white flex items-center justify-center font-bold">1</div>
          <h3 className="text-3xl font-bold tracking-tight">فلسفه: چرا جهان به liiist نیاز دارد؟</h3>
        </div>
        
        <p className="text-lg md:text-xl text-neutral-600 dark:text-neutral-400 leading-relaxed mb-8">
          بشر از کتابخانه اسکندریه تا Mundaneum پل اوتله، یک رویای واحد داشته: دسترسی لحظه‌ای به تمام دانش مرتب شده. مشکل اینترنت امروز کمبود اطلاعات نیست، فلج ناشی از فراوانی و بی‌نظمی آن است. گوگل به شما ۱۰ لینک آبی می‌دهد، نه پاسخ قطعی. اینستاگرام به شما محتوای الگوریتمی می‌دهد، نه انتخاب آگاهانه. آمازون به شما محصول پولی می‌دهد، نه بهترین محصول.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-12">
          <div className="p-6 bg-white dark:bg-neutral-950 border border-neutral-200 dark:border-neutral-800 rounded-3xl">
            <h4 className="text-xl font-bold mb-4">اصل اتمیک بودن</h4>
            <p className="text-neutral-500 dark:text-neutral-400 text-sm leading-relaxed">
              هر چیزی در جهان یک Unit قابل شمارش است. یک کتاب، یک انسان، یک هتل، یک واژه. جهان مجموعه‌ای از واحدهاست نه صفحات وب.
            </p>
          </div>
          <div className="p-6 bg-white dark:bg-neutral-950 border border-neutral-200 dark:border-neutral-800 rounded-3xl">
            <h4 className="text-xl font-bold mb-4">نظم فراکتال</h4>
            <p className="text-neutral-500 dark:text-neutral-400 text-sm leading-relaxed">
              هر مجموعه‌ای، خود زیرمجموعه‌ای از یک مجموعه بزرگتر است. دانش ساختار درختی-فراکتال دارد. از لیست کیهانی تا کوچکترین واحد.
            </p>
          </div>
          <div className="p-6 bg-white dark:bg-neutral-950 border border-neutral-200 dark:border-neutral-800 rounded-3xl">
            <h4 className="text-xl font-bold mb-4">انتخاب شایسته‌سالار</h4>
            <p className="text-neutral-500 dark:text-neutral-400 text-sm leading-relaxed">
              بهترین انتخاب نباید شانسی، تبلیغاتی یا تحمیلی باشد. باید بر اساس داده‌ی شفاف و قابل مقایسه انتخاب شود. liiist دموکراسی انتخاب را ممکن می‌کند.
            </p>
          </div>
        </div>
      </motion.section>

      {/* Anatomy & Naming */}
      <motion.section 
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-100px" }}
        transition={{ duration: 0.8 }}
        className="w-full max-w-4xl px-6 py-24 border-b border-neutral-200 dark:border-neutral-900"
      >
        <div className="flex items-center gap-4 mb-12">
          <div className="w-8 h-8 rounded-full border-2 border-neutral-900 dark:border-white flex items-center justify-center font-bold">2</div>
          <h3 className="text-3xl font-bold tracking-tight">کالبدشکافی برند: نبوغ پنهان liiist</h3>
        </div>
        
        <div className="flex flex-col md:flex-row gap-12 items-center">
          <div className="w-full md:w-1/2">
            <p className="text-lg text-neutral-600 dark:text-neutral-400 leading-relaxed mb-6">
              آیکون جهانی List که سه خط افقی ≡ است، اگر ۹۰ درجه بچرخد به iii تبدیل می‌شود. ما این سه i را در قلب List کاشتیم و Liiist متولد شد. این یعنی ما خودِ مفهوم لیست هستیم.
            </p>
            <p className="text-lg text-neutral-600 dark:text-neutral-400 leading-relaxed">
              این نام خود یک سیستم بی‌نهایت است: liiiist پایه است، اما liiiiiiiiiist به معنای بی‌نهایت نتیجه است. درست مانند Goooooogle که برای نشان دادن صفحات بیشتر استفاده می‌کرد.
            </p>
          </div>
          <div className="w-full md:w-1/2 flex items-center justify-center p-12 bg-neutral-100 dark:bg-neutral-900 rounded-[40px]">
            <div className="text-6xl font-bold tracking-widest flex items-center gap-2">
              l
              <div className="flex items-center gap-1 text-blue-600">
                <span>i</span>
                <span>i</span>
                <span>i</span>
              </div>
              st
            </div>
          </div>
        </div>
      </motion.section>

      {/* Architecture */}
      <motion.section 
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-100px" }}
        transition={{ duration: 0.8 }}
        className="w-full max-w-4xl px-6 py-24 border-b border-neutral-200 dark:border-neutral-900"
      >
        <div className="flex items-center gap-4 mb-12">
          <div className="w-8 h-8 rounded-full border-2 border-neutral-900 dark:border-white flex items-center justify-center font-bold">3</div>
          <h3 className="text-3xl font-bold tracking-tight">معماری اطلاعات: DNA نوین دانش</h3>
        </div>
        
        <div className="space-y-12">
          <div className="flex flex-col md:flex-row gap-6 items-start">
            <div className="text-4xl font-bold text-neutral-300 dark:text-neutral-800">L0</div>
            <div>
              <h4 className="text-2xl font-bold mb-2">لیست کیهانی (The Cosmic List)</h4>
              <p className="text-neutral-600 dark:text-neutral-400 leading-relaxed">
                یک پایگاه داده لایتناهی و Ontology محور که هر Unit در جهان یک ردیف از آن است. هر واحد یک Liiist ID منحصر به فرد دارد - اثر انگشت دیجیتال.
              </p>
            </div>
          </div>
          <div className="flex flex-col md:flex-row gap-6 items-start">
            <div className="text-4xl font-bold text-neutral-300 dark:text-neutral-800">L1</div>
            <div>
              <h4 className="text-2xl font-bold mb-2">لیست‌های مادر (The Master Lists)</h4>
              <p className="text-neutral-600 dark:text-neutral-400 leading-relaxed">
                موتور هوشمند liiist با درک خواص Ontology هر واحد، آن را به صورت خودکار در لیست مادر خود قرار می‌دهد (مثل: لیست تمام کتاب‌های جهان، لیست تمام هتل‌ها).
              </p>
            </div>
          </div>
          <div className="flex flex-col md:flex-row gap-6 items-start">
            <div className="text-4xl font-bold text-neutral-300 dark:text-neutral-800">L2</div>
            <div>
              <h4 className="text-2xl font-bold mb-2">لیست‌های فراکتال (The Fractal Lists)</h4>
              <p className="text-neutral-600 dark:text-neutral-400 leading-relaxed">
                شکستن بازگشتی و هوشمند بر اساس متادیتا. مثال: کتاب‌ها {'>'} فارسی {'>'} فلسفی {'>'} منتشر شده بعد از ۱۳۹۰ با امتیاز بالای ۴.۵.
              </p>
            </div>
          </div>
          <div className="flex flex-col md:flex-row gap-6 items-start">
            <div className="text-4xl font-bold text-neutral-300 dark:text-neutral-800">L3</div>
            <div>
              <h4 className="text-2xl font-bold mb-2">واحد اتمیک (The Atomic Unit Page)</h4>
              <p className="text-neutral-600 dark:text-neutral-400 leading-relaxed">
                تهِ هر فراکتال، یک واحد است که خود یک میکرو-سایت است. این یعنی ادغام ویکی‌پدیا، IMDB، آمازون و تریپ‌ادوایزر در یک صفحه واحد با Layout متغیر بر اساس جنس داده.
              </p>
            </div>
          </div>
        </div>
      </motion.section>

      {/* Economy */}
      <motion.section 
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-100px" }}
        transition={{ duration: 0.8 }}
        className="w-full max-w-4xl px-6 py-24"
      >
        <div className="flex items-center gap-4 mb-12">
          <div className="w-8 h-8 rounded-full border-2 border-neutral-900 dark:border-white flex items-center justify-center font-bold">4</div>
          <h3 className="text-3xl font-bold tracking-tight">مدل اقتصادی: موتور سه‌گانه</h3>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="p-8 bg-neutral-100 dark:bg-neutral-900 rounded-[32px]">
            <h4 className="text-xl font-bold mb-4">اقتصاد سازندگان</h4>
            <p className="text-neutral-600 dark:text-neutral-400 text-sm leading-relaxed">
              هر کلیک و بازدیدی که از طریق لیست شما برای یک برند ایجاد شود، با توکن LST به شما پاداش داده می‌شود. اینفلوئنسر مارکتینگ، دموکراتیک و شفاف.
            </p>
          </div>
          <div className="p-8 bg-neutral-100 dark:bg-neutral-900 rounded-[32px]">
            <h4 className="text-xl font-bold mb-4">تبلیغات شفاف</h4>
            <p className="text-neutral-600 dark:text-neutral-400 text-sm leading-relaxed">
              هر محتوای پولی با تگ زرد Sponsored مشخص می‌شود. تبلیغات در liiist مزاحم نیست، بلکه یک میانبر شفاف در صدر نتایج است.
            </p>
          </div>
          <div className="p-8 bg-neutral-100 dark:bg-neutral-900 rounded-[32px]">
            <h4 className="text-xl font-bold mb-4">اکوسیستم Pro</h4>
            <p className="text-neutral-600 dark:text-neutral-400 text-sm leading-relaxed">
              داشبورد پیشرفته، خروجی دیتا، چت‌بات هوش مصنوعی اختصاصی، و پنل‌های سازمانی با دریافت تیک وریفای (Verified Badge) برای نهادها.
            </p>
          </div>
        </div>
      </motion.section>

      {/* Footer / Conclusion */}
      <motion.footer 
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 1 }}
        className="w-full text-center py-32 bg-neutral-100 dark:bg-neutral-900 px-6 mt-12"
      >
        <h2 className="text-4xl md:text-5xl font-black tracking-tighter mb-6">ما با liiist به هرج و مرج اطلاعات پایان می‌دهیم.</h2>
        <p className="text-xl text-neutral-500 dark:text-neutral-400 max-w-2xl mx-auto mb-12">
          اگر گوگل جهان را قابل جستجو کرد، liiist جهان را قابل انتخاب می‌کند. رفتار جدیدی در راه است: دیگر جستجو نمی‌کنیم، لیست می‌کنیم.
        </p>
        <div className="inline-flex items-center justify-center space-x-2">
          <span className="w-3 h-3 bg-black dark:bg-white rounded-full animate-pulse"></span>
          <span className="font-bold tracking-widest uppercase">Liiist it.</span>
        </div>
      </motion.footer>

    </div>
  );
};
