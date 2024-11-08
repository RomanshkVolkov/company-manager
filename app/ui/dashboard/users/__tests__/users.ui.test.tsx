import { render, screen, fireEvent } from '@testing-library/react';
import { useFormState, useFormStatus } from 'react-dom';
import EditForm from '../edit-form';
import { isClientTypeUser } from '@/app/lib/services/user.service';
import { Prisma } from '@prisma/client';

vi.mock('react-dom', async () => {
  const reactDom = await vi.importActual('react-dom');
  return {
    ...reactDom,
    useFormState: vi
      .fn()
      .mockReturnValue([{ message: '', errors: {} }, vi.fn(), true]),
    useFormStatus: vi.fn().mockReturnValue({ pending: false }),
  };
});
vi.mock('@/app/lib/actions/auth.actions', () => ({
  authenticate: vi.fn(),
}));
vi.mock('@/app/lib/services/user.service');

const mockUser = {
  id: '1',
  name: 'John Doe',
  email: 'test@example.com',
  profileID: '1',
  serviceCost: new Prisma.Decimal(1),
  isActive: true,
  otp: '123',
  otpExpireDate: new Date(),
  isCommissionApplicable: true,
  terminals: [],
};

const EditFormWithProps = () => (
  <EditForm
    profiles={[
      {
        id: '1',
        name: 'Profile 1',
      },
    ]}
    terminals={[
      {
        id: '1',
        name: 'Terminal 1',
        nameHash: 'hash',
        userID: null,
      },
    ]}
    user={mockUser}
  />
);

describe('dashboard.users.ui', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });
  describe('edit-form', () => {
    describe('happy path', () => {
      it('should submit form when user clicks on submit button', () => {
        render(<EditFormWithProps />);

        fireEvent.change(screen.getByTestId('profileID'), {
          target: { value: '1' },
        });
        fireEvent.change(screen.getByTestId('name'), {
          target: { value: 'Jhon Doe' },
        });
        fireEvent.change(screen.getByTestId('email'), {
          target: { value: 'test@example.com' },
        });

        fireEvent.click(screen.getByTestId('submit-button'));
        expect(useFormState).toHaveBeenCalled();
      });
      it('should show loading state when form is submitting', () => {
        vi.mocked(useFormStatus).mockReturnValue({ pending: true } as any);
        render(<EditFormWithProps />);

        const submitButton = screen.getByTestId('submit-button');
        fireEvent.click(submitButton);
        expect(submitButton).toHaveAttribute('aria-disabled', 'true');
      });
      it('checkbox should be checked when user is active', () => {
        render(<EditFormWithProps />);
        const inputElement = screen.getByRole('checkbox');
        expect(inputElement).toBeChecked();
      });

      it('checkbox should be unchecked when user is inactive', () => {
        render(
          <EditForm
            profiles={[
              {
                id: '1',
                name: 'Profile 1',
              },
            ]}
            terminals={[
              {
                id: '1',
                name: 'Terminal 1',
                nameHash: 'hash',
                userID: null,
              },
            ]}
            user={{ ...mockUser, isActive: false }}
          />
        );
        const inputElement = screen.getByRole('checkbox');
        expect(inputElement).not.toBeChecked();
      });

      it('should show terminals table, service cost input and commission checkbox when user is a client', () => {
        vi.mocked(isClientTypeUser).mockReturnValue(true);

        render(<EditFormWithProps />);

        expect(screen.getByTestId('terminals')).toBeInTheDocument();
        expect(screen.getByTestId('serviceCost')).toBeInTheDocument();
        expect(
          screen.getByTestId('isCommissionApplicable')
        ).toBeInTheDocument();
      });

      it('should not show terminals table when user is not a client', () => {
        vi.mocked(isClientTypeUser).mockReturnValue(false);

        render(<EditFormWithProps />);

        expect(screen.queryByTestId('terminals')).not.toBeInTheDocument();
        expect(screen.queryByTestId('serviceCost')).not.toBeInTheDocument();
        expect(
          screen.queryByTestId('isCommissionApplicable')
        ).not.toBeInTheDocument();
      });
    });

    describe('unhappy path', () => {
      it('should show error message when form submission fails', () => {
        vi.mocked(useFormState).mockReturnValue([
          {
            message: 'error',
          },
          vi.fn(),
          false,
        ]);

        render(<EditFormWithProps />);

        expect(screen.getByText('error')).toBeInTheDocument();
      });

      it('should show error message when name is empty', () => {
        vi.mocked(useFormState).mockReturnValue([
          {
            message: '',
            errors: { name: ['Por favor, ingresa un nombre'] },
          },
          vi.fn(),
          true,
        ]);

        render(<EditFormWithProps />);

        fireEvent.change(screen.getByTestId('name'), {
          target: { value: '' },
        });

        fireEvent.click(screen.getByTestId('submit-button'));
        expect(
          screen.getByText('Por favor, ingresa un nombre')
        ).toBeInTheDocument();
      });

      it('should show error message when email is empty', () => {
        vi.mocked(useFormState).mockReturnValue([
          {
            message: '',
            errors: { email: ['Por favor, ingresa un email'] },
          },
          vi.fn(),
          true,
        ]);

        render(<EditFormWithProps />);

        fireEvent.change(screen.getByTestId('email'), {
          target: { value: '' },
        });

        fireEvent.click(screen.getByTestId('submit-button'));
        expect(
          screen.getByText('Por favor, ingresa un email')
        ).toBeInTheDocument();
      });
    });
  });

  describe('terminals', () => {
    it('should show selected terminals in the table', () => {
      vi.mocked(isClientTypeUser).mockReturnValue(true);

      render(
        <EditForm
          profiles={[
            {
              id: '1',
              name: 'Profile 1',
            },
          ]}
          terminals={[
            {
              id: '1',
              name: 'Terminal 1',
              nameHash: 'hash',
              userID: '1',
            },
          ]}
          user={{
            ...mockUser,
            terminals: [
              {
                id: '1',
                name: 'Terminal 1',
                nameHash: 'hash',
                userID: '1',
              },
            ],
          }}
        />
      );

      expect(screen.getByTestId('terminal-0')).toBeInTheDocument();
    });
  });
});
