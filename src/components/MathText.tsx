import React from 'react';

interface MathTextProps {
  text: string;
  className?: string;
  variant?: 'light' | 'dark';
}

// 1. Recursive brace parser to find nesting
function getMatchingBraceContent(str: string, startIndex: number): { content: string, nextIndex: number } | null {
  if (str[startIndex] !== '{') return null;
  let count = 0;
  for (let i = startIndex; i < str.length; i++) {
    if (str[i] === '{') {
      count++;
    } else if (str[i] === '}') {
      count--;
      if (count === 0) {
        return {
          content: str.substring(startIndex + 1, i),
          nextIndex: i + 1
        };
      }
    }
  }
  return null;
}

// 2. Parse \frac{num}{den} -> ⟪FR:[num][den]⟫
function parseFractionsToMarker(str: string): string {
  let index = str.indexOf('\\frac');
  while (index !== -1) {
    const numMatch = getMatchingBraceContent(str, index + 5);
    if (numMatch) {
      let denStart = numMatch.nextIndex;
      while (denStart < str.length && (str[denStart] === ' ' || str[denStart] === '\n' || str[denStart] === '\t')) {
        denStart++;
      }
      const denMatch = getMatchingBraceContent(str, denStart);
      if (denMatch) {
        const num = parseFractionsToMarker(numMatch.content);
        const den = parseFractionsToMarker(denMatch.content);
        const replacement = `⟪FR:[${num}][${den}]⟫`;
        str = str.substring(0, index) + replacement + str.substring(denMatch.nextIndex);
        index = str.indexOf('\\frac', index); // continue from same place
        continue;
      }
    }
    index = str.indexOf('\\frac', index + 5);
  }
  return str;
}

// 3. Parse both \sqrt[n]{body} and literal Unicode √[n]{body} or √body -> ⟪RT:[n][body]⟫
function parseSqrt(str: string): string {
  // Find the first occurrence of either \sqrt or √
  let index = -1;
  let isUnicodeSymbol = false;
  
  const idxLaTeX = str.indexOf('\\sqrt');
  const idxUnicode = str.indexOf('√');
  
  if (idxLaTeX !== -1 && idxUnicode !== -1) {
    if (idxLaTeX < idxUnicode) {
      index = idxLaTeX;
      isUnicodeSymbol = false;
    } else {
      index = idxUnicode;
      isUnicodeSymbol = true;
    }
  } else if (idxLaTeX !== -1) {
    index = idxLaTeX;
    isUnicodeSymbol = false;
  } else if (idxUnicode !== -1) {
    index = idxUnicode;
    isUnicodeSymbol = true;
  }
  
  if (index === -1) {
    return str;
  }
  
  const symLen = isUnicodeSymbol ? 1 : 5;
  let scanIdx = index + symLen;
  
  // Skip whitespace
  while (scanIdx < str.length && (str[scanIdx] === ' ' || str[scanIdx] === '\t' || str[scanIdx] === '\n')) {
    scanIdx++;
  }
  
  let degree = "";
  // Check for optional index/degree [degree] immediately following
  if (scanIdx < str.length && str[scanIdx] === '[') {
    let bracketCount = 0;
    let closingBracketIdx = -1;
    for (let k = scanIdx; k < str.length; k++) {
      if (str[k] === '[') {
        bracketCount++;
      } else if (str[k] === ']') {
        bracketCount--;
        if (bracketCount === 0) {
          closingBracketIdx = k;
          break;
        }
      }
    }
    if (closingBracketIdx !== -1) {
      degree = str.substring(scanIdx + 1, closingBracketIdx);
      scanIdx = closingBracketIdx + 1;
      // Skip whitespace again
      while (scanIdx < str.length && (str[scanIdx] === ' ' || str[scanIdx] === '\t' || str[scanIdx] === '\n')) {
        scanIdx++;
      }
    }
  }
  
  // Now find the body/radicand at scanIdx
  if (scanIdx >= str.length) {
    const replacement = `⟪RT:[${degree}][]⟫`;
    const beforeSegment = str.substring(0, index);
    const afterSegment = str.substring(scanIdx);
    return beforeSegment + replacement + parseSqrt(afterSegment);
  }
  
  // Case 1: Braces {body}
  if (str[scanIdx] === '{') {
    const match = getMatchingBraceContent(str, scanIdx);
    if (match) {
      const bodyParsed = parseSqrt(match.content);
      const replacement = `⟪RT:[${degree}][${bodyParsed}]⟫`;
      const beforeSegment = str.substring(0, index);
      const afterSegment = str.substring(match.nextIndex);
      return beforeSegment + replacement + parseSqrt(afterSegment);
    }
  }
  
  // Case 2: Parentheses (body)
  if (str[scanIdx] === '(') {
    let parenCount = 0;
    let closingParenIdx = -1;
    for (let k = scanIdx; k < str.length; k++) {
      if (str[k] === '(') {
        parenCount++;
      } else if (str[k] === ')') {
        parenCount--;
        if (parenCount === 0) {
          closingParenIdx = k;
          break;
        }
      }
    }
    if (closingParenIdx !== -1) {
      const bodyParsed = parseSqrt(str.substring(scanIdx + 1, closingParenIdx));
      const replacement = `⟪RT:[${degree}][${bodyParsed}]⟫`;
      const beforeSegment = str.substring(0, index);
      const afterSegment = str.substring(closingParenIdx + 1);
      return beforeSegment + replacement + parseSqrt(afterSegment);
    }
  }
  
  // Case 3: A single number or numeric expression, or a single variable
  let bodyLength = 0;
  if (/[0-9]/.test(str[scanIdx])) {
    while (scanIdx + bodyLength < str.length && /[0-9.,]/.test(str[scanIdx + bodyLength])) {
      bodyLength++;
    }
  } else if (/[a-zA-Zα-ωΑ-Ω]/.test(str[scanIdx])) {
    if (str[scanIdx] === '\\') {
      let k = scanIdx + 1;
      while (k < str.length && /[a-zA-Z]/.test(str[k])) {
        k++;
      }
      bodyLength = k - scanIdx;
    } else {
      bodyLength = 1;
    }
  }
  
  if (bodyLength > 0) {
    const bodyRaw = str.substring(scanIdx, scanIdx + bodyLength);
    const bodyParsed = parseSqrt(bodyRaw);
    const replacement = `⟪RT:[${degree}][${bodyParsed}]⟫`;
    const beforeSegment = str.substring(0, index);
    const afterSegment = str.substring(scanIdx + bodyLength);
    return beforeSegment + replacement + parseSqrt(afterSegment);
  }
  
  // Case 4: Default/Fallback - take a single character as body
  const bodyParsed = parseSqrt(str[scanIdx]);
  const replacement = `⟪RT:[${degree}][${bodyParsed}]⟫`;
  const beforeSegment = str.substring(0, index);
  const afterSegment = str.substring(scanIdx + 1);
  return beforeSegment + replacement + parseSqrt(afterSegment);
}

