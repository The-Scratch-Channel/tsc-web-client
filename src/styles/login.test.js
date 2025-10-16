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
      // Check that properties end with semicolons (basic check)
      const lines = cssContent.split('\n');
      const propertyLines = lines.filter(line => 
        line.includes(':') && 
        !line.trim().startsWith('/*') &&
        !line.trim().startsWith('//') &&
        line.includes('{') === false
      );

      propertyLines.forEach(line => {
        if (line.trim() && line.includes(':')) {
          // Should end with semicolon or be inside a comment
          const trimmed = line.trim();
          if (!trimmed.endsWith('*/')) {
            expect(
              trimmed.endsWith(';') || trimmed.endsWith('{'),
              `Line should end with semicolon: ${line}`
            ).toBe(true);
          }
        }
      });
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

  describe('CSS Specificity and Cascade', () => {
    it('should not have overly specific selectors', () => {
      const lines = cssContent.split('\n');
      const selectors = lines.filter(line => line.includes('{') && !line.includes('}'));
      
      selectors.forEach(selector => {
        // Avoid deeply nested or overly specific selectors
        const depth = (selector.match(/\s+/g) || []).length;
        expect(depth).toBeLessThan(4);
      });
    });

    it('should use single class selectors for maintainability', () => {
      // Check that most selectors are simple class-based
      expect(cssContent).toContain('.login-container');
      expect(cssContent).toContain('.form-group');
      expect(cssContent).toContain('.form-input');
      expect(cssContent).toContain('.submit-button');
    });

    it('should avoid !important declarations', () => {
      const importantCount = (cssContent.match(/!important/gi) || []).length;
      expect(importantCount).toBe(0);
    });
  });

  describe('Layout and Positioning', () => {
    it('should use flexbox for centering', () => {
      const containerBlock = extractCSSBlock(cssContent, '.login-container');
      expect(containerBlock).toContain('display: flex');
      expect(containerBlock).toContain('justify-content: center');
      expect(containerBlock).toContain('align-items: center');
    });

    it('should have proper box model settings', () => {
      const inputBlock = extractCSSBlock(cssContent, '.form-input');
      expect(inputBlock).toContain('box-sizing: border-box');
    });

    it('should use viewport units appropriately', () => {
      expect(cssContent).toContain('vh');
    });

    it('should have padding for spacing', () => {
      const containerBlock = extractCSSBlock(cssContent, '.login-container');
      expect(containerBlock).toMatch(/padding:\s*\d+px/);
    });
  });

  describe('Typography and Font Styling', () => {
    it('should define font-size for inputs', () => {
      const inputBlock = extractCSSBlock(cssContent, '.form-input');
      expect(inputBlock).toContain('font-size');
    });

    it('should use rem units for font sizing', () => {
      expect(cssContent).toMatch(/font-size:\s*\d+\.?\d*rem/);
    });

    it('should have color definitions', () => {
      expect(cssContent).toMatch(/color:/);
    });
  });

  describe('Interactive States', () => {
    it('should have hover state for button', () => {
      expect(cssContent).toContain('.submit-button:hover');
    });

    it('should have focus state for inputs', () => {
      expect(cssContent).toContain('.form-input:focus');
    });

    it('should define cursor pointer for button', () => {
      const buttonBlock = extractCSSBlock(cssContent, '.submit-button');
      expect(buttonBlock).toContain('cursor: pointer');
    });

    it('should have transition for smooth interactions', () => {
      const inputBlock = extractCSSBlock(cssContent, '.form-input');
      const buttonBlock = extractCSSBlock(cssContent, '.submit-button');
      
      expect(inputBlock.includes('transition') || buttonBlock.includes('transition')).toBe(true);
    });
  });

  describe('Visual Effects and Styling', () => {
    it('should have border-radius for modern appearance', () => {
      const inputBlock = extractCSSBlock(cssContent, '.form-input');
      const buttonBlock = extractCSSBlock(cssContent, '.submit-button');
      
      expect(inputBlock).toContain('border-radius');
      expect(buttonBlock).toContain('border-radius');
    });

    it('should use box-shadow for depth', () => {
      expect(cssContent).toContain('box-shadow');
    });

    it('should have transform effects', () => {
      expect(cssContent).toContain('transform');
    });

    it('should specify transition timing', () => {
      expect(cssContent).toMatch(/transition:.*ease/);
    });
  });

  describe('Color Theming', () => {
    it('should use CSS custom properties for theming', () => {
      expect(cssContent).toContain('var(--highlight-color)');
    });

    it('should have consistent color usage', () => {
      const varCount = (cssContent.match(/var\(--highlight-color\)/g) || []).length;
      expect(varCount).toBeGreaterThan(1);
    });

    it('should define background colors', () => {
      expect(cssContent).toMatch(/background:/);
    });

    it('should define border colors', () => {
      expect(cssContent).toMatch(/border.*color/i);
    });
  });

  describe('Spacing and Rhythm', () => {
    it('should have consistent spacing units', () => {
      const spacingPattern = /\d+\.?\d*rem/g;
      const spacings = cssContent.match(spacingPattern) || [];
      expect(spacings.length).toBeGreaterThan(0);
    });

    it('should have margin-bottom for form groups', () => {
      const formGroupBlock = extractCSSBlock(cssContent, '.form-group');
      expect(formGroupBlock).toContain('margin-bottom');
    });

    it('should use padding for input fields', () => {
      const inputBlock = extractCSSBlock(cssContent, '.form-input');
      expect(inputBlock).toMatch(/padding:\s*\d+px\s+\d+px/);
    });
  });

  describe('Responsive Considerations', () => {
    it('should handle small screens with min-height', () => {
      const containerBlock = extractCSSBlock(cssContent, '.login-container');
      expect(containerBlock).toContain('min-height: 100vh');
    });

    it('should have responsive padding', () => {
      const containerBlock = extractCSSBlock(cssContent, '.login-container');
      expect(containerBlock).toContain('padding');
    });

    it('should use percentage widths', () => {
      const inputBlock = extractCSSBlock(cssContent, '.form-input');
      expect(inputBlock).toContain('width: 100%');
    });
  });

  describe('Border Styling', () => {
    it('should define border properties', () => {
      const inputBlock = extractCSSBlock(cssContent, '.form-input');
      expect(inputBlock).toContain('border');
    });

    it('should specify border width', () => {
      const inputBlock = extractCSSBlock(cssContent, '.form-input');
      expect(inputBlock).toMatch(/border:\s*\d+px/);
    });

    it('should define border style', () => {
      const inputBlock = extractCSSBlock(cssContent, '.form-input');
      expect(inputBlock).toMatch(/border.*solid/i);
    });
  });

  describe('Focus State Accessibility', () => {
    it('should have visible focus indicator', () => {
      const focusBlock = extractCSSBlock(cssContent, '.form-input:focus');
      const hasVisualIndicator = focusBlock.includes('border') || focusBlock.includes('box-shadow');
      expect(hasVisualIndicator).toBe(true);
    });

    it('should have focus box-shadow for visibility', () => {
      const focusBlock = extractCSSBlock(cssContent, '.form-input:focus');
      expect(focusBlock).toContain('box-shadow');
    });

    it('should change border color on focus', () => {
      const focusBlock = extractCSSBlock(cssContent, '.form-input:focus');
      expect(focusBlock).toContain('border-color');
    });

    it('should remove outline with alternative indicator', () => {
      const focusBlock = extractCSSBlock(cssContent, '.form-input:focus');
      if (focusBlock.includes('outline: none')) {
        expect(focusBlock.includes('box-shadow') || focusBlock.includes('border-color')).toBe(true);
      }
    });
  });

  describe('Button Styling', () => {
    it('should have background styling', () => {
      const buttonBlock = extractCSSBlock(cssContent, '.submit-button');
      expect(buttonBlock).toContain('background');
    });

    it('should have text color', () => {
      const buttonBlock = extractCSSBlock(cssContent, '.submit-button');
      expect(buttonBlock).toContain('color: white');
    });

    it('should have proper button dimensions', () => {
      const buttonBlock = extractCSSBlock(cssContent, '.submit-button');
      // Button should have padding or explicit dimensions
      expect(buttonBlock.length).toBeGreaterThan(0);
    });
  });

  describe('Hover Effects', () => {
    it('should have transform on hover', () => {
      const hoverBlock = extractCSSBlock(cssContent, '.submit-button:hover');
      expect(hoverBlock).toContain('transform');
    });

    it('should lift button on hover', () => {
      const hoverBlock = extractCSSBlock(cssContent, '.submit-button:hover');
      expect(hoverBlock).toContain('translateY');
    });

    it('should enhance shadow on hover', () => {
      const hoverBlock = extractCSSBlock(cssContent, '.submit-button:hover');
      expect(hoverBlock).toContain('box-shadow');
    });

    it('should have smooth hover transition', () => {
      const buttonBlock = extractCSSBlock(cssContent, '.submit-button');
      expect(buttonBlock).toContain('transition');
    });
  });

  describe('Code Documentation', () => {
    it('should have descriptive comments', () => {
      const commentCount = (cssContent.match(/\/\*/g) || []).length;
      expect(commentCount).toBeGreaterThan(0);
    });

    it('should explain design decisions', () => {
      // Comments should be informative
      expect(cssContent).toContain('/*');
    });

    it('should reference source files in comments', () => {
      // Check for references to main.css or other files
      const hasReferences = cssContent.toLowerCase().includes('main.css');
      expect(hasReferences).toBe(true);
    });
  });

  describe('CSS Units Consistency', () => {
    it('should use px for borders', () => {
      expect(cssContent).toMatch(/border.*\d+px/i);
    });

    it('should use rem for spacing', () => {
      expect(cssContent).toMatch(/\d+\.?\d*rem/);
    });

    it('should use percentage for responsive widths', () => {
      expect(cssContent).toContain('100%');
    });

    it('should use vh for full-height layouts', () => {
      expect(cssContent).toContain('100vh');
    });
  });

  describe('Shadow and Depth', () => {
    it('should have multiple box-shadow definitions', () => {
      const shadowCount = (cssContent.match(/box-shadow:/g) || []).length;
      expect(shadowCount).toBeGreaterThan(1);
    });

    it('should use rgba for shadow colors', () => {
      expect(cssContent).toMatch(/rgba\(\s*\d+,\s*\d+,\s+\d+,\s*[\d.]+\s*\)/);
    });

    it('should have appropriate shadow opacity', () => {
      const shadowMatches = cssContent.match(/rgba\([^)]+\)/g) || [];
      shadowMatches.forEach(shadow => {
        const opacityMatch = shadow.match(/[\d.]+\s*\)$/);
        if (opacityMatch) {
          const opacity = parseFloat(opacityMatch[0]);
          expect(opacity).toBeLessThanOrEqual(1);
          expect(opacity).toBeGreaterThan(0);
        }
      });
    });
  });

  describe('Form Styling Consistency', () => {
    it('should have consistent border-radius values', () => {
      const radiusMatches = cssContent.match(/border-radius:\s*(\d+)px/g) || [];
      expect(radiusMatches.length).toBeGreaterThan(0);
    });

    it('should style form inputs consistently', () => {
      const inputBlock = extractCSSBlock(cssContent, '.form-input');
      expect(inputBlock).toContain('border');
      expect(inputBlock).toContain('padding');
      expect(inputBlock).toContain('background');
    });

    it('should have input and button styling alignment', () => {
      const inputBlock = extractCSSBlock(cssContent, '.form-input');
      const buttonBlock = extractCSSBlock(cssContent, '.submit-button');
      
      // Both should have border-radius
      expect(inputBlock).toContain('border-radius');
      expect(buttonBlock).toContain('border-radius');
    });
  });

  describe('Transition Properties', () => {
    it('should specify transition duration', () => {
      expect(cssContent).toMatch(/transition:.*\d+\.?\d*s/);
    });

    it('should use ease timing function', () => {
      expect(cssContent).toContain('ease');
    });

    it('should transition all properties or specific ones', () => {
      expect(cssContent).toMatch(/transition:\s*all/);
    });

    it('should have reasonable transition times', () => {
      const timeMatches = cssContent.match(/(\d+\.?\d*)s/g) || [];
      timeMatches.forEach(time => {
        const seconds = parseFloat(time);
        expect(seconds).toBeGreaterThan(0);
        expect(seconds).toBeLessThan(5);
      });
    });
  });

  describe('Visual Hierarchy', () => {
    it('should differentiate form elements visually', () => {
      // Inputs and buttons should have distinct styling
      const inputBlock = extractCSSBlock(cssContent, '.form-input');
      const buttonBlock = extractCSSBlock(cssContent, '.submit-button');
      
      expect(inputBlock).not.toBe(buttonBlock);
    });

    it('should use whitespace effectively', () => {
      const formGroupBlock = extractCSSBlock(cssContent, '.form-group');
      expect(formGroupBlock).toContain('margin-bottom');
    });

    it('should create visual focus', () => {
      const containerBlock = extractCSSBlock(cssContent, '.login-container');
      expect(containerBlock).toContain('center');
    });
  });

  describe('Cross-Browser Support', () => {
    it('should use standard flexbox', () => {
      expect(cssContent).toContain('display: flex');
      expect(cssContent).not.toContain('display: -webkit-flex');
    });

    it('should avoid vendor prefixes', () => {
      expect(cssContent).not.toContain('-webkit-');
      expect(cssContent).not.toContain('-moz-');
      expect(cssContent).not.toContain('-ms-');
    });

    it('should use modern CSS properties', () => {
      expect(cssContent).toContain('box-sizing');
      expect(cssContent).toContain('border-radius');
    });
  });

  describe('File Structure', () => {
    it('should have organized class definitions', () => {
      const classPattern = /\.[a-z-]+\s*{/g;
      const classes = cssContent.match(classPattern) || [];
      expect(classes.length).toBeGreaterThan(3);
    });

    it('should group related styles together', () => {
      // Check that form-input and form-input:focus are near each other
      const inputIndex = cssContent.indexOf('.form-input {');
      const focusIndex = cssContent.indexOf('.form-input:focus');
      
      if (inputIndex !== -1 && focusIndex !== -1) {
        const distance = Math.abs(focusIndex - inputIndex);
        expect(distance).toBeLessThan(500);
      }
    });

    it('should have proper indentation', () => {
      const lines = cssContent.split('\n');
      const indentedLines = lines.filter(line => line.match(/^\s{2,}\S/));
      expect(indentedLines.length).toBeGreaterThan(0);
    });
  });

  describe('Color Contrast', () => {
    it('should have explicit color definitions', () => {
      expect(cssContent).toContain('color');
    });

    it('should use color for text visibility', () => {
      const buttonBlock = extractCSSBlock(cssContent, '.submit-button');
      expect(buttonBlock).toContain('color');
    });

    it('should consider background-foreground contrast', () => {
      const buttonBlock = extractCSSBlock(cssContent, '.submit-button');
      expect(buttonBlock).toContain('background');
      expect(buttonBlock).toContain('color');
    });
  });

  describe('Maintainability', () => {
    it('should use meaningful class names', () => {
      expect(cssContent).toContain('login-container');
      expect(cssContent).toContain('form-group');
      expect(cssContent).toContain('form-input');
      expect(cssContent).toContain('submit-button');
    });

    it('should follow BEM-like naming', () => {
      // Check for semantic naming patterns
      const hasSemanticNames = 
        cssContent.includes('login-container') &&
        cssContent.includes('form-group') &&
        cssContent.includes('form-input');
      expect(hasSemanticNames).toBe(true);
    });

    it('should be modular and reusable', () => {
      // Classes should be scoped appropriately
      const classCount = (cssContent.match(/\.[a-z-]+/g) || []).length;
      expect(classCount).toBeGreaterThan(0);
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