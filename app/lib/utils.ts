import * as Sentry from '@sentry/nextjs';
import { blake2b } from 'blakejs';

import {
  ROOT_USER_TYPE_UUID,
  ADMIN_USER_TYPE_UUID,
  CLIENT_USER_TYPE_UUID,
  EMPLOYEE_USER_TYPE_UUID,
  CELL_MAX_LENGTH,
} from './consts';
import { APIResponse, DateInput } from '../types/types';
import { Session } from 'next-auth';
import { ZodSchema } from 'zod';

export const reportErrorToSentry = (error: unknown, context: string) => {
  if (process.env.NODE_ENV === 'development') {
    console.error(error);
  } else if (process.env.NODE_ENV === 'production') {
    Sentry.captureException(error, {
      tags: {
        errorContext: context,
      },
    });
  }
};

export const attachFileToSentry = async (file: File, error: unknown) => {
  if (process.env.NODE_ENV === 'development') {
    console.error(error);
  } else if (process.env.NODE_ENV === 'production') {
    if (file.size > 1024 * 1024) {
      return;
    }
    const content = await file.text();
    Sentry.withScope((scope) => {
      scope.addAttachment({
        filename: file.name,
        data: content,
      });
      Sentry.captureException(error);
    });
  }
};

export const serializedMaxLenghtCell = (value: string) =>
  value.substring(0, CELL_MAX_LENGTH);

export function hasItems(array: any[] | undefined): boolean {
  try {
    return array && array.length > 0 ? true : false;
  } catch {
    return false;
  }
}

export function handleDatabaseError(error: unknown, message: string) {
  if (error instanceof Error) {
    console.error(error.message);
  } else {
    console.error(error);
  }
  return {
    errors: {},
    message,
  };
}

export const txtToHash = (txt: string) => {
  const buffer = new TextEncoder().encode(txt);
  const hashBytes = blake2b(buffer, undefined, 32).join('');
  return hashBytes;
};

export const txtToSixDigitHash = (txt: string) => {
  const hash = txtToHash(txt);
  return hash.substring(0, 6);
};

export const fileToHash = async (file: File) => {
  const buffer = await file.arrayBuffer();
  return blake2b(new Uint8Array(buffer), undefined, 32);
};

export const uint8ToShortHash = (uint: Uint8Array): string =>
  uint.reduce((str, byte) => str + byte.toString(16).padStart(2, '0'), '');

export const fileToShortHash = async (file: File): Promise<string> => {
  const hash = await fileToHash(file);
  return hash.reduce(
    (str, byte) => str + byte.toString(16).padStart(2, '0'),
    ''
  );
};

export const currencyFormat = (value: number) =>
  new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  }).format(value);

export const getCurrentUTCTime = (zt: number | null = null): Date => {
  const d = new Date(Math.floor(new Date().getTime() / 1000) * 1000);
  if (zt) {
    d.setHours(d.getHours() + zt);
  }
  return d;
};

export const formatDateUTCToClientTime = (
  d: Date,
  includeTime: boolean = true
) => {
  const zt = Intl.DateTimeFormat().resolvedOptions().timeZone;
  const date = includeTime
    ? d.toLocaleString('es-MX', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        timeZone: zt,
      })
    : d.toLocaleString('es-MX', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
        timeZone: zt,
      });
  return date;
};

export const getCurrentTimeClient = () => {
  const date = getCurrentUTCTime();
  return formatDateUTCToClientTime(date);
};

export const validateRole = {
  root: (id: number) => id === ROOT_USER_TYPE_UUID,
  admin: (id: number) => id === ADMIN_USER_TYPE_UUID,
  client: (id: string) => id === CLIENT_USER_TYPE_UUID,
  employee: (id: string) => id === EMPLOYEE_USER_TYPE_UUID,
};

export const serializedDateFilter = (
  dateFrom: DateInput,
  dateTo: DateInput
) => {
  const isValidFrom = dateFrom && !isNaN(new Date(dateFrom).getTime());
  const isValidTo = dateTo && !isNaN(new Date(dateTo).getTime());

  const gte = isValidFrom
    ? new Date(dateFrom).toISOString()
    : getCurrentUTCTime(-168).toISOString();

  const lte = isValidTo
    ? new Date(dateTo).toISOString()
    : getCurrentUTCTime().toISOString();

  return {
    gte,
    lte,
  };
};

// construc the search param for prisma
// where: {
//  <colSearchKey>: {
//    search: 'cat',
//  },
//},

