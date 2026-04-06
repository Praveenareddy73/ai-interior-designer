/**
 * Header component
 * Displays the app logo, title and a subtle subtitle tagline.
 */
export default function Header() {
  return (
    <header className="text-center py-10 px-4 select-none">
      {/* Icon badge */}
      <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl mb-4"
           style={{ background: 'linear-gradient(135deg,#6366f1,#a855f7,#ec4899)', boxShadow: '0 0 32px rgba(99,102,241,0.45)' }}>
        <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round"
            d="M3 9.75L12 3l9 6.75V21a.75.75 0 01-.75.75H3.75A.75.75 0 013 21V9.75z"/>
          <path strokeLinecap="round" strokeLinejoin="round" d="M9 21V12h6v9"/>
        </svg>
      </div>

      <h1 className="text-4xl sm:text-5xl font-extrabold grad-text mb-3 tracking-tight">
        AI Interior Designer
      </h1>
      <p className="text-slate-400 text-base sm:text-lg max-w-xl mx-auto leading-relaxed">
        Upload a room photo, choose your style, and watch AI transform it into a
        stunning interior design in seconds.
      </p>
    </header>
  )
}
