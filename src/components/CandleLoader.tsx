'use client'

export default function CandleLoader() {
  return (
    <div className="min-h-screen bg-secondary flex items-center justify-center">
      <div className="relative">
        {/* Flame */}
        <div className="relative w-20 h-20 mb-4 mx-auto">
          <div className="absolute inset-0 animate-flicker">
            <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-8 h-12 bg-linear-to-t from-accent via-yellow-400 to-yellow-200 rounded-full blur-sm opacity-80"></div>
            <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-6 h-10 bg-linear-to-t from-accent via-yellow-400 to-white rounded-full"></div>
            <div className="absolute bottom-2 left-1/2 -translate-x-1/2 w-3 h-6 bg-linear-to-t from-yellow-300 to-white rounded-full"></div>
          </div>
        </div>

        {/* Wick */}
        <div className="w-1 h-8 bg-gray-800 mx-auto rounded-t-full"></div>

        {/* Candle Body */}
        <div className="relative w-24 h-32 mx-auto">
          <div className="absolute inset-0 bg-linear-to-b from-accent/90 to-accent rounded-lg shadow-2xl">
            {/* Wax drip effect */}
            <div className="absolute -top-1 left-4 w-4 h-6 bg-accent/80 rounded-b-full animate-drip"></div>
            <div className="absolute -top-1 right-6 w-3 h-5 bg-accent/70 rounded-b-full animate-drip-delayed"></div>
            
            {/* Candle texture */}
            <div className="absolute inset-0 bg-linear-to-r from-transparent via-white/5 to-transparent"></div>
          </div>
          
          {/* Candle glow */}
          <div className="absolute inset-0 bg-accent/20 rounded-lg blur-xl animate-pulse"></div>
        </div>

        
        {/* Styles */}
        <style jsx>{`
          @keyframes flicker {
            0%, 100% { transform: scale(1) translateY(0); opacity: 1; }
            25% { transform: scale(1.05) translateY(-2px); opacity: 0.9; }
            50% { transform: scale(0.95) translateY(1px); opacity: 0.95; }
            75% { transform: scale(1.02) translateY(-1px); opacity: 0.92; }
          }
          
          @keyframes drip {
            0%, 100% { height: 1.5rem; opacity: 0.8; }
            50% { height: 2rem; opacity: 1; }
          }
          
          @keyframes drip-delayed {
            0%, 100% { height: 1.25rem; opacity: 0.7; }
            50% { height: 1.75rem; opacity: 0.9; }
          }

          .animate-flicker {
            animation: flicker 2s ease-in-out infinite;
          }
          
          .animate-drip {
            animation: drip 3s ease-in-out infinite;
          }
          
          .animate-drip-delayed {
            animation: drip-delayed 3s ease-in-out infinite 0.5s;
          }
        `}</style>
      </div>
    </div>
  )
}
