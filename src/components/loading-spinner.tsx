import React from 'react';

interface LoadingSpinnerProps {
  size?: number;
}

const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({ size = 40 }) => (
  <div
    style={{
      display: 'inline-block',
      width: size,
      height: size,
    }}
    aria-label="Loading"
    role="status"
  >
    <svg
      width={size}
      height={size}
      viewBox="0 0 50 50"
      style={{ display: 'block' }}
    >
      <circle
        cx="25"
        cy="25"
        r="20"
        fill="none"
        stroke="#3498db"
        strokeWidth="5"
        strokeLinecap="round"
        strokeDasharray="90 150"
        strokeDashoffset="0"
      >
        <animateTransform
          attributeName="transform"
          type="rotate"
          from="0 25 25"
          to="360 25 25"
          dur="1s"
          repeatCount="indefinite"
        />
      </circle>
    </svg>
  </div>
);

export default LoadingSpinner;