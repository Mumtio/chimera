import React, { useState } from 'react';
import { motion } from 'framer-motion';

export interface CyberInputProps {
  type?: 'text' | 'email' | 'password' | 'search';
  label?: string;
  placeholder?: string;
  value: string;
  onChange: (value: string) => void;
  error?: string;
  glowOnFocus?: boolean;
  disabled?: boolean;
  className?: string;
  name?: string;
  ariaLabel?: string;
  required?: boolean;
  autoComplete?: string;
}

export const CyberInput: React.FC<CyberInputProps> = ({
  type = 'text',
  label,
  placeholder,
  value,
  onChange,
  error,
  glowOnFocus = true,
  disabled = false,
  className = '',
  name,
  ariaLabel,
  required = false,
  autoComplete,
}) => {
  const [isFocused, setIsFocused] = useState(false);
  const inputId = React.useId();
  const errorId = error ? `${inputId}-error` : undefined;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onChange(e.target.value);
  };

  const borderColor = error 
    ? 'border-error-red' 
    : isFocused && glowOnFocus 
    ? 'border-neon-green shadow-neon' 
    : 'border-deep-teal';

  const labelColor = error 
    ? 'text-error-red' 
    : isFocused 
    ? 'text-neon-green' 
    : 'text-gray-400';

  return (
    <div className={`relative ${className}`}>
      {label && (
        <motion.label
          htmlFor={inputId}
          // @ts-ignore - Framer Motion types issue
          className={`absolute left-4 transition-all duration-200 pointer-events-none font-medium ${labelColor}`}
          animate={{
            top: isFocused || value ? '-0.5rem' : '1rem',
            fontSize: isFocused || value ? '0.75rem' : '1rem',
            backgroundColor: isFocused || value ? '#000' : 'transparent',
            paddingLeft: isFocused || value ? '0.5rem' : '0',
            paddingRight: isFocused || value ? '0.5rem' : '0',
          }}
        >
          {label}
          {required && <span className="text-error-red ml-1">*</span>}
        </motion.label>
      )}
      <input
        id={inputId}
        type={type}
        name={name}
        value={value}
        onChange={handleChange}
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
        placeholder={isFocused ? placeholder : ''}
        disabled={disabled}
        aria-label={ariaLabel || label}
        aria-invalid={!!error}
        aria-describedby={errorId}
        aria-required={required}
        required={required}
        autoComplete={autoComplete}
        className={`
          w-full px-4 py-3 bg-black border-2 ${borderColor}
          text-white font-mono text-sm
          transition-all duration-300
          focus:outline-none
          disabled:opacity-50 disabled:cursor-not-allowed
          angular-frame
        `}
      />
      {error && (
        <motion.p
          id={errorId}
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          // @ts-ignore - Framer Motion types issue
          role="alert"
          className="text-error-red text-xs mt-1 ml-1"
        >
          {error}
        </motion.p>
      )}
    </div>
  );
};
