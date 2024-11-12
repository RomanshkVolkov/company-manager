// import prisma from '../../db/__mocks__/prisma';
// import { checkExistingUser } from '../user.service';

// vi.mock('../../db/prisma.ts');

// const emailMock = 'test@example.com';

// describe('user.service', () => {
//   beforeEach(() => {
//     vi.restoreAllMocks();
//   });
//   describe('checkExistingUser', () => {
//     describe('happy path', () => {
//       it('should exclude the user from the search if the userID is provided', async () => {
//         // Arrange
//         const userID = '123';

//         // Act
//         await checkExistingUser(emailMock, userID);

//         // Assert
//         expect(prisma.user.findUnique).toBeCalledWith({
//           where: {
//             email: emailMock,
//             NOT: {
//               id: userID,
//             },
//           },
//         });
//       });
//     });
//     describe('unhappy path', () => {
//       it('should return an error message if the user exists', async () => {
//         // Arrange
//         prisma.user.findUnique.mockResolvedValue({ email: emailMock } as any);

//         const result = await checkExistingUser(emailMock);

//         expect(result).toEqual({
//           errors: { email: ['Este correo ya está registrado'] },
//           message: 'Revisa los campos marcados en rojo',
//         });
//       });
//     });
//   });
// });
