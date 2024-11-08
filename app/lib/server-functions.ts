'use server';

import { auth } from '@/auth';
import { pagePermissions, url } from './consts';
import { APIResponse } from '../types/types';
import { reportErrorToSentry } from './utils';

export const authorizations = async (pathname: string) => {
  const session = await auth();
  const profile = session?.user?.profile.slug;
  const authorized = pagePermissions[profile as keyof typeof pagePermissions];
  const isWritable =
    typeof authorized === 'boolean'
      ? authorized
      : authorized.find((p) => p?.route === pathname)?.w || false;
  return { authorized, isWritable };
};

export async function apiRequest<T>(
  pathname: string,
  method: 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE',
  bearer?: boolean,
  data?: unknown,
  revalidate?: number
) {
  const reqData: RequestInit & NextFetchRequestConfig = {
    method,
    body: data ? JSON.stringify(data) : undefined,
    headers: {
      'Content-Type': 'application/json',
    } as HeadersInit,
    revalidate: revalidate ? revalidate : false,
  };

  if (bearer) {
    const session = await auth();
    reqData.headers = {
      ...reqData.headers,
      Authorization: `Bearer ${session?.user.token}`,
    };
  }

  try {
    const res = await fetch(`${url.api}${pathname}`, {
      ...reqData,
    }).then((response) => response.json() as any as APIResponse<T>);

    if (process.env.NODE_ENV === 'development') {
      console.info(pathname);
      console.info(reqData);
      if (Array.isArray(res.data)) {
        const { data, ...rest } = res;
        console.info(rest);
        console.table(data);
      } else console.info(res);
    }

    return res;
  } catch (error) {
    console.error(error);
    reportErrorToSentry(error, 'API Request');
    return {
      success: false,
    } as APIResponse<T>;
  }
}
