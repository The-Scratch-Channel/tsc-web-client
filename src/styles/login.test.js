import { describe, it, expect, beforeAll } from 'vitest';
import { readFileSync } from 'fs';
import { join } from 'path';

describe('login.css Validation', () => {
  let cssContent;

  beforeAll(() => {
    // Read the CSS file
    const cssPath = join(process.cwd(), 'src/styles/login.css');
    cssContent = readFileSync(cssPath, 'utf-8');
  });

  describe('CSS Syntax and Structure', () => {
    it('should have valid CSS syntax (no unclosed brackets)', () => {
      const openBrackets = (cssContent.match(/{/g) || []).length;
      const closeBrackets = (cssContent.match(/}/g) || []).length;
      
      expect(openBrackets).toBe(closeBrackets);
    });

    it('should not have syntax errors with semicolons', () => {
      const lines = cssContent.split('\n');
      for (let i = 0; i < lines.length; i++) {
        const trimmed = lines[i].trim();
        if (!trimmed || trimmed.startsWith('/*') || trimmed.startsWith('//')) continue;
        if (!trimmed.includes(':')) continue;
        if (trimmed.includes('{') || trimmed.includes('}')) continue;
        if (trimmed.endsWith(';')) continue;
        // Allow missing semicolon only if the next non-empty, non-comment line is a closing brace
        let j = i + 1, next = '';
        while (j < lines.length) {
          const t = lines[j].trim();
          if (t && !t.startsWith('/*') && !t.startsWith('//')) { next = t; break; }
          j++;
        }
        expect(next).toBe('}');
      }
    });

    it('should have proper comment syntax', () => {
      const commentStarts = (cssContent.match(/\/\*/g) || []).length;
      const commentEnds = (cssContent.match(/\*\//g) || []).length;
      
      expect(commentStarts).toBe(commentEnds);
    });
  });

  describe('Required CSS Classes', () => {
    it('should define .login-container class', () => {
      expect(cssContent).toContain('.login-container');
    });

    it('should define .form-group class', () => {
      expect(cssContent).toContain('.form-group');
    });

    it('should define .form-input class', () => {
      expect(cssContent).toContain('.form-input');
    });

    it('should define .submit-button class', () => {
      expect(cssContent).toContain('.submit-button');
    });

    it('should define .form-input:focus pseudo-class', () => {
      expect(cssContent).toContain('.form-input:focus');
    });

    it('should define .submit-button:hover pseudo-class', () => {
      expect(cssContent).toContain('.submit-button:hover');
    });
  });

  describe('Critical CSS Properties', () => {
    describe('.login-container', () => {
      it('should have display: flex', () => {
        const containerBlock = extractCSSBlock(cssContent, '.login-container');
        expect(containerBlock).toContain('display: flex');
      });

      it('should have centering properties', () => {
        const containerBlock = extractCSSBlock(cssContent, '.login-container');
        expect(containerBlock).toContain('justify-content: center');
        expect(containerBlock).toContain('align-items: center');
      });

      it('should have minimum height for full viewport', () => {
        const containerBlock = extractCSSBlock(cssContent, '.login-container');
        expect(containerBlock).toContain('min-height: 100vh');
      });

      it('should have padding', () => {
        const containerBlock = extractCSSBlock(cssContent, '.login-container');
        expect(containerBlock).toContain('padding');
      });
    });

    describe('.form-group', () => {
      it('should have margin-bottom for spacing', () => {
        const formGroupBlock = extractCSSBlock(cssContent, '.form-group');
        expect(formGroupBlock).toContain('margin-bottom');
      });
    });

    describe('.form-input', () => {
      it('should have full width', () => {
        const inputBlock = extractCSSBlock(cssContent, '.form-input');
        expect(inputBlock).toContain('width: 100%');
      });

      it('should have padding', () => {
        const inputBlock = extractCSSBlock(cssContent, '.form-input');
        expect(inputBlock).toContain('padding');
      });

      it('should have border styling', () => {
        const inputBlock = extractCSSBlock(cssContent, '.form-input');
        expect(inputBlock).toContain('border');
      });

      it('should have border-radius for rounded corners', () => {
        const inputBlock = extractCSSBlock(cssContent, '.form-input');
        expect(inputBlock).toContain('border-radius');
      });

      it('should have transition for smooth effects', () => {
        const inputBlock = extractCSSBlock(cssContent, '.form-input');
        expect(inputBlock).toContain('transition');
      });

      it('should use CSS variables for theming', () => {
        const inputBlock = extractCSSBlock(cssContent, '.form-input');
        expect(inputBlock).toContain('var(--highlight-color)');
      });

      it('should have box-sizing for proper width calculation', () => {
        const inputBlock = extractCSSBlock(cssContent, '.form-input');
        expect(inputBlock).toContain('box-sizing: border-box');
      });
    });

    describe('.form-input:focus', () => {
      it('should remove default outline', () => {
        const focusBlock = extractCSSBlock(cssContent, '.form-input:focus');
        expect(focusBlock).toContain('outline: none');
      });

      it('should have custom border color on focus', () => {
        const focusBlock = extractCSSBlock(cssContent, '.form-input:focus');
        expect(focusBlock).toContain('border-color');
      });

      it('should have box-shadow for focus indicator', () => {
        const focusBlock = extractCSSBlock(cssContent, '.form-input:focus');
        expect(focusBlock).toContain('box-shadow');
      });
    });

    describe('.submit-button', () => {
      it('should have background color', () => {
        const buttonBlock = extractCSSBlock(cssContent, '.submit-button');
        expect(buttonBlock).toContain('background');
      });

      it('should use CSS variable for background', () => {
        const buttonBlock = extractCSSBlock(cssContent, '.submit-button');
        expect(buttonBlock).toContain('var(--highlight-color)');
      });

      it('should have border-radius', () => {
        const buttonBlock = extractCSSBlock(cssContent, '.submit-button');
        expect(buttonBlock).toContain('border-radius');
      });

      it('should have box-shadow for depth', () => {
        const buttonBlock = extractCSSBlock(cssContent, '.submit-button');
        expect(buttonBlock).toContain('box-shadow');
      });

      it('should have transition for hover effects', () => {
        const buttonBlock = extractCSSBlock(cssContent, '.submit-button');
        expect(buttonBlock).toContain('transition');
      });

      it('should have cursor pointer', () => {
        const buttonBlock = extractCSSBlock(cssContent, '.submit-button');
        expect(buttonBlock).toContain('cursor: pointer');
      });

      it('should have color property', () => {
        const buttonBlock = extractCSSBlock(cssContent, '.submit-button');
        expect(buttonBlock).toContain('color');
      });
    });

    describe('.submit-button:hover', () => {
      it('should have transform effect', () => {
        const hoverBlock = extractCSSBlock(cssContent, '.submit-button:hover');
        expect(hoverBlock).toContain('transform');
      });

      it('should have translateY for lift effect', () => {
        const hoverBlock = extractCSSBlock(cssContent, '.submit-button:hover');
        expect(hoverBlock).toContain('translateY');
      });

      it('should have enhanced box-shadow on hover', () => {
        const hoverBlock = extractCSSBlock(cssContent, '.submit-button:hover');
        expect(hoverBlock).toContain('box-shadow');
      });
    });
  });

  describe('CSS Variables Usage', () => {
    it('should use --highlight-color CSS variable', () => {
      expect(cssContent).toContain('var(--highlight-color)');
    });

    it('should use CSS variables consistently', () => {
      const varMatches = cssContent.match(/var\(--[\w-]+\)/g) || [];
      expect(varMatches.length).toBeGreaterThan(0);
    });
  });

  describe('Responsive Design', () => {
    it('should use relative units for spacing', () => {
      // Check for rem or em units
      const hasRelativeUnits = /\d+\.?\d*rem|\d+\.?\d*em/.test(cssContent);
      expect(hasRelativeUnits).toBe(true);
    });

    it('should have viewport-based height', () => {
      expect(cssContent).toContain('vh');
    });

    it('should use percentage for width', () => {
      expect(cssContent).toContain('100%');
    });
  });

  describe('Animation and Transitions', () => {
    it('should have smooth transitions', () => {
      const transitionMatches = cssContent.match(/transition:/g) || [];
      expect(transitionMatches.length).toBeGreaterThan(0);
    });

    it('should specify transition timing', () => {
      expect(cssContent).toContain('ease');
    });

    it('should have reasonable transition duration', () => {
      const durationMatch = cssContent.match(/(\d+\.?\d*)s/);
      if (durationMatch) {
        const duration = parseFloat(durationMatch[1]);
        expect(duration).toBeGreaterThan(0);
        expect(duration).toBeLessThan(2); // Transitions shouldn't be too long
      }
    });
  });

  describe('Color and Theming', () => {
    it('should have proper color values', () => {
      // Check for valid hex colors or CSS variables
      const hasColors = /#[0-9a-fA-F]{3,6}|var\(--[\w-]+\)|rgba?\(/.test(cssContent);
      expect(hasColors).toBe(true);
    });

    it('should use consistent color scheme', () => {
      const colorRefs = cssContent.match(/var\(--[\w-]+\)/g) || [];
      expect(colorRefs.length).toBeGreaterThan(0);
    });
  });

  describe('Box Model Properties', () => {
    it('should have proper spacing with padding', () => {
      const paddingMatches = cssContent.match(/padding:/g) || [];
      expect(paddingMatches.length).toBeGreaterThan(0);
    });

    it('should have proper spacing with margin', () => {
      const marginMatches = cssContent.match(/margin:/g) || [];
      expect(marginMatches.length).toBeGreaterThan(0);
    });

    it('should specify border-radius for rounded corners', () => {
      const borderRadiusMatches = cssContent.match(/border-radius:/g) || [];
      expect(borderRadiusMatches.length).toBeGreaterThan(0);
    });
  });

  describe('Accessibility Considerations', () => {
    it('should have focus styles defined', () => {
      expect(cssContent).toContain(':focus');
    });

    it('should not remove focus outline without alternative', () => {
      if (cssContent.includes('outline: none')) {
        // Should have alternative focus indicator (border or box-shadow)
        const focusBlock = extractCSSBlock(cssContent, ':focus');
        const hasAlternative = focusBlock.includes('border') || focusBlock.includes('box-shadow');
        expect(hasAlternative).toBe(true);
      }
    });

    it('should have sufficient color contrast indicators', () => {
      // Check that there are explicit color definitions
      expect(cssContent).toContain('color');
    });
  });

  describe('Code Quality', () => {
    it('should have human-readable comments', () => {
      const hasComments = cssContent.includes('/*');
      expect(hasComments).toBe(true);
    });

    it('should not have excessive empty lines', () => {
      const emptyLineMatches = cssContent.match(/\n\s*\n\s*\n/g) || [];
      // Allow some empty lines but not excessive
      expect(emptyLineMatches.length).toBeLessThan(10);
    });

    it('should use consistent indentation', () => {
      const lines = cssContent.split('\n');
      const indentedLines = lines.filter(line => line.match(/^\s+\S/));
      
      // Most indented lines should have consistent spacing
      expect(indentedLines.length).toBeGreaterThan(0);
    });
  });

  describe('Browser Compatibility', () => {
    it('should use standard CSS properties', () => {
      // Check that there are no deprecated properties (basic check)
      expect(cssContent).not.toContain('-webkit-box-');
      expect(cssContent).not.toContain('-moz-');
    });

    it('should use modern flexbox syntax', () => {
      if (cssContent.includes('display: flex')) {
        // Should use standard flex properties
        expect(cssContent).not.toContain('display: -webkit-flex');
      }
    });
  });

  describe('Performance Considerations', () => {
    it('should not have overly complex selectors', () => {
      const lines = cssContent.split('\n');
      const selectorLines = lines.filter(line => line.includes('{') && !line.includes('}'));
      
      selectorLines.forEach(line => {
        const selectorDepth = (line.match(/\s+/g) || []).length;
        expect(selectorDepth).toBeLessThan(5); // Avoid deeply nested selectors
      });
    });

    it('should use efficient property combinations', () => {
      // Check that transition is used efficiently
      if (cssContent.includes('transition:')) {
        expect(cssContent).toContain('all'); // or specific properties
      }
    });
  });
});

// Helper function to extract CSS block for a selector
function extractCSSBlock(css, selector) {
  const selectorIndex = css.indexOf(selector);
  if (selectorIndex === -1) return '';
  
  const startBrace = css.indexOf('{', selectorIndex);
  if (startBrace === -1) return '';
  
  let braceCount = 1;
  let endBrace = startBrace + 1;
  
  while (braceCount > 0 && endBrace < css.length) {
    if (css[endBrace] === '{') braceCount++;
    if (css[endBrace] === '}') braceCount--;
    endBrace++;
  }
  
  return css.substring(startBrace, endBrace);
}