import { NextApiRequest, NextApiResponse } from 'next';
import { headers } from 'next/headers';
import { notFound } from 'next/navigation';

import { SitePaths } from '@/app/types/types';
import { site } from '@/app/lib/consts';
import { apiRequest } from '@/app/lib/server-functions';
import { revalidateTag } from 'next/cache';

export async function PUT(req: Request) {
  const method = req.method;

  if (method !== 'PUT') {
    notFound();
  }

  const headersList = await headers();
  const authorizationCode = headersList.get('authorization') ?? '';

  if (authorizationCode !== process.env.INTERNAL_AUTHORIZATION_CODE) {
    notFound();
  }

  const routes = Object.keys(site).map((route) => ({
    name: site[route as keyof SitePaths].name,
    path: site[route as keyof SitePaths].path,
  }));

  const response = await apiRequest(
    '/internal/permissions-synchronization',
    'PUT',
    true,
    {
      routes,
    }
  );

  if (!response.success) {
    notFound();
  }

  revalidateTag('/users/permissions');

  return Response.json(response);
}

export function GET(_req: NextApiRequest, _res: NextApiResponse) {
  notFound();
}

export function POST(_req: NextApiRequest, _res: NextApiResponse) {
  notFound();
}
export function PACH(_req: NextApiRequest, _res: NextApiResponse) {
  notFound();
}

export function DELETE(_req: NextApiRequest, _res: NextApiResponse) {
  notFound();
}
