import { render, screen, fireEvent } from '@testing-library/react';
import Form from '../form';
import { useFormState, useFormStatus } from 'react-dom';

vi.mock('react-dom', async () => {
  const reactDom = await vi.importActual('react-dom');
  return {
    ...reactDom,
    useFormState: vi.fn().mockReturnValue([undefined, vi.fn(), true]),
    useFormStatus: vi.fn().mockReturnValue({ pending: false }),
  };
});
vi.mock('@/app/lib/actions/auth.actions', () => ({
  authenticate: vi.fn(),
}));

describe('login.ui', () => {
  describe('form', () => {
    describe('happy path', () => {
      it('should submit form when user clicks on submit button', () => {
        render(<Form />);

        fireEvent.change(screen.getByTestId('email-field'), {
          target: { value: 'test@example.com' },
        });
        fireEvent.change(screen.getByTestId('password-field'), {
          target: { value: 'password123' },
        });

        fireEvent.click(screen.getByTestId('submit-button'));
        expect(useFormState).toHaveBeenCalled();
      });
      it('should toggle password visibility when button is clicked', () => {
        render(<Form />);

        const passwordField = screen.getByTestId('password-field');
        const toggleButton = screen.getByTestId('toggle-password');

        expect(passwordField).toHaveAttribute('type', 'password');
        fireEvent.click(toggleButton);
        expect(passwordField).toHaveAttribute('type', 'text');
        fireEvent.click(toggleButton);
        expect(passwordField).toHaveAttribute('type', 'password');
      });
      it('should show loading state when form is submitting', () => {
        vi.mocked(useFormStatus).mockReturnValue({ pending: true } as any);
        render(<Form />);

        const submitButton = screen.getByTestId('submit-button');
        fireEvent.click(submitButton);
        expect(submitButton).toHaveAttribute('aria-disabled', 'true');
      });
    });

    describe('unhappy path', () => {
      it('should show error message when form submission fails', () => {
        vi.mocked(useFormState).mockReturnValue(['error', vi.fn(), false]);

        render(<Form />);

        expect(screen.getByText('error')).toBeInTheDocument();
      });
    });
  });
});
