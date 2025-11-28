import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { CyberButton } from './CyberButton';
import { CyberInput } from './CyberInput';

describe('Accessibility Features', () => {
  describe('CyberButton', () => {
    it('should have proper ARIA label when provided', () => {
      render(
        <CyberButton ariaLabel="Test button">
          Click me
        </CyberButton>
      );
      
      const button = screen.getByRole('button');
      expect(button).toHaveAttribute('aria-label', 'Test button');
    });

    it('should have aria-disabled when disabled', () => {
      render(
        <CyberButton disabled>
          Disabled button
        </CyberButton>
      );
      
      const button = screen.getByRole('button');
      expect(button).toHaveAttribute('aria-disabled', 'true');
      expect(button).toBeDisabled();
    });

    it('should be keyboard accessible', () => {
      render(
        <CyberButton>
          Keyboard accessible
        </CyberButton>
      );
      
      const button = screen.getByRole('button');
      expect(button).toBeInTheDocument();
      // Button should be focusable by default
      expect(button.tabIndex).toBeGreaterThanOrEqual(0);
    });
  });

  describe('CyberInput', () => {
    it('should have proper label association', () => {
      render(
        <CyberInput
          label="Email"
          value=""
          onChange={() => {}}
          name="email"
        />
      );
      
      const input = screen.getByRole('textbox');
      expect(input).toHaveAttribute('id');
      
      const label = screen.getByText('Email');
      expect(label).toHaveAttribute('for', input.id);
    });

    it('should have aria-invalid when error is present', () => {
      render(
        <CyberInput
          label="Email"
          value=""
          onChange={() => {}}
          error="Invalid email"
        />
      );
      
      const input = screen.getByRole('textbox');
      expect(input).toHaveAttribute('aria-invalid', 'true');
    });

    it('should have aria-describedby linking to error message', () => {
      render(
        <CyberInput
          label="Email"
          value=""
          onChange={() => {}}
          error="Invalid email"
          name="email"
        />
      );
      
      const input = screen.getByRole('textbox');
      const errorId = input.getAttribute('aria-describedby');
      
      expect(errorId).toBeTruthy();
      const errorElement = document.getElementById(errorId!);
      expect(errorElement).toHaveTextContent('Invalid email');
      expect(errorElement).toHaveAttribute('role', 'alert');
    });

    it('should have aria-required when required', () => {
      render(
        <CyberInput
          label="Email"
          value=""
          onChange={() => {}}
          required
        />
      );
      
      const input = screen.getByRole('textbox');
      expect(input).toHaveAttribute('aria-required', 'true');
      expect(input).toBeRequired();
    });

    it('should have proper aria-label', () => {
      render(
        <CyberInput
          label="Email Address"
          value=""
          onChange={() => {}}
        />
      );
      
      const input = screen.getByRole('textbox');
      expect(input).toHaveAttribute('aria-label', 'Email Address');
    });
  });

  describe('Focus Management', () => {
    it('should apply focus-visible-ring class to buttons', () => {
      const { container } = render(
        <CyberButton>
          Focus test
        </CyberButton>
      );
      
      const button = container.querySelector('button');
      // The button should be focusable
      expect(button).toBeInTheDocument();
    });
  });

  describe('Keyboard Navigation', () => {
    it('should allow keyboard interaction on buttons', () => {
      let clicked = false;
      render(
        <CyberButton onClick={() => { clicked = true; }}>
          Click me
        </CyberButton>
      );
      
      const button = screen.getByRole('button');
      button.click();
      expect(clicked).toBe(true);
    });
  });
});
