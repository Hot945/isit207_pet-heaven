import { useId } from 'react';

const LOGO_PATH =
  'M8 10.5C8 8.015 10.015 6 12.5 6H24.5C34.2 6 40 11.8 40 20.5C40 29.2 34.2 35 24.5 35H16.8V38.5C16.8 40.433 15.233 42 13.3 42H11.5C9.567 42 8 40.433 8 38.5V10.5ZM18.3 15.9L20.0 12.8L22.4 14.9C23.5 14.55 24.7 14.55 25.8 14.9L28.2 12.8L29.9 15.9C31.0 17.2 31.6 18.85 31.6 20.6C31.6 24.4 28.3 27.1 24.1 27.1C19.9 27.1 16.6 24.4 16.6 20.6C16.6 18.85 17.2 17.2 18.3 15.9Z';

export default function BrandLogo({ size = 28, variant = 'gradient', className = '' }) {
  const gradId = useId();
  const isWhite = variant === 'white';

  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 48 48"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-hidden="true"
    >
      {!isWhite && (
        <defs>
          <linearGradient id={gradId} x1="8" y1="6" x2="40" y2="42" gradientUnits="userSpaceOnUse">
            <stop offset="0%" style={{ stopColor: 'var(--brand-logo-start, #542177)' }} />
            <stop offset="65%" style={{ stopColor: 'var(--brand-logo-mid, #8E1EA2)' }} />
            <stop offset="100%" style={{ stopColor: 'var(--brand-logo-end, #D552A3)' }} />
          </linearGradient>
        </defs>
      )}
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d={LOGO_PATH}
        fill={isWhite ? '#FFFFFF' : `url(#${gradId})`}
      />
    </svg>
  );
}
