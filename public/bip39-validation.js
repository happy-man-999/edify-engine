// BIP-39 Validation with Checksum Verification
// Fetches wordlist from official source

let BIP39_WORDLIST = null;

// Load wordlist on init
async function loadWordlist() {
  if (BIP39_WORDLIST) return BIP39_WORDLIST;
  
  try {
    const response = await fetch('https://raw.githubusercontent.com/bitcoin/bips/master/bip-0039/english.txt');
    const text = await response.text();
    BIP39_WORDLIST = text.trim().split('\n');
    return BIP39_WORDLIST;
  } catch (e) {
    console.error('Failed to load BIP-39 wordlist:', e);
    return null;
  }
}

// Convert mnemonic words to binary string
function mnemonicToBinary(words, wordlist) {
  return words.map(word => {
    const index = wordlist.indexOf(word.toLowerCase());
    if (index === -1) return null;
    return index.toString(2).padStart(11, '0');
  }).join('');
}

// SHA-256 hash using Web Crypto API
async function sha256(buffer) {
  const hashBuffer = await crypto.subtle.digest('SHA-256', buffer);
  return new Uint8Array(hashBuffer);
}

// Convert binary string to Uint8Array
function binaryToBytes(binary) {
  const bytes = [];
  for (let i = 0; i < binary.length; i += 8) {
    bytes.push(parseInt(binary.slice(i, i + 8), 2));
  }
  return new Uint8Array(bytes);
}

// Validate words exist in BIP-39 wordlist (no checksum)
async function validateWords(mnemonic) {
  const wordlist = await loadWordlist();
  if (!wordlist) return { valid: false, error: 'Failed to load wordlist', invalidIndices: [] };
  
  const words = mnemonic.trim().toLowerCase().split(/\s+/);
  
  // Check word count (12 or 24)
  if (words.length !== 12 && words.length !== 24) {
    return { valid: false, error: 'Invalid word count. Must be 12 or 24 words.', invalidIndices: [] };
  }
  
  // Check all words exist in wordlist and track invalid indices
  const invalidIndices = [];
  for (let i = 0; i < words.length; i++) {
    if (!wordlist.includes(words[i])) {
      invalidIndices.push(i);
    }
  }
  
  if (invalidIndices.length > 0) {
    const wordNumbers = invalidIndices.map(i => i + 1);
    let errorMsg;
    if (wordNumbers.length === 1) {
      errorMsg = `Word ${wordNumbers[0]} is incorrect or misspelled`;
    } else {
      const lastNum = wordNumbers.pop();
      errorMsg = `Words ${wordNumbers.join(', ')}, and ${lastNum} are incorrect or misspelled`;
    }
    return { valid: false, error: errorMsg, invalidIndices };
  }
  
  return { valid: true, invalidIndices: [] };
}

// Validate BIP-39 mnemonic with checksum (full validation)
async function validateMnemonic(mnemonic) {
  // First check words
  const wordResult = await validateWords(mnemonic);
  if (!wordResult.valid) return wordResult;
  
  const wordlist = await loadWordlist();
  const words = mnemonic.trim().toLowerCase().split(/\s+/);
  
  // Convert to binary
  const binary = mnemonicToBinary(words, wordlist);
  if (binary.includes('null')) {
    return { valid: false, error: 'Invalid word in mnemonic' };
  }
  
  // Calculate entropy and checksum bits
  // 12 words = 132 bits = 128 entropy + 4 checksum
  // 24 words = 264 bits = 256 entropy + 8 checksum
  const checksumBits = words.length === 12 ? 4 : 8;
  const entropyBits = binary.length - checksumBits;
  
  const entropyBinary = binary.slice(0, entropyBits);
  const checksumBinary = binary.slice(entropyBits);
  
  // Convert entropy to bytes and hash
  const entropyBytes = binaryToBytes(entropyBinary);
  const hash = await sha256(entropyBytes);
  
  // Get first N bits of hash as checksum
  const hashBinary = Array.from(hash).map(b => b.toString(2).padStart(8, '0')).join('');
  const calculatedChecksum = hashBinary.slice(0, checksumBits);
  
  if (checksumBinary !== calculatedChecksum) {
    return { valid: false, error: 'Invalid Recovery Phrase', invalidIndices: [] };
  }
  
  return { valid: true, invalidIndices: [] };
}

// Initialize wordlist on load
loadWordlist();