// Subscript/Superscript converters
function toSubscript(text: string): string {
  const map: Record<string, string> = {
    '0': '₀', '1': '₁', '2': '₂', '3': '₃', '4': '₄', '5': '₅', '6': '₆', '7': '₇', '8': '₈', '9': '₉',
    '+': '₊', '-': '₋', '=': '₌', '(': '₍', ')': '₎', 'a': 'ₐ', 'e': 'ₑ', 'h': 'ₕ', 'i': 'ᵢ',
    'j': 'ⱼ', 'k': 'ₖ', 'l': 'ₗ', 'm': 'ₘ', 'n': 'ₙ', 'o': 'ₒ', 'p': 'ₚ', 'r': 'ᵣ', 's': 'ₛ',
    't': 'ₜ', 'u': 'ᵤ', 'v': 'ᵥ', 'x': 'ₓ', 'y': 'ᵧ'
  };
  return text.split('').map(char => map[char] || char).join('');
}

function toSuperscript(text: string): string {
  const map: Record<string, string> = {
    '0': '⁰', '1': '¹', '2': '²', '3': '³', '4': '⁴', '5': '⁵', '6': '⁶', '7': '⁷', '8': '⁸', '9': '⁹',
    '+': '⁺', '-': '⁻', '=': '⁼', '(': '⁽', ')': '⁾', 'a': 'ᵃ', 'e': 'ᵉ', 'h': 'ʰ', 'i': 'ⁱ',
    'j': 'ʲ', 'k': 'ᵏ', 'l': 'ˡ', 'm': 'ᵐ', 'n': 'ⁿ', 'o': 'ᵒ', 'p': 'ᵖ', 'r': 'ʳ', 's': 'ˢ',
    't': 'ᵗ', 'u': 'ᵘ', 'v': 'ᵛ', 'x': 'ˣ', 'y': 'ʸ', 'z': 'ᶻ'
  };
  return text.split('').map(char => map[char] || char).join('');
}

