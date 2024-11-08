import { redirect } from 'next/navigation';
import bcrypt from 'bcrypt';
import prisma from '../../db/__mocks__/prisma';
import {
  checkExistingUser,
  isClientTypeUser,
  validateTerminals,
  validateUser,
  validateUserEdit,
} from '../../services/user.service';
import { createUser, editUser } from '../user.actions';

// Funcions mocks
vi.mock('../../db/prisma.ts');
vi.mock('../../services/user.service.ts');
vi.mock('next/cache');
vi.mock('next/navigation');
vi.mock('bcrypt');

// Mocks
const validatedUserMock = {
  name: 'test',
  email: 'test@test.com',
  password: 'test',
  profileID: '1',
  isActive: '1',
  isCommissionApplicable: '1',
  serviceCost: '1',
};
const validatedTerminalsMock = ['1', '2'];

describe('user.actions', () => {
  beforeEach(() => {
    vi.restoreAllMocks();
    vi.mocked(bcrypt.hashSync).mockReturnValue('test');
  });

  describe('createUser', () => {
    beforeEach(() => {
      vi.mocked(validateUser).mockReturnValue({
        errors: null,
        validatedUser: validatedUserMock,
      });
    });
    describe('happy path', () => {
      it('should create a new user when valid data is provided and redirect to dashboard', async () => {
        // Arrange
        vi.mocked(isClientTypeUser).mockReturnValue(true);
        vi.mocked(validateTerminals).mockReturnValue({
          validatedTerminals: validatedTerminalsMock,
        });
        const formData = new FormData();

        // Act<
        await createUser({}, formData);

        // Assert
        expect(prisma.user.create).toHaveBeenCalledWith({
          data: expect.objectContaining({
            ...validatedUserMock,
            createdAt: expect.any(Date), // Acepta cualquier valor de tipo Date
            password: 'test', // Valor exacto
            serviceCost: expect.any(Number), // Acepta cualquier valor de tipo Number
            isActive: true, // Valor exacto
            isCommissionApplicable: true,
            terminals: expect.objectContaining({
              connect: validatedTerminalsMock.map((id) => ({ id })),
            }),
          }),
        });
        expect(redirect).toBeCalledWith('/dashboard/settings/users');
      });

      it('should hash password before creating user', async () => {
        // Arrange
        const formData = new FormData();

        // Act
        await createUser({}, formData);

        // Assert
        expect(bcrypt.hashSync).toBeCalledWith(validatedUserMock.password, 10);
      });

      it('should validate terminals when user is a client type', async () => {
        // Arrange
        vi.mocked(isClientTypeUser).mockReturnValue(true);
        vi.mocked(validateTerminals).mockReturnValue({
          validatedTerminals: [],
        });

        const formData = new FormData();

        // Act
        await createUser({}, formData);

        // Assert
        expect(validateTerminals).toBeCalledWith([]);
      });

      it('should not validate terminals when user is not a client type', async () => {
        // Arrange
        vi.mocked(isClientTypeUser).mockReturnValue(false);
        const formData = new FormData();

        // Act
        await createUser({}, formData);

        // Assert
        expect(validateTerminals).not.toBeCalled();
      });

      it('should set isActive and commissionApplicable to false when it is not provided', async () => {
        // Arrange
        vi.mocked(validateUser).mockReturnValue({
          errors: null,
          validatedUser: {
            ...validatedUserMock,
            isActive: undefined,
            isCommissionApplicable: undefined,
          },
        });
        const formData = new FormData();

        // Act
        await createUser({}, formData);

        // Assert
        expect(prisma.user.create).toHaveBeenCalledWith({
          data: expect.objectContaining({
            ...validatedUserMock,
            createdAt: expect.any(Date),
            password: 'test',
            serviceCost: expect.any(Number),
            isActive: false,
            isCommissionApplicable: false,
            terminals: expect.objectContaining({
              connect: expect.any(Array),
            }),
          }),
        });
      });

      it('should set isActive and commissionApplicable to true when it is provided', async () => {
        // Arrange
        const formData = new FormData();

        // Act
        await createUser({}, formData);

        // Assert
        expect(prisma.user.create).toHaveBeenCalledWith({
          data: expect.objectContaining({
            ...validatedUserMock,
            createdAt: expect.any(Date),
            password: 'test',
            serviceCost: expect.any(Number),
            isActive: true,
            isCommissionApplicable: true,
            terminals: expect.objectContaining({
              connect: expect.any(Array),
            }),
          }),
        });
      });
    });

    describe('unhappy path', () => {
      it('should return an error message when user data is invalid', async () => {
        // Arrange
        vi.mocked(validateUser).mockReturnValue({
          errors: { email: ['Email inválido'] },
          validatedUser: null,
        });

        const formData = new FormData();

        // Act
        const result = await createUser({}, formData);

        // Assert
        expect(result).toEqual({
          errors: { email: ['Email inválido'] },
          message: 'Revisa los campos marcados en rojo',
        });
      });

      it('should return an error message when user already exists', async () => {
        // Arrange
        vi.mocked(checkExistingUser).mockResolvedValue({
          errors: {},
          message: 'El usuario ya existe',
        });

        const formData = new FormData();

        // Act
        const result = await createUser({}, formData);

        // Assert
        expect(result).toEqual({
          errors: {},
          message: 'El usuario ya existe',
        });
      });

      it('should return an error message when user terminals are invalid', async () => {
        // Arrange
        vi.mocked(isClientTypeUser).mockReturnValue(true);
        vi.mocked(validateTerminals).mockReturnValue({
          validatedTerminals: null,
        });
        const formData = new FormData();

        // Act
        const result = await createUser({}, formData);

        // Assert
        expect(result).toEqual({
          errors: {
            terminals: 'Por favor, selecciona al menos una terminal',
          },
          message: 'Revisa los campos marcados en rojo',
        });
      });
    });
  });

  describe('editUser', () => {
    beforeEach(() => {
      vi.mocked(validateUserEdit).mockReturnValue({
        errors: null,
        validatedUser: validatedUserMock,
      });
    });
    describe('happy path', () => {
      it('should update user when valid data is provided and redirect to dashboard', async () => {
        // Arrange
        vi.mocked(isClientTypeUser).mockReturnValue(true);
        vi.mocked(validateTerminals).mockReturnValue({
          validatedTerminals: validatedTerminalsMock,
        });
        const formData = new FormData();

        // Act
        await editUser('1', {}, formData);

        // Assert
        expect(prisma.user.update).toHaveBeenCalledWith({
          where: { id: '1' },
          data: expect.objectContaining({
            ...validatedUserMock,
            isActive: true,
            isCommissionApplicable: true,
            serviceCost: expect.any(Number),
            terminals: expect.objectContaining({
              set: validatedTerminalsMock.map((id) => ({ id })),
            }),
          }),
        });
        expect(redirect).toBeCalledWith('/dashboard/settings/users');
      });

      it('should check if user exists before updating', async () => {
        // Arrange
        const formData = new FormData();

        // Act
        await editUser('1', {}, formData);

        // Assert
        expect(checkExistingUser).toBeCalledWith(validatedUserMock.email, '1');
      });
    });
  });
});
