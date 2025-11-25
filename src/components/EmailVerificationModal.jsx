import React, { useState, useEffect, useRef } from 'react';

const EmailVerificationModal = ({ 
  isOpen, 
  onClose, 
  email, 
  firstName, 
  onVerificationSuccess
}) => {
  const [code, setCode] = useState(['', '', '', '']);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [remainingAttempts, setRemainingAttempts] = useState(3);
  const [isResending, setIsResending] = useState(false);
  const [timeLeft, setTimeLeft] = useState(600); // 10 minutes in seconds
  const inputRefs = useRef([]);

  // Timer countdown
  useEffect(() => {
    if (!isOpen || timeLeft <= 0) return;

    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          clearInterval(timer);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [isOpen, timeLeft]);

  // Reset state when modal opens
  useEffect(() => {
    if (isOpen) {
      setCode(['', '', '', '']);
      setError('');
      setRemainingAttempts(3);
      setTimeLeft(600);
      // Focus first input
      setTimeout(() => {
        if (inputRefs.current[0]) {
          inputRefs.current[0].focus();
        }
      }, 100);
    }
  }, [isOpen]);

  const handleInputChange = (index, value) => {
    // Only allow digits
    if (!/^\d*$/.test(value)) return;

    const newCode = [...code];
    newCode[index] = value;
    setCode(newCode);

    // Clear error when user starts typing
    if (error) {
      setError('');
    }

    // Auto-focus next input
    if (value && index < 3) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (index, e) => {
    // Handle backspace
    if (e.key === 'Backspace' && !code[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
    
    // Handle paste
    if (e.key === 'v' && (e.ctrlKey || e.metaKey)) {
      e.preventDefault();
      handlePaste(e);
    }
  };

  const handlePaste = (e) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData('text');
    const digits = pastedData.replace(/\D/g, '').slice(0, 4);
    
    if (digits.length === 4) {
      const newCode = digits.split('');
      setCode(newCode);
      
      // Focus last input
      inputRefs.current[3]?.focus();
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const verificationCode = code.join('');
    
    if (verificationCode.length !== 4) {
      setError('Please enter the complete 4-digit code');
      return;
    }

    setIsLoading(true);
    setError('');

    try {
      const response = await fetch('/api/email-verification/verify-code', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          email,
          code: verificationCode
        })
      });

      const data = await response.json();

      if (response.ok) {
        onVerificationSuccess(verificationCode);
      } else {
        if (data.remainingAttempts !== undefined) {
          setRemainingAttempts(data.remainingAttempts);
        }
        setError(data.message || 'Verification failed');
      }
    } catch (error) {
      setError('Network error. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleResendCode = async () => {
    setIsResending(true);
    setError('');

    try {
      const response = await fetch('/api/email-verification/resend-code', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          email,
          firstName
        })
      });

      const data = await response.json();

      if (response.ok) {
        setTimeLeft(600); // Reset timer
        setRemainingAttempts(3); // Reset attempts
        setCode(['', '', '', '']); // Clear code
        // Focus first input
        setTimeout(() => {
          if (inputRefs.current[0]) {
            inputRefs.current[0].focus();
          }
        }, 100);
      } else {
        setError(data.message || 'Failed to resend code');
      }
    } catch (error) {
      setError('Network error. Please try again.');
    } finally {
      setIsResending(false);
    }
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50 p-4" style={{ backgroundColor: 'rgba(0, 0, 0, 0.5)' }}>
      <div className="rounded-xl shadow-xl max-w-md w-full animate-modalFadeIn relative" style={{ backgroundColor: 'oklch(0.18 0.05 285)' }}>
        <div className="p-6">
          {/* Header */}
          <div className="text-center mb-6">
            <div className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4" style={{ background: 'linear-gradient(to right, oklch(0.45 0.15 290), oklch(0.50 0.18 260))' }}>
              <i className="fas fa-envelope text-2xl" style={{ color: 'oklch(0.98 0.01 280)' }}></i>
            </div>
            <h2 className="text-2xl font-bold mb-2" style={{ color: 'oklch(0.98 0.01 280)' }}>Verify Your Email</h2>
            <p style={{ color: 'oklch(0.65 0.05 280)' }}>
              We've sent a 4-digit code to<br />
              <span className="font-semibold" style={{ color: 'oklch(0.45 0.15 290)' }}>{email}</span>
            </p>
          </div>

          {/* Code Input */}
          <form onSubmit={handleSubmit} className="mb-6">
            <div className="flex justify-center space-x-3 mb-4">
              {code.map((digit, index) => (
                <input
                  key={index}
                  ref={el => inputRefs.current[index] = el}
                  type="text"
                  inputMode="numeric"
                  maxLength="1"
                  value={digit}
                  onChange={(e) => handleInputChange(index, e.target.value)}
                  onKeyDown={(e) => handleKeyDown(index, e)}
                  onPaste={handlePaste}
                  className="w-12 h-12 text-center text-2xl font-bold border-2 rounded-lg focus:outline-none transition-colors"
                  style={{
                    backgroundColor: 'oklch(0.12 0.02 280)',
                    borderColor: error ? 'oklch(0.55 0.22 25)' : 'oklch(0.25 0.05 285)',
                    color: 'oklch(0.98 0.01 280)'
                  }}
                  onFocus={(e) => {
                    e.currentTarget.style.borderColor = 'oklch(0.45 0.15 290)';
                    e.currentTarget.style.boxShadow = '0 0 0 2px oklch(0.45 0.15 290 / 0.2)';
                  }}
                  onBlur={(e) => {
                    e.currentTarget.style.borderColor = error ? 'oklch(0.55 0.22 25)' : 'oklch(0.25 0.05 285)';
                    e.currentTarget.style.boxShadow = 'none';
                  }}
                  disabled={isLoading}
                />
              ))}
            </div>

            {/* Error Message */}
            {error && (
              <div className="text-center mb-4">
                <p className="text-sm" style={{ color: 'oklch(0.55 0.22 25)' }}>{error}</p>
                {remainingAttempts > 0 && remainingAttempts < 3 && (
                  <p className="text-xs mt-1" style={{ color: 'oklch(0.65 0.05 280)' }}>
                    {remainingAttempts} attempts remaining
                  </p>
                )}
              </div>
            )}

            {/* Timer */}
            {timeLeft > 0 && (
              <div className="text-center mb-4">
                <p className="text-sm" style={{ color: 'oklch(0.65 0.05 280)' }}>
                  Code expires in <span className="font-semibold" style={{ color: 'oklch(0.45 0.15 290)' }}>{formatTime(timeLeft)}</span>
                </p>
              </div>
            )}

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading || code.join('').length !== 4}
              className="w-full py-3 px-4 rounded-lg font-medium transition-colors"
              style={isLoading || code.join('').length !== 4 ? {
                backgroundColor: 'oklch(0.25 0.05 285)',
                color: 'oklch(0.65 0.05 280)',
                cursor: 'not-allowed'
              } : {
                background: 'linear-gradient(to right, oklch(0.45 0.15 290), oklch(0.50 0.18 260))',
                color: 'oklch(0.98 0.01 280)'
              }}
              onMouseEnter={(e) => {
                if (!isLoading && code.join('').length === 4) {
                  e.currentTarget.style.background = 'linear-gradient(to right, oklch(0.50 0.18 260), oklch(0.55 0.18 260))';
                }
              }}
              onMouseLeave={(e) => {
                if (!isLoading && code.join('').length === 4) {
                  e.currentTarget.style.background = 'linear-gradient(to right, oklch(0.45 0.15 290), oklch(0.50 0.18 260))';
                }
              }}
            >
              {isLoading ? (
                <div className="flex items-center justify-center">
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 mr-3" style={{ borderColor: 'oklch(0.65 0.05 280)' }}></div>
                  Verifying...
                </div>
              ) : (
                'Verify Email'
              )}
            </button>
          </form>

          {/* Resend Code */}
          <div className="text-center">
            <p className="text-sm mb-2" style={{ color: 'oklch(0.65 0.05 280)' }}>Didn't receive the code?</p>
            <button
              onClick={handleResendCode}
              disabled={isResending || timeLeft > 0}
              className="text-sm font-medium transition-colors"
              style={isResending || timeLeft > 0 ? {
                color: 'oklch(0.50 0.05 280)',
                cursor: 'not-allowed'
              } : {
                color: 'oklch(0.45 0.15 290)'
              }}
              onMouseEnter={(e) => {
                if (!isResending && timeLeft === 0) {
                  e.currentTarget.style.color = 'oklch(0.50 0.18 260)';
                }
              }}
              onMouseLeave={(e) => {
                if (!isResending && timeLeft === 0) {
                  e.currentTarget.style.color = 'oklch(0.45 0.15 290)';
                }
              }}
            >
              {isResending ? 'Sending...' : 'Resend Code'}
            </button>
          </div>

          {/* Close Button */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 transition-colors"
            style={{ color: 'oklch(0.50 0.05 280)' }}
            onMouseEnter={(e) => {
              e.currentTarget.style.color = 'oklch(0.65 0.05 280)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.color = 'oklch(0.50 0.05 280)';
            }}
            aria-label="Close modal"
          >
            <i className="fas fa-times text-xl"></i>
          </button>
        </div>
      </div>
    </div>
  );
};

export default EmailVerificationModal;