// 4. Parse _{sub} -> ₓ and ^{sup} -> ˣ
function parseSubSuperscripts(str: string): string {
  let subIndex = str.indexOf('_');
  while (subIndex !== -1) {
    if (str[subIndex + 1] === '{') {
      const match = getMatchingBraceContent(str, subIndex + 1);
      if (match) {
        const inside = parseSubSuperscripts(match.content);
        const converted = toSubscript(inside);
        str = str.substring(0, subIndex) + converted + str.substring(match.nextIndex);
        subIndex = str.indexOf('_', subIndex + converted.length);
        continue;
      }
    } else {
      const nextChar = str[subIndex + 1];
      if (nextChar && nextChar !== ' ' && nextChar !== '\\') {
        const converted = toSubscript(nextChar);
        str = str.substring(0, subIndex) + converted + str.substring(subIndex + 2);
        subIndex = str.indexOf('_', subIndex + converted.length);
        continue;
      }
    }
    subIndex = str.indexOf('_', subIndex + 1);
  }

  let supIndex = str.indexOf('^');
  while (supIndex !== -1) {
    if (str[supIndex + 1] === '{') {
      const match = getMatchingBraceContent(str, supIndex + 1);
      if (match) {
        const inside = parseSubSuperscripts(match.content);
        const converted = toSuperscript(inside);
        str = str.substring(0, supIndex) + converted + str.substring(match.nextIndex);
        supIndex = str.indexOf('^', supIndex + converted.length);
        continue;
      }
    } else {
      const nextChar = str[supIndex + 1];
      if (nextChar && nextChar !== ' ' && nextChar !== '\\') {
        const converted = toSuperscript(nextChar);
        str = str.substring(0, supIndex) + converted + str.substring(supIndex + 2);
        supIndex = str.indexOf('^', supIndex + converted.length);
        continue;
      }
    }
    supIndex = str.indexOf('^', supIndex + 1);
  }

  return str;
}

// 5. Replace other standard LaTeX symbols with elegant Word Equation Unicode equivalents
function replaceMathSymbols(str: string): string {
  const symbols: [RegExp, string][] = [
    // Basic Operators and Relations
    [/\\times/g, ' × '],
    [/\\cdot/g, ' · '],
    [/\\ast/g, ' * '],
    [/\\pm/g, ' ± '],
    [/\\div/g, ' ÷ '],
    [/\\neq/g, ' ≠ '],
    [/\\ne/g, ' ≠ '],
    [/\\geq/g, ' ≥ '],
    [/\\ge/g, ' ≥ '],
    [/\\leq/g, ' ≤ '],
    [/\\le/g, ' ≤ '],
    [/\\approx/g, ' ≈ '],
    [/\\propto/g, ' ∝ '],
    [/\\infty/g, ' ∞ '],
    [/\\partial/g, ' ∂ '],
    [/\\int/g, ' ∫ '],
    [/\\sum/g, ' ∑ '],
    [/\\degree/g, '°'],
    [/\\circ/g, '°'],
    [/\\angle/g, ' ∠ '],
    [/\\parallel/g, ' ∥ '],
    [/\\perp/g, ' ⊥ '],
    
    // Greek Letters (Lowercase)
    [/\\alpha/g, 'α'],
    [/\\beta/g, 'β'],
    [/\\gamma/g, 'γ'],
    [/\\delta/g, 'δ'],
    [/\\epsilon/g, 'ε'],
    [/\\zeta/g, 'ζ'],
    [/\\eta/g, 'η'],
    [/\\theta/g, 'θ'],
    [/\\iota/g, 'ι'],
    [/\\kappa/g, 'κ'],
    [/\\lambda/g, 'λ'],
    [/\\mu/g, 'μ'],
    [/\\nu/g, 'ν'],
    [/\\xi/g, 'ξ'],
    [/\\pi/g, 'π'],
    [/\\rho/g, 'ρ'],
    [/\\sigma/g, 'σ'],
    [/\\tau/g, 'τ'],
    [/\\upsilon/g, 'υ'],
    [/\\phi/g, 'φ'],
    [/\\chi/g, 'χ'],
    [/\\psi/g, 'ψ'],
    [/\\omega/g, 'ω'],
    
    // Greek Letters (Uppercase)
    [/\\Gamma/g, 'Γ'],
    [/\\Delta/g, 'Δ'],
    [/\\Theta/g, 'Θ'],
    [/\\Lambda/g, 'Λ'],
    [/\\Xi/g, 'Ξ'],
    [/\\Pi/g, 'Π'],
    [/\\Sigma/g, 'Σ'],
    [/\\Upsilon/g, 'Υ'],
    [/\\Phi/g, 'Φ'],
    [/\\Psi/g, 'Ψ'],
    [/\\Omega/g, 'Ω'],

    // Math Functions
    [/\\sin/g, 'sen'],
    [/\\cos/g, 'cos'],
    [/\\tan/g, 'tan'],
    [/\\log/g, 'log'],
    [/\\ln/g, 'ln'],

    // Sets and Logic
    [/\\mathbb\{R\}/g, 'ℝ'],
    [/\\mathbb\s*R/g, 'ℝ'],
    [/\\mathbbR/g, 'ℝ'],
    [/\\mathbb\{N\}/g, 'ℕ'],
    [/\\mathbb\s*N/g, 'ℕ'],
    [/\\mathbbN/g, 'ℕ'],
    [/\\mathbb\{Z\}/g, 'ℤ'],
    [/\\mathbb\s*Z/g, 'ℤ'],
    [/\\mathbbZ/g, 'ℤ'],
    [/\\mathbb\{Q\}/g, 'ℚ'],
    [/\\mathbb\s*Q/g, 'ℚ'],
    [/\\mathbbQ/g, 'ℚ'],
    [/\\mathbb\{C\}/g, 'ℂ'],
    [/\\mathbb\s*C/g, 'ℂ'],
    [/\\mathbbC/g, 'ℂ'],
    [/\\mathbb\{I\}/g, 'I'],
    [/\\mathbb\s*I/g, 'I'],
    [/\\mathbbI/g, 'I'],
    [/\\mathbb\{([A-Za-z])\}/g, '$1'],
    [/\\mathbb\s*([A-Za-z])/g, '$1'],
    [/\\mathbb([A-Za-z])/g, '$1'],
    [/\\mathcal\{([A-Za-z])\}/g, '$1'],
    [/\\mathcal\s*([A-Za-z])/g, '$1'],
    [/\\mathcal([A-Za-z])/g, '$1'],
    [/\\in/g, ' ∈ '],
    [/\\notin/g, ' ∉ '],
    [/\\subset/g, ' ⊂ '],
    [/\\supset/g, ' ⊃ '],
    [/\\subseteq/g, ' ⊆ '],
    [/\\supseteq/g, ' ⊇ '],
    [/\\cup/g, ' ∪ '],
    [/\\cap/g, ' ∩ '],
    [/\\emptyset/g, ' ∅ '],

    // Spacing & Escape characters
    [/\\%/g, '%'],
    [/\\ /g, ' '],
    [/\\\$/g, '$'],
    [/\\quad/g, '    '],
    [/\\qquad/g, '        '],
    [/\\,/g, ' '],
    [/\\;/g, ' '],
    [/\\!/g, ''],
    [/\\{/g, '{'],
    [/\\}/g, '}'],
    [/\\left\(/g, '('],
    [/\\right\)/g, ')'],
    [/\\left\[/g, '['],
    [/\\right\]/g, ']'],
    [/\\left\\{/g, '{'],
    [/\\right\\}/g, '}'],

    // Arrows
    [/\\to/g, ' → '],
    [/\\rightarrow/g, ' → '],
    [/\\implies/g, ' → '],
    [/\\implica/g, ' → '],
    [/\\leftarrow/g, ' ← '],
  ];

  for (const [regex, replacement] of symbols) {
    str = str.replace(regex, replacement);
  }

  // Remove LaTeX \text{...} wrappers
  str = str.replace(/\\text\s*\{([^}]+)\}/g, '$1');

  // Strip remaining outer simple braces of parameters, like {x} -> x
  str = str.replace(/\{([^{}]+)\}/g, '$1');

  return str;
}

