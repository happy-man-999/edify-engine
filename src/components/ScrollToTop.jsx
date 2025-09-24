import React from 'react';
import useScrollToTop from '../hooks/useScrollToTop';

const ScrollToTop = ({ children }) => {
  useScrollToTop();
  return <>{children}</>;
};

export default ScrollToTop;
