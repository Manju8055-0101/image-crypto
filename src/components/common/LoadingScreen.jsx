import React from 'react'

const LoadingScreen = () => {
  return (
    <div className="fixed inset-0 bg-crypto-dark flex items-center justify-center z-50">
      <div className="text-center">
        <div className="relative w-32 h-32 mx-auto mb-8">
          <div className="absolute inset-0 border-4 border-crypto-accent/20 rounded-full" />
          <div className="absolute inset-0 border-4 border-transparent border-t-crypto-accent rounded-full animate-spin" />
          <div className="absolute inset-4 border-4 border-transparent border-t-crypto-secondary rounded-full animate-spin animate-reverse" />
          <div className="absolute inset-8 flex items-center justify-center">
            <svg className="w-12 h-12 text-crypto-accent animate-pulse" fill="none" viewBox="0 0 24 24">
              <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
            </svg>
          </div>
        </div>
        <h2 className="text-2xl font-bold gradient-text mb-2">Crypto Image</h2>
        <p className="text-crypto-text-secondary">Initializing secure connection...</p>
        <div className="flex justify-center gap-2 mt-4">
          <span className="w-2 h-2 bg-crypto-accent rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
          <span className="w-2 h-2 bg-crypto-accent rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
          <span className="w-2 h-2 bg-crypto-accent rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
        </div>
      </div>
    </div>
  )
}

export default LoadingScreen
