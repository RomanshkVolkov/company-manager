import { getDepositByID } from '@/app/lib/services/deposit.service';
import { getClientUsers } from '@/app/lib/services/user.service';
import Breadcrumbs from '@/app/ui/common/breadcrumbs';
import Form from '@/app/ui/dashboard/deposits/edit-form';
import { Metadata } from 'next';
import { notFound } from 'next/navigation';

export const metadata: Metadata = {
  title: 'Editar depósito',
};

export default async function EditUser({ params }: { params: { id: string } }) {
  const { id } = params;
  const [deposit, clients] = await Promise.all([
    getDepositByID(id),
    getClientUsers(),
  ]);

  if (!deposit) notFound();

  return (
    <main>
      <section className="mb-6 flex flex-col">
        <h1 className="mb-4 text-4xl">Editar usuario</h1>
        <Breadcrumbs
          breadcrumbs={[
            { label: 'Usuarios', href: '/dashboard/settings/users' },
            { label: 'Editar', href: '#', active: true },
          ]}
        />
      </section>

      <section className="w-full">
        <Form deposit={deposit} clients={clients} />
      </section>
    </main>
  );
}