export const serializeSearchParam = <T extends string>(
  query: string,
  colsSearch: T[]
): any =>
  !query || query === ''
    ? ({} as any)
    : {
        OR: colsSearch.map((col) => ({
          [col]: {
            contains: query,
            mode: 'insensitive',
          },
        })),
      };

export const serializeSearchParamRecursive = (
  _query: string,
  _colsSearch: string[]
): any => {
  // const
};

export const extractLastPanDigits = (pan: string) => {
  if (pan.length === 4) {
    return +pan;
  }
  return +pan.slice(-4);
};

export const parseDateZT = (date: string) => {
  const d = new Date(date);
  const tz = Intl.DateTimeFormat().resolvedOptions().timeZone;
  const zdt = d.toLocaleString('es-MX', {
    timeZone: tz,
    timeZoneName: 'short',
  });
  return new Date(zdt).toISOString();
};

export const validateSession = (session: Session | null) => {
  if (!session?.user?.id) {
    throw new Error('Usuario inválido');
  }
};

const formatDateByTZ = (tz: string) =>
  new Intl.DateTimeFormat('es-MX', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    timeZoneName: 'short',
    timeZone: tz,
  });

export const normalizeDate = (date: string) => {
  const utc = new Date(date);
  const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone;

  const formatter = formatDateByTZ(timezone);
  return formatter.format(utc);
};

export const getMonthNameShort = (date: Date) =>
  new Intl.DateTimeFormat('es-MX', {
    month: 'short',
    day: 'numeric',
    timeZone: 'UTC',
  }).format(date);

export const formatDateWithTime = (date: Date): string =>
  new Intl.DateTimeFormat('en-CA', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    timeZone: 'America/Cancun',
  }).format(date);

export const formatDate = (date: Date) =>
  new Intl.DateTimeFormat('es-MX', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    timeZone: 'UTC',
  }).format(date);

export const formatToLegibleDate = (date: Date) =>
  new Intl.DateTimeFormat('es-MX', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
    timeZone: 'UTC',
  }).format(date);

export const formatToPrice = (price: number): string =>
  new Intl.NumberFormat('en-MX', {
    style: 'currency',
    currency: 'MXN',
  })
    .format(price)
    .replace('MX', '');

export const normalizePathnameByLevel = (pathname: string, level: number) => {
  const splitPathname = pathname.split('/');
  splitPathname.shift();
  return `/${splitPathname.slice(0, level).join('/')}`;
};

export const validatedRequest = <T>(
  response: APIResponse<T>,
  defaultValue: T
) => {
  if (!response?.success || !response?.data) {
    if (process.env.NODE_ENV === 'development') {
      console.info(response);
    }
    response.data = defaultValue;
  }
  return response;
};

// filters and paginated data
const paginatedFunction = (data: any[], page: number, limit: number) =>
  data.slice((page - 1) * limit, page * limit);

export const searchByText = (data: any[], search: string) => {
  const txt = search.toLowerCase();

  return data.filter((item) => {
    const values = Object.values(item);
    return values.some((value) => {
      const txtValue = String(value).toLowerCase();
      return txtValue.includes(txt);
    });
  });
};

export const serializedPageData = <T>(
  data: T[],
  page: number,
  limit: number
) => {
  if (Array.isArray(data)) {
    return paginatedFunction(data, page, limit);
  }
  return [];
};

// end filters and paginated data

export const conditionalParse = <T, U>(
  value: T | undefined,
  parseFn: (_val: T) => U
): U | T => {
  try {
    return value !== undefined ? parseFn(value) : (value as U);
  } catch {
    return value as U;
  }
};

export const debugError = (e: unknown) => {
  if (process.env.NODE_ENV === 'development') {
    console.error(e);
  }
};

export const validatedSchema = (
  formData: {
    [key: string]: FormDataEntryValue;
  },
  schema: ZodSchema
) => {
  const validatedSchema = schema.safeParse(formData);

  if (!validatedSchema.success) {
    return { errors: validatedSchema.error.flatten().fieldErrors };
  }
  return { errors: null, data: validatedSchema.data };
};

export function serializedPathname(pathname: string, params: any) {
  const keys = Object.keys(params);
  let serializedPath = pathname;
  keys.forEach((key) => {
    serializedPath = serializedPath.replace(
      `:${key}`,
      String(params[key as any])
    );
  });
  return serializedPath;
}
