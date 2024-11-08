import {
  currencyFormat,
  formatDate,
  serializedDateFilter,
  serializeSearchParam,
  validateSession,
} from '../utils';
import { auth } from '@/auth';
import { CLIENT_USER_TYPE_UUID, DEFAULT_PAGINATION_LIMIT } from '../consts';

export async function getTransactions(
  page: number = 1,
  query?: string,
  from?: string,
  to?: string,
  isExport?: boolean
) {
  const session = await auth();
  validateSession(session);

  // pagination
  const take = isExport ? 500 : DEFAULT_PAGINATION_LIMIT;
  const skip = (page - 1) * take;

  // filters
  const data = [];
  const totalItems = 0;

  return {
    data,
    totalItems,
  };
}
