// framework
import { Metadata } from 'next';

// libs

// types and utils
import { getCurrentHostingCenter } from '@/app/lib/actions/hosting-centers.actions';

// components
import FormHotel from '@/app/ui/dashboard/hotels/form';
import MainWrapper from '@/app/ui/common/main-wrapper';
import TableWrapper from '@/app/ui/dashboard/users/profiles/table-wrapper';
import HeaderWrapper from '@/app/ui/common/header-wrapper';
import CreateLinkButton from '@/app/ui/common/create-button';
import { site } from '@/app/lib/consts';

export const metadata: Metadata = {
  title: 'Configuración General',
};

export default async function General({
  params,
}: {
  params: {
    query?: string;
    page?: string;
    from?: string;
    to?: string;
  };
}) {
  // params
  const page = params?.page ? +params.page : 1;
  const { from, to } = params;

  // consts and helper functions
  const linksToPrefetch = [
    site.createProfile.path,
    site.usersSettings.path,
    site.documentsSettings.path,
  ];

  // data
  const { data } = await getCurrentHostingCenter();

  return (
    <MainWrapper
      title="Configuración General"
      linksToPrefetch={linksToPrefetch}
    >
      <div className="w-full">
        <FormHotel data={data} />
      </div>

      <div className="flex w-full flex-col items-center justify-start">
        <HeaderWrapper>
          <h2 className="text-2xl">Perfiles</h2>
          <CreateLinkButton
            href={site.createProfile.path}
            label={site.createProfile.name}
          />
        </HeaderWrapper>
        <TableWrapper page={page} date={{ from, to }} />
      </div>
    </MainWrapper>
  );
}
