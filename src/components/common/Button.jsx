import React from 'react'

const Button = ({ 
  children, 
  variant = 'primary', 
  size = 'md', 
  disabled = false,
  loading = false,
  onClick,
  className = '',
  ...props 
}) => {
  const baseStyles = 'inline-flex items-center justify-center font-medium transition-all duration-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-crypto-dark disabled:opacity-50 disabled:cursor-not-allowed transform hover:scale-105 active:scale-95'
  
  const variants = {
    primary: 'bg-gradient-to-r from-crypto-accent to-crypto-secondary text-crypto-dark shadow-lg hover:shadow-xl focus:ring-crypto-accent',
    secondary: 'bg-crypto-bg-tertiary border border-crypto-accent/30 text-crypto-accent hover:bg-crypto-accent/10 focus:ring-crypto-accent',
    ghost: 'bg-transparent text-crypto-text-secondary hover:text-crypto-accent hover:bg-crypto-bg-tertiary focus:ring-crypto-text-secondary',
    danger: 'bg-gradient-to-r from-crypto-error to-red-600 text-white shadow-lg hover:shadow-xl focus:ring-crypto-error',
    success: 'bg-gradient-to-r from-crypto-success to-green-600 text-crypto-dark shadow-lg hover:shadow-xl focus:ring-crypto-success',
  }
  
  const sizes = {
    sm: 'px-3 py-1.5 text-sm',
    md: 'px-6 py-3 text-base',
    lg: 'px-8 py-4 text-lg',
    xl: 'px-10 py-5 text-xl',
  }

  return (
    <button
      onClick={onClick}
      disabled={disabled || loading}
      className={`${baseStyles} ${variants[variant]} ${sizes[size]} ${className}`}
      {...props}
    >
      {loading && (
        <svg className="animate-spin -ml-1 mr-2 h-5 w-5" fill="none" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
        </svg>
      )}
      {children}
    </button>
  )
}

export default Button