function ensureBackslashes(str: string): string {
  // Let's add backslash to keywords if they don't have one inside the math expression
  const keywords = [
    'frac', 'sqrt', 'times', 'cdot', 'pm', 'div', 'neq', 'ne', 'geq', 'ge', 'leq', 'le',
    'approx', 'propto', 'infty', 'partial', 'int', 'sum', 'degree', 'circ', 'angle', 'parallel', 'perp',
    'alpha', 'beta', 'gamma', 'delta', 'epsilon', 'zeta', 'eta', 'theta', 'iota', 'kappa', 'lambda',
    'mu', 'nu', 'xi', 'pi', 'rho', 'sigma', 'tau', 'upsilon', 'phi', 'chi', 'psi', 'omega',
    'Gamma', 'Delta', 'Theta', 'Lambda', 'Xi', 'Pi', 'Sigma', 'Upsilon', 'Phi', 'Psi', 'Omega',
    'sin', 'cos', 'tan', 'log', 'ln', 'in', 'notin', 'subset', 'supset', 'subseteq', 'supseteq', 'cup', 'cap', 'emptyset',
    'mathbb', 'mathcal'
  ];

  let result = str;
  for (const kw of keywords) {
    const regex = new RegExp(`(?<!\\\\)\\b${kw}\\b`, 'g');
    result = result.replace(regex, `\\${kw}`);
  }
  return result;
}

// LaTeX to Unicode orchestrator
function translateLatexToUnicode(latexContent: string): string {
  let result = ensureBackslashes(latexContent);
  result = parseFractionsToMarker(result);
  result = parseSqrt(result);
  result = parseSubSuperscripts(result);
  result = replaceMathSymbols(result);
  return result.trim();
}

interface MathSegment {
  type: 'text' | 'root' | 'fraction';
  text?: string;
  degree?: string;
  bodySegment?: MathSegment[];
  numSegment?: MathSegment[];
  denSegment?: MathSegment[];
}

