import React from 'react'

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  /**
   * Optional variant styling – you can extend later.
   */
  variant?: 'primary' | 'secondary' | 'ghost'
}

/**
 * Reusable button component using Tailwind classes.
 *
 * - primary   → pink‑600 bg, white text, hover: pink‑700
 * - secondary → gray‑200 bg, gray‑800 text, hover: gray‑300
 * - ghost     → transparent, pink‑600 text, hover: pink‑50
 */
export const Button: React.FC<ButtonProps> = ({
  variant = 'primary',
  className = '',
  children,
  ...rest
}) => {
  const base = 'inline-flex items-center justify-center rounded-md font-medium transition-colors disabled:opacity-50 disabled:pointer-events-none'
  const variants = {
    primary: 'bg-pink-600 text-white hover:bg-pink-700',
    secondary: 'bg-gray-200 text-gray-800 hover:bg-gray-300',
    ghost: 'bg-transparent text-pink-600 hover:bg-pink-50',
  }
  const classes = `${base} ${variants[variant]} ${className}`

  return (
    <button className={classes} {...rest}>
      {children}
    </button>
  )
}
