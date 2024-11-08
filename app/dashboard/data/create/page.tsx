import { getClientUsers } from '@/app/lib/services/user.service';
import Breadcrumbs from '@/app/ui/common/breadcrumbs';
import Form from '@/app/ui/dashboard/deposits/create-form';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Crear depósito',
};

export default async function CreateUser() {
  const clients = await getClientUsers();

  return (
    <main>
      <section className="mb-6 flex flex-col">
        <h1 className="mb-4 text-4xl">Crear depósito</h1>
        <Breadcrumbs
          breadcrumbs={[
            { label: 'Retiros', href: '/dashboard/deposits' },
            { label: 'Crear', href: '#', active: true },
          ]}
        />
      </section>

      <section className="w-full">
        <Form clients={clients} />
      </section>
    </main>
  );
}