function parseSegments(str: string): MathSegment[] {
  const segments: MathSegment[] = [];
  let i = 0;
  
  while (i < str.length) {
    const nextMarkerIdx = str.indexOf('⟪', i);
    if (nextMarkerIdx === -1) {
      segments.push({ type: 'text', text: str.substring(i) });
      break;
    }
    
    if (nextMarkerIdx > i) {
      segments.push({ type: 'text', text: str.substring(i, nextMarkerIdx) });
    }
    
    // Check if the marker is a root (RT) or a fraction (FR)
    const markerType = str.substring(nextMarkerIdx + 1, nextMarkerIdx + 3); // "RT" or "FR"
    if (markerType !== 'RT' && markerType !== 'FR') {
      segments.push({ type: 'text', text: str.substring(nextMarkerIdx, nextMarkerIdx + 1) });
      i = nextMarkerIdx + 1;
      continue;
    }
    
    // Find matching closing marker ⟫
    let count = 0;
    let endIdx = -1;
    let j = nextMarkerIdx;
    
    while (j < str.length) {
      if (str.substring(j, j + 1) === '⟪') {
        count++;
        j += 1;
      } else if (str.substring(j, j + 1) === '⟫') {
        count--;
        if (count === 0) {
          endIdx = j;
          break;
        }
        j += 1;
      } else {
        j++;
      }
    }
    
    if (endIdx === -1) {
      segments.push({ type: 'text', text: str.substring(nextMarkerIdx) });
      break;
    }
    
    const header = str.substring(nextMarkerIdx + 4, endIdx); // Skip "⟪RT:" or "⟪FR:" (4 chars)
    
    if (markerType === 'RT') {
      if (header.startsWith('[')) {
        let bracketCount = 0;
        let closingDegreeIdx = -1;
        for (let k = 0; k < header.length; k++) {
          if (header[k] === '[') bracketCount++;
          else if (header[k] === ']') {
            bracketCount--;
            if (bracketCount === 0) {
              closingDegreeIdx = k;
              break;
            }
          }
        }
        
        if (closingDegreeIdx !== -1) {
          const degree = header.substring(1, closingDegreeIdx);
          const remaining = header.substring(closingDegreeIdx + 1);
          if (remaining.startsWith('[')) {
            let bodyBracketCount = 0;
            let closingBodyIdx = -1;
            for (let k = 0; k < remaining.length; k++) {
              if (remaining[k] === '[') bodyBracketCount++;
              else if (remaining[k] === ']') {
                bodyBracketCount--;
                if (bodyBracketCount === 0) {
                  closingBodyIdx = k;
                  break;
                }
              }
            }
            
            if (closingBodyIdx !== -1) {
              const body = remaining.substring(1, closingBodyIdx);
              segments.push({
                type: 'root',
                degree,
                bodySegment: parseSegments(body)
              });
              i = endIdx + 1;
              continue;
            }
          }
        }
      }
    } else if (markerType === 'FR') {
      if (header.startsWith('[')) {
        let bracketCount = 0;
        let closingNumIdx = -1;
        for (let k = 0; k < header.length; k++) {
          if (header[k] === '[') bracketCount++;
          else if (header[k] === ']') {
            bracketCount--;
            if (bracketCount === 0) {
              closingNumIdx = k;
              break;
            }
          }
        }
        
        if (closingNumIdx !== -1) {
          const num = header.substring(1, closingNumIdx);
          const remaining = header.substring(closingNumIdx + 1);
          if (remaining.startsWith('[')) {
            let denBracketCount = 0;
            let closingDenIdx = -1;
            for (let k = 0; k < remaining.length; k++) {
              if (remaining[k] === '[') denBracketCount++;
              else if (remaining[k] === ']') {
                denBracketCount--;
                if (denBracketCount === 0) {
                  closingDenIdx = k;
                  break;
                }
              }
            }
            
            if (closingDenIdx !== -1) {
              const den = remaining.substring(1, closingDenIdx);
              segments.push({
                type: 'fraction',
                numSegment: parseSegments(num),
                denSegment: parseSegments(den)
              });
              i = endIdx + 1;
              continue;
            }
          }
        }
      }
    }
    
    segments.push({ type: 'text', text: str.substring(nextMarkerIdx, endIdx + 1) });
    i = endIdx + 1;
  }
  
  return segments;
}

