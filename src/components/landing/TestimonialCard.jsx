import React from 'react';
import { Quote } from 'lucide-react';

const TestimonialCard = ({ quote, author, role, avatar }) => {
  return (
    <div className="h-full p-1">
      <div 
        className="h-full p-6 rounded-xl backdrop-blur border transition-all duration-300"
        style={{
          backgroundColor: 'oklch(0.18 0.05 285 / 0.5)',
          borderColor: 'oklch(0.25 0.05 285 / 0.5)'
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.borderColor = 'oklch(0.25 0.05 285 / 0.3)';
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.borderColor = 'oklch(0.25 0.05 285 / 0.5)';
        }}
      >
        <Quote className="w-8 h-8 mb-4" style={{ color: 'oklch(0.45 0.15 290 / 0.5)' }} />
        <p className="text-gray-200 mb-6 leading-relaxed">
          "{quote}"
        </p>
        <div className="flex items-center gap-3">
          {avatar ? (
            <img 
              src={avatar} 
              alt={author}
              className="w-12 h-12 rounded-full border-2"
              style={{ borderColor: 'oklch(0.25 0.05 285 / 0.3)' }}
            />
          ) : (
            <div 
              className="w-12 h-12 rounded-full flex items-center justify-center text-lg font-bold text-white"
              style={{
                background: 'linear-gradient(to bottom right, oklch(0.45 0.15 290), oklch(0.50 0.18 260))'
              }}
            >
              {author.charAt(0)}
            </div>
          )}
          <div>
            <div className="font-semibold text-white">{author}</div>
            <div className="text-sm text-gray-400">{role}</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TestimonialCard;

