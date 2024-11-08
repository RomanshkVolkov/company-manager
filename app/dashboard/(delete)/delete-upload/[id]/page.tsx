import { redirect } from 'next/navigation';

// This route is only for parallel and intercepting routing used for modals. If the page doesn't exist, modals won't work and will throw a 404 error.
export default function Page() {
  redirect('/dashboard/transactions/uploads');
}