function renderPlainMathText(mathStr: string, keyPrefix: string, variant: 'light' | 'dark' = 'light'): React.ReactNode {
  const tokens: React.ReactNode[] = [];
  const regex = /([a-zA-Zα-ωΑ-ΩΔΩ][₀₁₂₃₄₅₆₇₈₉₊₋₌₍₎ₐₑₕᵢⱼₖₗₘₙₒₚᵣₛₜᵤᵥₓᵧ⁰¹²³⁴⁵⁶⁷⁸⁹⁺⁻⁼⁽⁾ᵃᵇᶜᵈᵉ𝖿ᵍʰⁱʲᵏˡᵐⁿᵒᵖʳˢᵗᵘᵛʷˣʸᶻ]*)|([0-9]+(?:[,.][0-9]+)?)|(\s+)|(.)/g;
  let match;
  let key = 0;
  
  while ((match = regex.exec(mathStr)) !== null) {
    const [_, variable, number, spaces, other] = match;
    const tokenKey = `${keyPrefix}-${key++}`;
    
    if (variable) {
      tokens.push(
        <span 
          key={tokenKey} 
          className={`font-sans italic font-bold tracking-wide ${
            variant === 'dark' ? 'text-amber-200' : 'text-brand-secondary font-extrabold'
          }`}
        >
          {variable}
        </span>
      );
    } else if (number) {
      tokens.push(
        <span 
          key={tokenKey} 
          className={`font-sans font-black ${
            variant === 'dark' ? 'text-slate-100' : 'text-brand-dark'
          }`}
        >
          {number}
        </span>
      );
    } else if (spaces) {
      tokens.push(<span key={tokenKey}>{spaces}</span>);
    } else if (other) {
      const isOperator = /[=+\-*/×÷·≠≤≥±≈√∫∑→←]/.test(other);
      tokens.push(
        <span 
          key={tokenKey} 
          className={`font-sans ${
            isOperator 
              ? (variant === 'dark' ? 'text-yellow-300 font-black mx-0.5' : 'text-brand-dark font-black mx-0.5')
              : (variant === 'dark' ? 'text-slate-200' : 'text-[#5C5A8F] font-bold')
          }`}
        >
          {other}
        </span>
      );
    }
  }
  
  return <React.Fragment key={keyPrefix}>{tokens}</React.Fragment>;
}

function renderSegmentsToReact(segments: MathSegment[], keyPrefix = "seg", variant: 'light' | 'dark' = 'light'): React.ReactNode[] {
  return segments.map((seg, idx) => {
    const key = `${keyPrefix}-${idx}`;
    if (seg.type === 'text') {
      return renderPlainMathText(seg.text || "", key, variant);
    } else if (seg.type === 'root') {
      const nestedContent = renderSegmentsToReact(seg.bodySegment || [], `${key}-body`, variant);
      const degree = seg.degree ? seg.degree.trim() : "";
      
      return (
        <span key={key} className="inline-flex items-stretch align-middle justify-center mx-1 relative pt-[1.5px] pb-[1px] select-text">
          {degree && (
            <span className={`self-start text-[9px] font-sans font-extrabold -mr-[5px] mt-[-3px] select-none leading-none z-10 ${
              variant === 'dark' ? 'text-yellow-300' : 'text-brand-dark'
            }`}>
              {degree}
            </span>
          )}
          <span className="inline-flex items-stretch">
            {/* SVG Radical Sign - stretched dynamically to parent's full height */}
            <span className={`inline-flex items-stretch select-none mr-[-1px] w-[12px] ${
              variant === 'dark' ? 'text-yellow-300' : 'text-brand-dark'
            }`}>
              <svg 
                viewBox="0 0 12 24" 
                fill="none" 
                stroke="currentColor" 
                strokeWidth="2.5" 
                strokeLinecap="square"
                strokeLinejoin="miter"
                preserveAspectRatio="none"
                className="w-full h-full"
              >
                <path d="M 1 13 L 3 13 L 6 23 L 9.5 1 L 12 1" />
              </svg>
            </span>
            {/* Radicand with Top Border */}
            <span className={`border-t-[2.5px] border-solid pl-1 pr-1.5 pt-[2px] pb-[1px] inline-flex items-center text-[0.95em] leading-none font-sans ${
              variant === 'dark' ? 'border-yellow-300' : 'border-brand-dark'
            }`}>
              {nestedContent}
            </span>
          </span>
        </span>
      );
    } else {
      // Fraction type
      const numContent = renderSegmentsToReact(seg.numSegment || [], `${key}-num`, variant);
      const denContent = renderSegmentsToReact(seg.denSegment || [], `${key}-den`, variant);
      
      return (
        <span key={key} className="inline-flex flex-col items-center align-middle mx-1.5 text-center select-text relative pt-[1px] pb-[2px]">
          <span className="text-[0.85em] pb-[2px] leading-none block w-full text-center">
            {numContent}
          </span>
          <span className={`border-b-[2px] border-solid w-full select-none block mb-[2px] ${
            variant === 'dark' ? 'border-yellow-300/80' : 'border-brand-dark/40'
          }`} />
          <span className="text-[0.85em] pt-[2px] leading-none block w-full text-center">
            {denContent}
          </span>
        </span>
      );
    }
  });
}

