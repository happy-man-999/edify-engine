import React from 'react';

const Badge = ({ className = '', children, ...props }) => {
  return (
    <span
      className={`inline-flex items-center justify-center rounded-md border px-2 py-0.5 text-xs font-medium w-fit whitespace-nowrap shrink-0 transition-colors ${className}`}
      {...props}
    >
      {children}
    </span>
  );
};

export default Badge;

