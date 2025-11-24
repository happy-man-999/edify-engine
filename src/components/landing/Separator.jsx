import React from 'react';

const Separator = ({ className = '' }) => {
  return (
    <div className={`h-px bg-gradient-to-r from-transparent via-[#42677D]/50 to-transparent ${className}`} />
  );
};

export default Separator;

