import { uploadTransactions } from '../upload.actions';
import { processFile } from '../../services/upload.service';
import { auth } from '@/auth';

vi.mock('../../db/prisma.ts');
// We assign its value in the before each
vi.mock('@/auth', () => ({
  auth: vi.fn(),
}));
vi.mock('../../services/upload.service');

describe('upload.actions', () => {
  beforeEach(() => {
    vi.restoreAllMocks();
    // vi.mock is hoisted to the top of the file, so we need to mock the value here, otherwise restoreAllMocks will remove it
    vi.mocked(auth).mockResolvedValue({ user: { id: 1 } } as any);
  });

  describe('uploadTransactions', () => {
    let formData: {
      data: Record<string, any[]>;
      getAll: (_key: string | number) => any[];
      get: (_key: string | number) => any;
    };

    beforeEach(() => {
      // Used to simulate FormData object, since FormData is only available in browser
      formData = {
        data: {
          // eslint-disable-next-line camelcase
          file_input_transaction: [
            {
              name: 'file.csv',
              size: 1000,
              text: () => 'testing',
            },
          ],
          comments: ['Test comments'],
        },
        getAll(key: string | number) {
          return this.data[key] || [];
        },
        get(key: string | number) {
          return this.data[key] ? this.data[key][0] : null;
        },
      };
    });
    describe('happy path', () => {
      it('should return an object with done as true and success message when upload completes', async () => {
        const result = await uploadTransactions(
          {},
          formData as unknown as FormData
        );

        expect(result.done).toBe(true);
        expect(result.message).toBe('Los datos se han cargado correctamente');
      });
      it('should process multiple files without errors', async () => {
        formData.data.file_input_transaction.push({
          name: 'file2.csv',
          size: 2000,
          text: () => 'testing',
        });

        const result = await uploadTransactions(
          {},
          formData as unknown as FormData
        );

        expect(processFile).toHaveBeenCalledTimes(2);
        expect(result.message).toBe('Los datos se han cargado correctamente');
      });
      it('should pass each file, comments and user id to processFile service', async () => {
        await uploadTransactions({}, formData as unknown as FormData);
        expect(processFile).toHaveBeenCalledTimes(1);
        expect(processFile).toHaveBeenCalledWith(
          {
            name: 'file.csv',
            size: 1000,
            text: expect.any(Function),
          },
          'Test comments',
          1
        );
      });
    });
    describe('unhappy path', () => {
      it('should return an error message if file is not sent in formData', async () => {
        const result = await uploadTransactions({}, new FormData());

        expect(result.message).toBe('Por favor cargue un archivo');
      });
      it('should return an error message if file is empty', async () => {
        formData.data.file_input_transaction[0].size = 0;
        const result = await uploadTransactions(
          {},
          formData as unknown as FormData
        );

        expect(result.message).toBe('Por favor cargue un archivo');
      });
      it('should return an error message if an instance of Error is thrown', async () => {
        vi.mocked(auth).mockRejectedValue(new Error('Something went wrong'));

        const result = await uploadTransactions(
          {},
          formData as unknown as FormData
        );

        expect(result.message).toBe('Something went wrong');
      });
    });
  });
});
