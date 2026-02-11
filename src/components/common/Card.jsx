import React from 'react'

const Card = ({ 
  children, 
  className = '', 
  hover = false,
  glow = false,
  ...props 
}) => {
  return (
    <div
      className={`bg-crypto-bg-secondary/80 backdrop-blur-lg border rounded-2xl p-6 transition-all duration-300 ${
        hover ? 'hover:border-crypto-accent/30 hover:shadow-lg hover:shadow-crypto-accent/10 cursor-pointer' : 'border-crypto-accent/10'
      } ${glow ? 'neon-border' : ''} ${className}`}
      {...props}
    >
      {children}
    </div>
  )
}

export default Card