// Tokenize and render Word Equation-matched look with italic alphabetic variables
export const renderUnicodeMath = (mathStr: string, isBlock: boolean, variant: 'light' | 'dark' = 'light') => {
  const segments = parseSegments(mathStr);
  const reactContent = renderSegmentsToReact(segments, isBlock ? "block" : "inline", variant);
  
  if (isBlock) {
    if (variant === 'dark') {
      return (
        <div className="my-4 overflow-x-auto overflow-y-hidden text-center max-w-full text-slate-100 bg-black/30 p-4 rounded-xl border border-white/10 leading-relaxed shadow-inner">
          <span className="text-base md:text-lg select-text inline-flex items-center justify-center gap-0.5">{reactContent}</span>
        </div>
      );
    } else {
      return (
        <div className="my-4 overflow-x-auto overflow-y-hidden text-center max-w-full text-brand-dark bg-white p-4 rounded-[2rem] border-3 border-brand-dark leading-relaxed shadow-[0px_6px_0px_#1E1B4B]">
          <span className="text-base md:text-lg select-text inline-flex items-center justify-center gap-0.5">{reactContent}</span>
        </div>
      );
    }
  }
  
  return (
    <span className="inline-flex items-center align-baseline select-text">
      {reactContent}
    </span>
  );
};

// Helper to automatically identify unwrapped LaTeX expressions and wrap them in $ delimiters
function autoFormatUnwrappedLaTeX(text: string): string {
  if (text.includes('$')) {
    // If it already has delimiters, don't auto-wrap to avoid double wrapping
    return text;
  }

  // Regex to match LaTeX commands and their potential arguments
  const latexCommandRegex = /\\([a-zA-Z]+)(?:\[[^\]]*\])?(?:\{[^{}]*\})*/g;

  // Regex to match subscripts and superscripts attached to variables or numbers (restrict unbraced to 1-3 chars to avoid snake_case words)
  const subSupRegex = /\b([a-zA-Z0-9]+(?:[\^_](?:\{[^{}]*\}|[a-zA-Z0-9+\-*/=]{1,3}))+)/g;

  // Regex for isolated sub/superscripts like _2 or ^2
  const isolatedSubSupRegex = /([\^_](?:\{[^{}]*\}|[a-zA-Z0-9+\-*/=]{1,3}))/g;

  const matches: { start: number; end: number }[] = [];

  // Match LaTeX commands
  let match;
  latexCommandRegex.lastIndex = 0;
  while ((match = latexCommandRegex.exec(text)) !== null) {
    matches.push({
      start: match.index,
      end: latexCommandRegex.lastIndex
    });
  }

  // Match sub/sup
  subSupRegex.lastIndex = 0;
  while ((match = subSupRegex.exec(text)) !== null) {
    const start = match.index;
    const end = subSupRegex.lastIndex;
    if (!matches.some(m => (start >= m.start && start < m.end) || (end > m.start && end <= m.end))) {
      matches.push({ start, end });
    }
  }

  // Match isolated sub/sup
  isolatedSubSupRegex.lastIndex = 0;
  while ((match = isolatedSubSupRegex.exec(text)) !== null) {
    const start = match.index;
    const end = isolatedSubSupRegex.lastIndex;
    if (!matches.some(m => (start >= m.start && start < m.end) || (end > m.start && end <= m.end))) {
      matches.push({ start, end });
    }
  }

  if (matches.length === 0) {
    return text;
  }

  // Sort matches by start index
  matches.sort((a, b) => a.start - b.start);

  // Merge overlapping or adjacent matches
  const mergedMatches: { start: number; end: number }[] = [];
  let current = matches[0];

  for (let i = 1; i < matches.length; i++) {
    const next = matches[i];
    // If adjacent or overlapping with tiny gap of up to 2 characters
    if (next.start <= current.end + 2) {
      current.end = Math.max(current.end, next.end);
    } else {
      mergedMatches.push(current);
      current = next;
    }
  }
  mergedMatches.push(current);

  // Re-build string with math wrapped in $...$
  let result = "";
  let lastIdx = 0;
  for (const m of mergedMatches) {
    result += text.substring(lastIdx, m.start);
    const mathPart = text.substring(m.start, m.end);
    result += `$${mathPart}$`;
    lastIdx = m.end;
  }
  result += text.substring(lastIdx);

  return result;
}

// Helper to normalize any messy or broken Brazilian currency (R$, R\$, R\ \ , R\2,50, etc.) to standard R$ [value]
function normalizeCurrencies(text: string): string {
  let res = text;

  // 1. Match words attached to the currency symbols and split them with a single space (e.g. "maisR\2,00" -> "mais R$ 2,00")
  res = res.replace(/([a-zA-Záàâãéèêíïóôõöúçñ]+)\$?R\s*(?:\\|\$|\s|,)+\s*(\d+(?:[\.,]\d+)?)\$?/gi, '$1 R$ $2');

  // 2. Match and resolve any remaining R$ structure regardless of slashes, thin spaces, dollar signs, or commas
  res = res.replace(/\$?R\s*(?:\\|\$|\s|,)+\s*(\d+(?:[\.,]\d+)?)\$?/gi, 'R$ $1');

  return res;
}

