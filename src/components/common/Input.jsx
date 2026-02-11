import React from 'react'

const Input = ({ 
  label, 
  error, 
  icon,
  className = '', 
  ...props 
}) => {
  return (
    <div className={`w-full ${className}`}>
      {label && (
        <label className="block text-sm font-medium text-crypto-text-secondary mb-2">
          {label}
        </label>
      )}
      <div className="relative">
        {icon && (
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-crypto-accent">
            {icon}
          </div>
        )}
        <input
          className={`w-full px-4 py-3 bg-crypto-bg-tertiary border rounded-lg text-crypto-text-primary placeholder-crypto-text-secondary/50 focus:outline-none focus:ring-2 transition-all duration-300 ${
            error 
              ? 'border-crypto-error focus:border-crypto-error focus:ring-crypto-error/20' 
              : 'border-crypto-accent/20 focus:border-crypto-accent focus:ring-crypto-accent/20'
          } ${icon ? 'pl-10' : ''}`}
          {...props}
        />
      </div>
      {error && (
        <p className="mt-1 text-sm text-crypto-error">{error}</p>
      )}
    </div>
  )
}

export default Input
