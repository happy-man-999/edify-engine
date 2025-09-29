/**
 * Domain utility functions for parsing and analyzing domain names
 */

// Common multi-part TLDs that should be treated as single TLDs
const MULTI_PART_TLDS = [
  'co.uk', 'com.au', 'co.nz', 'co.za', 'co.in', 'co.jp', 'co.kr',
  'com.br', 'com.mx', 'com.ar', 'com.cn', 'com.tw', 'com.hk',
  'org.uk', 'net.uk', 'ac.uk', 'gov.uk', 'edu.au', 'org.au',
  'com.sg', 'com.my', 'com.ph', 'com.th', 'com.vn', 'com.id',
  'co.il', 'co.za', 'co.za', 'com.tr', 'com.eg', 'com.sa',
  'co.ke', 'co.ug', 'co.tz', 'co.gh', 'co.ng', 'co.za'
];

/**
 * Determines if a domain is a subdomain or root domain
 * @param {string} domain - The domain to analyze
 * @returns {boolean} - True if the domain is a subdomain, false if it's a root domain
 */
export const isSubdomain = (domain) => {
  if (!domain || typeof domain !== 'string') {
    return false;
  }

  const domainParts = domain.split('.');
  
  // Check if the last two parts form a known multi-part TLD
  const lastTwoParts = domainParts.slice(-2).join('.');
  const isMultiPartTld = MULTI_PART_TLDS.includes(lastTwoParts);
  
  // Determine if it's a subdomain
  // If it's a multi-part TLD, we need at least 4 parts to be a subdomain
  // If it's a single TLD, we need at least 3 parts to be a subdomain
  return isMultiPartTld ? domainParts.length > 3 : domainParts.length > 2;
};

/**
 * Gets the host part for DNS record configuration
 * @param {string} domain - The domain to analyze
 * @returns {string} - The host part ('@' for root domains, subdomain name for subdomains)
 */
export const getDnsHost = (domain) => {
  if (!domain || typeof domain !== 'string') {
    return '@';
  }

  const domainParts = domain.split('.');
  return isSubdomain(domain) ? domainParts[0] : '@';
};

/**
 * Gets the root domain from a subdomain
 * @param {string} domain - The domain to analyze
 * @returns {string} - The root domain
 */
export const getRootDomain = (domain) => {
  if (!domain || typeof domain !== 'string') {
    return '';
  }

  const domainParts = domain.split('.');
  
  // Check if it's a multi-part TLD
  const lastTwoParts = domainParts.slice(-2).join('.');
  const isMultiPartTld = MULTI_PART_TLDS.includes(lastTwoParts);
  
  if (isMultiPartTld) {
    // For multi-part TLDs, take the last 3 parts (domain + TLD)
    return domainParts.slice(-3).join('.');
  } else {
    // For single TLDs, take the last 2 parts (domain + TLD)
    return domainParts.slice(-2).join('.');
  }
};

/**
 * Gets the subdomain part from a domain
 * @param {string} domain - The domain to analyze
 * @returns {string} - The subdomain part (empty string if it's a root domain)
 */
export const getSubdomain = (domain) => {
  if (!domain || typeof domain !== 'string') {
    return '';
  }

  if (!isSubdomain(domain)) {
    return '';
  }

  const domainParts = domain.split('.');
  return domainParts[0];
};

/**
 * Validates if a domain has a valid format
 * @param {string} domain - The domain to validate
 * @returns {boolean} - True if the domain format is valid
 */
export const isValidDomainFormat = (domain) => {
  if (!domain || typeof domain !== 'string') {
    return false;
  }

  // Basic domain validation regex
  const domainRegex = /^[a-zA-Z0-9]([a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(\.[a-zA-Z0-9]([a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/;
  
  if (!domainRegex.test(domain.trim())) {
    return false;
  }
  
  // Additional validation for domain length and format
  const domainParts = domain.trim().split('.');
  
  if (domainParts.length < 2) {
    return false;
  }
  
  if (domainParts.length > 5) {
    return false;
  }
  
  // Check each part length
  for (let i = 0; i < domainParts.length; i++) {
    const part = domainParts[i];
    if (part.length < 1 || part.length > 63) {
      return false;
    }
    if (part.startsWith('-') || part.endsWith('-')) {
      return false;
    }
  }
  
  // Check total domain length
  if (domain.trim().length > 253) {
    return false;
  }

  return true;
};
