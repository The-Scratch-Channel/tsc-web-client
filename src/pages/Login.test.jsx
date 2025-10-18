import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import LoginPage from './Login';
import * as firebaseAuth from 'firebase/auth';

// Mock Firebase auth
vi.mock('firebase/auth', () => ({
  signInWithEmailAndPassword: vi.fn(),
}));

// Mock firebase config
vi.mock('../firebaseConfig', () => ({
  auth: {},
}));

// Mock react-router-dom navigate
const mockNavigate = vi.fn();
vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom');
  return {
    ...actual,
    useNavigate: () => mockNavigate,
  };
});

// Mock react-i18next
vi.mock('react-i18next', () => ({
  useTranslation: () => {
    return {
      t: (key) => {
        const translations = {
          'login.emailpass-error': 'Please enter both email and password.',
          'login.signin': 'Sign In',
        };
        return translations[key] || key;
      },
      i18n: { language: 'en' },
    };
  },
}));

describe('LoginPage Component', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    // Mock console methods to avoid cluttering test output
    vi.spyOn(console, 'log').mockImplementation(() => {});
    vi.spyOn(console, 'error').mockImplementation(() => {});
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  describe('Rendering', () => {
    it('should render the login form with all required elements', () => {
      render(
        <BrowserRouter>
          <LoginPage />
        </BrowserRouter>
      );

      expect(screen.getByPlaceholderText('Email')).toBeInTheDocument();
      expect(screen.getByPlaceholderText('Password')).toBeInTheDocument();
      expect(screen.getByRole('button', { name: /sign in/i })).toBeInTheDocument();
    });

    it('should render email input with correct type and attributes', () => {
      render(
        <BrowserRouter>
          <LoginPage />
        </BrowserRouter>
      );

      const emailInput = screen.getByPlaceholderText('Email');
      expect(emailInput).toHaveAttribute('type', 'email');
      expect(emailInput).toHaveClass('form-input');
    });

    it('should render password input with correct type and attributes', () => {
      render(
        <BrowserRouter>
          <LoginPage />
        </BrowserRouter>
      );

      const passwordInput = screen.getByPlaceholderText('Password');
      expect(passwordInput).toHaveAttribute('type', 'password');
      expect(passwordInput).toHaveClass('form-input');
    });

    it('should render form within login-container wrapper', () => {
      const { container } = render(
        <BrowserRouter>
          <LoginPage />
        </BrowserRouter>
      );

      const loginContainer = container.querySelector('.login-container');
      expect(loginContainer).toBeInTheDocument();
    });

    it('should render inputs within form-group divs', () => {
      const { container } = render(
        <BrowserRouter>
          <LoginPage />
        </BrowserRouter>
      );

      const formGroups = container.querySelectorAll('.form-group');
      expect(formGroups).toHaveLength(2);
    });

    it('should render submit button with correct styling class', () => {
      render(
        <BrowserRouter>
          <LoginPage />
        </BrowserRouter>
      );

      const submitButton = screen.getByRole('button', { name: /sign in/i });
      expect(submitButton).toHaveClass('submit-button');
      expect(submitButton).toHaveAttribute('type', 'submit');
    });
  });

  describe('User Interaction', () => {
    it('should update email field when user types', () => {
      render(
        <BrowserRouter>
          <LoginPage />
        </BrowserRouter>
      );

      const emailInput = screen.getByPlaceholderText('Email');
      fireEvent.change(emailInput, { target: { value: 'test@example.com' } });
      
      expect(emailInput.value).toBe('test@example.com');
    });

    it('should update password field when user types', () => {
      render(
        <BrowserRouter>
          <LoginPage />
        </BrowserRouter>
      );

      const passwordInput = screen.getByPlaceholderText('Password');
      fireEvent.change(passwordInput, { target: { value: 'password123' } });
      
      expect(passwordInput.value).toBe('password123');
    });

    it('should allow multiple character entries in email field', () => {
      render(
        <BrowserRouter>
          <LoginPage />
        </BrowserRouter>
      );

      const emailInput = screen.getByPlaceholderText('Email');
      fireEvent.change(emailInput, { target: { value: 'a' } });
      expect(emailInput.value).toBe('a');
      
      fireEvent.change(emailInput, { target: { value: 'ab' } });
      expect(emailInput.value).toBe('ab');
      
      fireEvent.change(emailInput, { target: { value: 'abc@test.com' } });
      expect(emailInput.value).toBe('abc@test.com');
    });

    it('should clear email field when value is removed', () => {
      render(
        <BrowserRouter>
          <LoginPage />
        </BrowserRouter>
      );

      const emailInput = screen.getByPlaceholderText('Email');
      fireEvent.change(emailInput, { target: { value: 'test@example.com' } });
      fireEvent.change(emailInput, { target: { value: '' } });
      
      expect(emailInput.value).toBe('');
    });
  });

  describe('Form Validation', () => {
    it('should show alert when email is empty', () => {
      const alertSpy = vi.spyOn(window, 'alert').mockImplementation(() => {});
      
      render(
        <BrowserRouter>
          <LoginPage />
        </BrowserRouter>
      );

      const passwordInput = screen.getByPlaceholderText('Password');
      fireEvent.change(passwordInput, { target: { value: 'password123' } });

      const submitButton = screen.getByRole('button', { name: /sign in/i });
      fireEvent.click(submitButton);

      expect(alertSpy).toHaveBeenCalledWith('Please enter both email and password.');
      alertSpy.mockRestore();
    });

    it('should show alert when password is empty', () => {
      const alertSpy = vi.spyOn(window, 'alert').mockImplementation(() => {});
      
      render(
        <BrowserRouter>
          <LoginPage />
        </BrowserRouter>
      );

      const emailInput = screen.getByPlaceholderText('Email');
      fireEvent.change(emailInput, { target: { value: 'test@example.com' } });

      const submitButton = screen.getByRole('button', { name: /sign in/i });
      fireEvent.click(submitButton);

      expect(alertSpy).toHaveBeenCalledWith('Please enter both email and password.');
      alertSpy.mockRestore();
    });

    it('should show alert when both fields are empty', () => {
      const alertSpy = vi.spyOn(window, 'alert').mockImplementation(() => {});
      
      render(
        <BrowserRouter>
          <LoginPage />
        </BrowserRouter>
      );

      const submitButton = screen.getByRole('button', { name: /sign in/i });
      fireEvent.click(submitButton);

      expect(alertSpy).toHaveBeenCalledWith('Please enter both email and password.');
      alertSpy.mockRestore();
    });

    it('should not call Firebase when validation fails', () => {
      vi.spyOn(window, 'alert').mockImplementation(() => {});
      
      render(
        <BrowserRouter>
          <LoginPage />
        </BrowserRouter>
      );

      const submitButton = screen.getByRole('button', { name: /sign in/i });
      fireEvent.click(submitButton);

      expect(firebaseAuth.signInWithEmailAndPassword).not.toHaveBeenCalled();
    });
  });

  describe('Successful Authentication', () => {
    it('should call signInWithEmailAndPassword with correct credentials', async () => {
      firebaseAuth.signInWithEmailAndPassword.mockResolvedValue({
        user: { uid: '123', email: 'test@example.com' }
      });

      render(
        <BrowserRouter>
          <LoginPage />
        </BrowserRouter>
      );

      const emailInput = screen.getByPlaceholderText('Email');
      const passwordInput = screen.getByPlaceholderText('Password');
      
      fireEvent.change(emailInput, { target: { value: 'test@example.com' } });
      fireEvent.change(passwordInput, { target: { value: 'password123' } });

      const submitButton = screen.getByRole('button', { name: /sign in/i });
      fireEvent.click(submitButton);

      await waitFor(() => {
        expect(firebaseAuth.signInWithEmailAndPassword).toHaveBeenCalledWith(
          {},
          'test@example.com',
          'password123'
        );
      });
    });

    it('should navigate to home page after successful login', async () => {
      firebaseAuth.signInWithEmailAndPassword.mockResolvedValue({
        user: { uid: '123', email: 'test@example.com' }
      });

      render(
        <BrowserRouter>
          <LoginPage />
        </BrowserRouter>
      );

      const emailInput = screen.getByPlaceholderText('Email');
      const passwordInput = screen.getByPlaceholderText('Password');
      
      fireEvent.change(emailInput, { target: { value: 'test@example.com' } });
      fireEvent.change(passwordInput, { target: { value: 'password123' } });

      const submitButton = screen.getByRole('button', { name: /sign in/i });
      fireEvent.click(submitButton);

      await waitFor(() => {
        expect(mockNavigate).toHaveBeenCalledWith('/');
      });
    });

    it('should log success message on successful sign in', async () => {
      firebaseAuth.signInWithEmailAndPassword.mockResolvedValue({
        user: { uid: '123', email: 'test@example.com' }
      });

      const consoleLogSpy = vi.spyOn(console, 'log');

      render(
        <BrowserRouter>
          <LoginPage />
        </BrowserRouter>
      );

      const emailInput = screen.getByPlaceholderText('Email');
      const passwordInput = screen.getByPlaceholderText('Password');
      
      fireEvent.change(emailInput, { target: { value: 'test@example.com' } });
      fireEvent.change(passwordInput, { target: { value: 'password123' } });

      const submitButton = screen.getByRole('button', { name: /sign in/i });
      fireEvent.click(submitButton);

      await waitFor(() => {
        expect(consoleLogSpy).toHaveBeenCalledWith(
          expect.stringContaining('User test@example.com signed in successfully')
        );
      });
    });
  });

  describe('Authentication Errors', () => {
    it('should show alert with error message on authentication failure', async () => {
      const alertSpy = vi.spyOn(window, 'alert').mockImplementation(() => {});
      firebaseAuth.signInWithEmailAndPassword.mockRejectedValue({
        message: 'Invalid credentials'
      });

      render(
        <BrowserRouter>
          <LoginPage />
        </BrowserRouter>
      );

      const emailInput = screen.getByPlaceholderText('Email');
      const passwordInput = screen.getByPlaceholderText('Password');
      
      fireEvent.change(emailInput, { target: { value: 'test@example.com' } });
      fireEvent.change(passwordInput, { target: { value: 'wrongpassword' } });

      const submitButton = screen.getByRole('button', { name: /sign in/i });
      fireEvent.click(submitButton);

      await waitFor(() => {
        expect(alertSpy).toHaveBeenCalledWith('Error signing in: Invalid credentials');
      });

      alertSpy.mockRestore();
    });

    it('should log error on authentication failure', async () => {
      const consoleErrorSpy = vi.spyOn(console, 'error');
      firebaseAuth.signInWithEmailAndPassword.mockRejectedValue({
        message: 'Invalid credentials'
      });

      render(
        <BrowserRouter>
          <LoginPage />
        </BrowserRouter>
      );

      const emailInput = screen.getByPlaceholderText('Email');
      const passwordInput = screen.getByPlaceholderText('Password');
      
      fireEvent.change(emailInput, { target: { value: 'test@example.com' } });
      fireEvent.change(passwordInput, { target: { value: 'wrongpassword' } });

      const submitButton = screen.getByRole('button', { name: /sign in/i });
      fireEvent.click(submitButton);

      await waitFor(() => {
        expect(consoleErrorSpy).toHaveBeenCalledWith(
          'Error signing in',
          'Invalid credentials'
        );
      });
    });

    it('should not navigate on authentication failure', async () => {
      vi.spyOn(window, 'alert').mockImplementation(() => {});
      firebaseAuth.signInWithEmailAndPassword.mockRejectedValue({
        message: 'Invalid credentials'
      });

      render(
        <BrowserRouter>
          <LoginPage />
        </BrowserRouter>
      );

      const emailInput = screen.getByPlaceholderText('Email');
      const passwordInput = screen.getByPlaceholderText('Password');
      
      fireEvent.change(emailInput, { target: { value: 'test@example.com' } });
      fireEvent.change(passwordInput, { target: { value: 'wrongpassword' } });

      const submitButton = screen.getByRole('button', { name: /sign in/i });
      fireEvent.click(submitButton);

      await waitFor(() => {
        expect(firebaseAuth.signInWithEmailAndPassword).toHaveBeenCalled();
      });

      expect(mockNavigate).not.toHaveBeenCalled();
    });

    it('should handle network errors gracefully', async () => {
      const alertSpy = vi.spyOn(window, 'alert').mockImplementation(() => {});
      firebaseAuth.signInWithEmailAndPassword.mockRejectedValue({
        message: 'Network error'
      });

      render(
        <BrowserRouter>
          <LoginPage />
        </BrowserRouter>
      );

      const emailInput = screen.getByPlaceholderText('Email');
      const passwordInput = screen.getByPlaceholderText('Password');
      
      fireEvent.change(emailInput, { target: { value: 'test@example.com' } });
      fireEvent.change(passwordInput, { target: { value: 'password123' } });

      const submitButton = screen.getByRole('button', { name: /sign in/i });
      fireEvent.click(submitButton);

      await waitFor(() => {
        expect(alertSpy).toHaveBeenCalledWith('Error signing in: Network error');
      });

      alertSpy.mockRestore();
    });
  });

  describe('Edge Cases', () => {
    it('should handle form submission with whitespace-only email', () => {
      const alertSpy = vi.spyOn(window, 'alert').mockImplementation(() => {});
      
      render(
        <BrowserRouter>
          <LoginPage />
        </BrowserRouter>
      );

      const emailInput = screen.getByPlaceholderText('Email');
      const passwordInput = screen.getByPlaceholderText('Password');
      
      fireEvent.change(emailInput, { target: { value: '   ' } });
      fireEvent.change(passwordInput, { target: { value: 'password123' } });

      const submitButton = screen.getByRole('button', { name: /sign in/i });
      fireEvent.click(submitButton);

      // Component treats whitespace as valid input, but we verify it attempts sign in
      expect(firebaseAuth.signInWithEmailAndPassword).toHaveBeenCalled();
      alertSpy.mockRestore();
    });

    it('should handle special characters in email', async () => {
      firebaseAuth.signInWithEmailAndPassword.mockResolvedValue({
        user: { uid: '123', email: 'test+tag@example.com' }
      });

      render(
        <BrowserRouter>
          <LoginPage />
        </BrowserRouter>
      );

      const emailInput = screen.getByPlaceholderText('Email');
      const passwordInput = screen.getByPlaceholderText('Password');
      
      fireEvent.change(emailInput, { target: { value: 'test+tag@example.com' } });
      fireEvent.change(passwordInput, { target: { value: 'password123' } });

      const submitButton = screen.getByRole('button', { name: /sign in/i });
      fireEvent.click(submitButton);

      await waitFor(() => {
        expect(firebaseAuth.signInWithEmailAndPassword).toHaveBeenCalledWith(
          {},
          'test+tag@example.com',
          'password123'
        );
      });
    });

    it('should handle very long password', async () => {
      const longPassword = 'a'.repeat(1000);
      firebaseAuth.signInWithEmailAndPassword.mockResolvedValue({
        user: { uid: '123', email: 'test@example.com' }
      });

      render(
        <BrowserRouter>
          <LoginPage />
        </BrowserRouter>
      );

      const emailInput = screen.getByPlaceholderText('Email');
      const passwordInput = screen.getByPlaceholderText('Password');
      
      fireEvent.change(emailInput, { target: { value: 'test@example.com' } });
      fireEvent.change(passwordInput, { target: { value: longPassword } });

      const submitButton = screen.getByRole('button', { name: /sign in/i });
      fireEvent.click(submitButton);

      await waitFor(() => {
        expect(firebaseAuth.signInWithEmailAndPassword).toHaveBeenCalledWith(
          {},
          'test@example.com',
          longPassword
        );
      });
    });

    it('should handle rapid consecutive form submissions', async () => {
      firebaseAuth.signInWithEmailAndPassword.mockResolvedValue({
        user: { uid: '123', email: 'test@example.com' }
      });

      render(
        <BrowserRouter>
          <LoginPage />
        </BrowserRouter>
      );

      const emailInput = screen.getByPlaceholderText('Email');
      const passwordInput = screen.getByPlaceholderText('Password');
      
      fireEvent.change(emailInput, { target: { value: 'test@example.com' } });
      fireEvent.change(passwordInput, { target: { value: 'password123' } });

      const submitButton = screen.getByRole('button', { name: /sign in/i });
      
      // Rapidly submit multiple times
      fireEvent.click(submitButton);
      fireEvent.click(submitButton);
      fireEvent.click(submitButton);

      await waitFor(() => {
        expect(firebaseAuth.signInWithEmailAndPassword).toHaveBeenCalled();
      });

      // Should be called multiple times (no debouncing in current implementation)
      expect(firebaseAuth.signInWithEmailAndPassword.mock.calls.length).toBeGreaterThan(1);
    });

    it('should handle Enter key submission', async () => {
      firebaseAuth.signInWithEmailAndPassword.mockResolvedValue({
        user: { uid: '123', email: 'test@example.com' }
      });

      render(
        <BrowserRouter>
          <LoginPage />
        </BrowserRouter>
      );

      const emailInput = screen.getByPlaceholderText('Email');
      const passwordInput = screen.getByPlaceholderText('Password');
      
      fireEvent.change(emailInput, { target: { value: 'test@example.com' } });
      fireEvent.change(passwordInput, { target: { value: 'password123' } });

      // Submit by pressing Enter in the form
      const form = screen.getByRole('button').closest('form');
      fireEvent.submit(form);

      await waitFor(() => {
        expect(firebaseAuth.signInWithEmailAndPassword).toHaveBeenCalledWith(
          {},
          'test@example.com',
          'password123'
        );
      });
    });
  });

  describe('Accessibility', () => {
    it('should have proper form structure', () => {
      render(
        <BrowserRouter>
          <LoginPage />
        </BrowserRouter>
      );

      const form = screen.getByRole('button').closest('form');
      expect(form).toBeInTheDocument();
    });

    it('should have accessible button with text content', () => {
      render(
        <BrowserRouter>
          <LoginPage />
        </BrowserRouter>
      );

      const button = screen.getByRole('button', { name: /sign in/i });
      expect(button).toBeInTheDocument();
      expect(button).toHaveTextContent('Sign In');
    });

    it('should have inputs with placeholder text for accessibility', () => {
      render(
        <BrowserRouter>
          <LoginPage />
        </BrowserRouter>
      );

      expect(screen.getByPlaceholderText('Email')).toBeInTheDocument();
      expect(screen.getByPlaceholderText('Password')).toBeInTheDocument();
    });
  });

  describe('Internationalization', () => {
    it('should use translation for error message', () => {
      const alertSpy = vi.spyOn(window, 'alert').mockImplementation(() => {});
      
      render(
        <BrowserRouter>
          <LoginPage />
        </BrowserRouter>
      );

      const submitButton = screen.getByRole('button', { name: /sign in/i });
      fireEvent.click(submitButton);

      // Should use the translated message
      expect(alertSpy).toHaveBeenCalledWith('Please enter both email and password.');
      alertSpy.mockRestore();
    });

    it('should use translation for sign in button', () => {
      render(
        <BrowserRouter>
          <LoginPage />
        </BrowserRouter>
      );

      const button = screen.getByRole('button', { name: /sign in/i });
      expect(button).toHaveTextContent('Sign In');
    });
  });
});