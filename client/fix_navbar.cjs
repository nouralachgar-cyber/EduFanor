const fs = require('fs');
let content = fs.readFileSync('src/pages/PublicLandingPage.jsx', 'utf8');

// Replace the entire navbar section
const oldNavbar = `<div className="fixed inset-x-0 top-0 z-50 border-b border-white/10 bg-[#0A1712]/90 text-[#FCFAF6] backdrop-blur-xl transition-shadow duration-300 {
          scrolled ? 'shadow-[0_18px_50px_-30px_rgba(0,0,0,0.9)]' : ''
        }">
        <div className="mx-auto flex h-[4.5rem] max-w-7il items-center justify-between gap-4 px-5 lg:px-12">
          <Link to="/" className="group flex items-center gap-3">
            <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#F59E42] text-[#0A1712] shadow-md transition-transform duration-300 group-hover:scale-105">
              <ShieldCheck className="h-5 w-5" />
            </span>
            <span className="font-display text-xl font-semibold tracking-tight text-[#FCFAF6]">EduFanor</span>
          </Link>

          <nav className="hidden items-center gap-1 lg:flex" aria-label={isAr ? 'التنقل الرئيسي' : 'Main navigation'}>
            {navItems.map((item) => (
              <a
                key={item.href}
                href={item.href}
                className="rounded-full px-3.5 py-2 text-xs font-bold text-[#FCFAF6]/70 transition-colors hover:bg-white/5 hover:text-[#FFD09A]"
              >
                {item.label}
              </a>
            ))}
          </nav>

          <div className="flex items-center gap-2">
            <div
              className="hidden items-center rounded-full border border-white/15 bg-white/5 p-1 sm:flex"
              role="group"
              aria-label={isAr ? 'اختيار اللغة' : 'Language selector'}
            >
              <button
                onClick={() => i18n.changeLanguage('ar')}
                className={`rounded-full px-2.5 py-1 text-[10px] font-extrabold transition-colors ${
                  isAr ? 'bg-[#FFD09A] text-[#0A1712]' : 'text-[#FCFAF6]/60 hover:text-[#FCFAF6]'
                }`}
              >
                ع
              </button>
              <button
                onClick={() => i18n.changeLanguage('en')}
                className={`rounded-full px-2.5 py-1 text-[10px] font-extrabold transition-colors ${
                  !isAr ? 'bg-[#FFD09A] text-[#0A1712]' : 'text-[#FCFAF6]/60 hover:text-[#FCFAF6]'
                }`}
              >
                EN
              </button>
            </div>

            <button
              onClick={toggleTheme}
              aria-label={isAr ? 'تبديل المظهر' : 'Toggle theme'}
              className="flex h-9 w-9 items-center justify-center rounded-full border border-white/15 bg-white/5 text-[#FCFAF6] transition-colors hover:bg-white/10"
            >
              {isDark ? <Sun className="h-4 w-4 text-amber-300" /> : <Moon className="h-4 w-4" />}
            </button>

            <Link
              to="/login"
              className="hidden px-3 py-2 text-xs font-bold text-[#FCFAF6]/80 transition-colors hover:text-[#FFD09A] sm:inline-flex"
            >
              {isAr ? 'دخول' : 'Sign in'}
            </Link>

            <Link
              to="/register"
              className="hidden items-center gap-2 rounded-full bg-[#F59E42] px-4 py-2.5 text-xs font-extrabold text-[#0A1712] shadow-md transition-all hover:-translate-y-0.5 hover:bg-[#FFD09A] sm:inline-flex"
            >
              {isAr ? 'ابدأ مجاناً' : 'Start free'}
              {isAr ? <ArrowLeft className="h-3.5 w-3.5" /> : <ArrowRight className="h-3.5 w-3.5" />}
            </Link>

            <button
              onClick={() => setMobileMenuOpen((open) => !open)}
              aria-label={isAr ? 'القائمة' : 'Menu'}
              aria-expanded={mobileMenuOpen}
              className="flex h-9 w-9 items-center justify-center rounded-full border border-white/15 bg-white/5 lg:hidden"
            >
              {mobileMenuOpen ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
            </button>
          </div>
        </div>
      </div>
    </div>`;