function hideCurrencies(text: string): { processedText: string; savedCurrencies: string[] } {
  const normalized = normalizeCurrencies(text);
  const savedCurrencies: string[] = [];

  const processedText = normalized.replace(/R\$\s*(\d+(?:[\.,]\d+)?)/gi, (match, val) => {
    savedCurrencies.push(`R$ ${val}`);
    return `⟪CUR:${savedCurrencies.length - 1}⟫`;
  });

  return { processedText, savedCurrencies };
}

function renderTextWithCurrencies(
  text: string,
  savedCurrencies: string[],
  keyPrefix: number,
  variant: 'light' | 'dark' = 'light',
  className?: string
): React.ReactNode {
  const parts: React.ReactNode[] = [];
  const regex = /⟪CUR:(\d+)⟫/g;
  let lastIdx = 0;
  let match;
  let key = 0;

  const currencyStyle = variant === 'dark' 
    ? "font-sans font-extrabold text-amber-200" 
    : "font-sans font-extrabold text-brand-secondary";

  while ((match = regex.exec(text)) !== null) {
    const startIdx = match.index;
    if (startIdx > lastIdx) {
      parts.push(
        <span key={`${keyPrefix}-txt-${key++}`} className={className}>
          {text.substring(lastIdx, startIdx)}
        </span>
      );
    }

    const savedIdx = parseInt(match[1]);
    const currencyText = savedCurrencies[savedIdx] || "";
    parts.push(
      <span key={`${keyPrefix}-cur-${key++}`} className={currencyStyle}>
        {currencyText}
      </span>
    );

    lastIdx = regex.lastIndex;
  }

  if (lastIdx < text.length) {
    parts.push(
      <span key={`${keyPrefix}-txt-${key++}`} className={className}>
        {text.substring(lastIdx)}
      </span>
    );
  }

  return <React.Fragment key={`wrapper-${keyPrefix}`}>{parts}</React.Fragment>;
}

export const MathText: React.FC<MathTextProps> = ({ text, className, variant = 'light' }) => {
  if (!text) return null;

  // Pre-sanitize LaTeX arrows and backslashes globally to prevent leaking to the UI
  const rawText = text
    .replace(/\\+implies/g, ' → ')
    .replace(/\\+rightarrow/g, ' → ')
    .replace(/\\+to/g, ' → ')
    .replace(/\\\\/g, '\\');

  // Protect currencies from math delimiter parsing
  const { processedText: shieldedText, savedCurrencies } = hideCurrencies(rawText);

  const processedText = autoFormatUnwrappedLaTeX(shieldedText);

  const parts: React.ReactNode[] = [];
  let currentIdx = 0;
  let keyIdx = 0;

  while (currentIdx < processedText.length) {
    const nextBlockStart = processedText.indexOf('$$', currentIdx);
    const nextInlineStart = processedText.indexOf('$', currentIdx);

    let isBlock = false;
    let startIdx = -1;

    if (nextBlockStart !== -1 && (nextInlineStart === -1 || nextBlockStart <= nextInlineStart)) {
      isBlock = true;
      startIdx = nextBlockStart;
    } else if (nextInlineStart !== -1) {
      isBlock = false;
      startIdx = nextInlineStart;
    }

    if (startIdx === -1) {
      parts.push(
        <span key={keyIdx++} className="whitespace-pre-wrap">
          {renderTextWithCurrencies(processedText.substring(currentIdx), savedCurrencies, keyIdx, variant, "whitespace-pre-wrap")}
        </span>
      );
      break;
    }

    if (startIdx > currentIdx) {
      parts.push(
        <span key={keyIdx++} className="whitespace-pre-wrap">
          {renderTextWithCurrencies(processedText.substring(currentIdx, startIdx), savedCurrencies, keyIdx, variant, "whitespace-pre-wrap")}
        </span>
      );
    }

    const delimiter = isBlock ? '$$' : '$';
    const contentStartIdx = startIdx + delimiter.length;
    const endIdx = processedText.indexOf(delimiter, contentStartIdx);

    if (endIdx === -1) {
      parts.push(
        <span key={keyIdx++} className="whitespace-pre-wrap">
          {renderTextWithCurrencies(processedText.substring(startIdx), savedCurrencies, keyIdx, variant, "whitespace-pre-wrap")}
        </span>
      );
      break;
    }

    const mathContent = processedText.substring(contentStartIdx, endIdx);
    const unicodeMath = translateLatexToUnicode(mathContent);
    parts.push(
      <React.Fragment key={keyIdx++}>
        {renderUnicodeMath(unicodeMath, isBlock, variant)}
      </React.Fragment>
    );

    currentIdx = endIdx + delimiter.length;
  }

  return <span className={className}>{parts}</span>;
};
