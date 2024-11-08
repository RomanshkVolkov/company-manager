import resetDB from './reset-db';
import { beforeEach } from 'vitest';

beforeEach(async () => {
  await resetDB();
});