const newNavbar = `<div className="fixed inset-x-0 top-0 z-50 border-b border-white/10 bg-[#0A1712]/80 backdrop-blur-xl transition-shadow duration-300 shadow-[0_12px_40px_-20px_rgba(0,0,0,0.6)]">
        <div className="mx-auto flex h-[4.5rem] max-w-7xl items-center justify-between gap-4 px-5 lg:px-12">
          <Link to="/" className="group flex items-center gap-3">
            <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#F59E42] text-[#0A1712] shadow-md transition-transform duration-300 group-hover:scale-105">
              <ShieldCheck className="h-5 w-5" />
            </span>
            <span className="font-display text-xl font-semibold tracking-tight text-[#FCFAF6]">EduFanor</span>
          </Link>

          <nav className="hidden items-center gap-2 lg:flex flex-row space-x-8">
            {navItems.map((item) => (
              <a
                key={item.href}
                href={item.href}
                className="font-display text-sm font-medium transition-colors text-[#FCFAF6]/80 hover:text-[#FFD09A] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#F59E42]/40"
              >
                {item.label}
              </a>
            ))}
          </nav>

          <div className="flex items-center gap-3">
            <div
              className="hidden items-center rounded-full border border-white/15 bg-white/5 p-1 sm:flex"
              role="group"
              aria-label={isAr ? 'اختيار اللغة' : 'Language selector'}
            >
              <button
                onClick={() => i18n.changeLanguage('ar')}
                className={`rounded-full px-2.5 py-1 text-[10px] font-extrabold transition-colors ${
                  isAr ? 'bg-[#FFD09A] text-[#0A1712]' : 'text-[#FCFAF6]/60 hover:text-[#FCFAF6]'
                }`}
              >
                ع
              </button>
              <button
                onClick={() => i18n.changeLanguage('en')}
                className={`rounded-full px-2.5 py-1 text-[10px] font-extrabold transition-colors ${
                  !isAr ? 'bg-[#FFD09A] text-[#0A1712]' : 'text-[#FCFAF6]/60 hover:text-[#FCFAF6]'
                }`}
              >
                EN
              </button>
            </div>

            <button
              onClick={toggleTheme}
              aria-label={isAr ? 'تبديل المظهر' : 'Toggle theme'}
              className="flex h-9 w-9 items-center justify-center rounded-full border border-white/15 bg-white/5 text-[#FCFAF6] transition-colors hover:bg-white/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/20"
            >
              {isDark ? <Sun className="h-4 w-4 text-amber-300" /> : <Moon className="h-4 w-4" />}
            </button>

            <Link
              to="/login"
              className="flex h-9 w-9 items-center justify-center rounded-full border border-white/15 bg-white/5 text-[#FCFAF6] transition-colors hover:bg-white/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/20"
            >
              {isDark ? <Sun className="h-4 w-4 text-amber-300" /> : <Moon className="h-4 w-4" />}
            </Link>

            <Link
              to="/register"
              className="inline-flex items-center gap-2 rounded-full bg-[#F59E42]/90 px-4 py-2.5 text-xs font-extrabold text-[#0A1712] shadow-sm transition-all hover:bg-[#F59E42]/95 hover:shadow-[0_0_10px_2px_rgba(245,158,66,0.4)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#F59E42]/40"
            >
              {isAr ? 'ابدأ مجاناً' : 'Start free'}
              <ArrowLeft className="h-3.5 w-3.5" />
            </Link>
          </div>
        </div>
      </div>
    </div>`;

if (content.includes(oldNavbar)) {
  content = content.replace(oldNavbar, newNavbar);
  fs.writeFileSync('src/pages/PublicLandingPage.jsx', content, 'utf8');
  console.log('Navbar redesigned successfully');
} else {
  console.log('Old navbar not found, trying alternative match...');
  // Try just replacing the fixed div
  const oldDiv = '<div className="fixed inset-x-0 top-0 z-50 border-b border-white/10 bg-[#0A1712]/90 text-[#FCFAF6] backdrop-blur-xl transition-shadow duration-300 {';
  if (content.includes(oldDiv)) {
    // Find and replace just the class string portion
    const newStart = '<div className="fixed inset-x-0 top-0 z-50 border-b border-white/10 bg-[#0A1712]/80 backdrop-blur-xl transition-shadow duration-300 shadow-[0_12px_40px_-20px_rgba(0,0,0,0.6)]">';
    content = content.replace(oldDiv, newStart);
    fs.writeFileSync('src/pages/PublicLandingPage.jsx', content, 'utf8');
    console.log('Navbar background updated partially');
  } else {
    console.log('Could not find navbar section to replace');
  }
}