export function Logo() {
  return (
    <div className="flex items-center gap-2">
      <div className="relative w-8 h-8">
        {/* Stylized "8" as infinity loop */}
        <svg viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path
            d="M20 8C24.4183 8 28 11.5817 28 16C28 18.1217 27.1571 20.0391 25.7574 21.4388C27.1571 22.8385 28 24.7559 28 26.8776C28 31.296 24.4183 34.8776 20 34.8776C15.5817 34.8776 12 31.296 12 26.8776C12 24.7559 12.8429 22.8385 14.2426 21.4388C12.8429 20.0391 12 18.1217 12 16C12 11.5817 15.5817 8 20 8Z"
            fill="url(#logo-gradient)"
            className="drop-shadow-lg"
          />
          <defs>
            <linearGradient id="logo-gradient" x1="12" y1="8" x2="28" y2="34.8776">
              <stop offset="0%" stopColor="#8B7AFF" />
              <stop offset="100%" stopColor="#6D5BFF" />
            </linearGradient>
          </defs>
        </svg>
      </div>
      <div>
        <h2 className="text-white font-semibold text-lg tracking-tight">Study Mate</h2>
      </div>
    </div>
  );
}