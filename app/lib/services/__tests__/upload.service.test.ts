// import * as fs from 'fs';
// import * as path from 'path';
// import { expect, vi, describe, it, beforeEach } from 'vitest';
// import { mockTransaction } from '../__mocks__/transaction';
// import { txtToHash } from '@/app/lib/utils';
// import { processFile } from '../upload.service';
// import { auth } from '@/auth';

// vi.mock('../../db/prisma.ts');
// vi.mock('@/auth', () => ({
//   auth: vi.fn(),
// }));
// vi.mock('../../utils.ts', async () => {
//   const utils = await vi.importActual('../../utils.ts');
//   return {
//     ...utils,
//     fileToHash: vi.fn(),
//     uint8ToShortHash: vi.fn(),
//     txtToHash: vi.fn(),
//   };
// });
// describe('upload.service', () => {
//   beforeEach(() => {
//     vi.restoreAllMocks();
//     vi.mocked(txtToHash).mockReturnValue('hash');
//     prisma.upload.create.mockResolvedValue({ id: '1' } as any);
//     prisma.terminal.findMany.mockResolvedValue([
//       { id: '1', name: '2502', nameHash: 'hash', userID: '1' },
//     ]);
//     vi.mocked(auth).mockResolvedValue({ user: { id: 1 } } as any);
//   });

//   describe('processFile', () => {
//     let file: File;
//     describe('happy path', () => {
//       beforeEach(() => {
//         prisma.cardType.findMany.mockResolvedValue([
//           { id: '1', name: 'VISA------' },
//           { id: '2', name: 'MASTERCARD' },
//           { id: '3', name: 'Sin especificar' },
//           { id: '3', name: 'CARNET' },
//         ]);

//         const csvPath = path.resolve(
//           __dirname,
//           '../../../../public/test/upload-files/test.csv'
//         );
//         const fileBuffer = fs.readFileSync(csvPath);
//         file = new File([fileBuffer], 'mockFile.csv', {
//           type: 'text/csv',
//         });
//         file.text = vi.fn().mockResolvedValue(fileBuffer.toString());
//       });
//       it('should create transactions on database', async () => {
//         await processFile(file, 'test', 'test');
//         expect(prisma.transaction.createMany).toHaveBeenCalledWith({
//           data: mockTransaction.map(({ pan, ...rest }) => ({
//             ...rest,
//             uploadID: '1',
//             terminalID: '1',
//             lastPanDigits: pan,
//           })),
//           skipDuplicates: true,
//         });
//       });

//       it('should create upload on database', async () => {
//         await processFile(file, 'test', 'test');
//         expect(prisma.upload.create).toHaveBeenCalled();
//       });
//     });
//     describe('unhappy path', () => {
//       it('should throw an error when file is empty', async () => {
//         const emptyFile = new File([''], 'empty.csv', { type: 'text/csv' });
//         emptyFile.text = vi.fn().mockResolvedValue('');
//         await expect(processFile(emptyFile, 'test', 'test')).rejects.toThrow(
//           'No se encontraron datos en el archivo'
//         );
//       });

//       it('should throw an error when file is not a CSV', async () => {
//         const file = new File(['test'], 'test.txt', { type: 'text/plain' });
//         await expect(processFile(file, 'test', 'test')).rejects.toThrow(
//           'El archivo debe ser de tipo CSV'
//         );
//       });
//       it('shold throw an error when file is missing properties', async () => {
//         const csvPath = path.resolve(
//           __dirname,
//           '../../../../public/test/upload-files/missing-properties.csv'
//         );
//         const fileBuffer = fs.readFileSync(csvPath);
//         const file = new File([fileBuffer], 'missing-properties.csv', {
//           type: 'text/csv',
//         });
//         file.text = vi.fn().mockResolvedValue(fileBuffer.toString());
//         await expect(processFile(file, 'test', 'test')).rejects.toThrow(
//           'El archivo no contiene las siguientes propiedades'
//         );
//       });
//     });
//   });
// });
