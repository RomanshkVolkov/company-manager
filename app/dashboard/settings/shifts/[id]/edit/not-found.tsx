import CustomNotFound from '@/app/ui/common/not-found';
import { site } from '@/app/lib/consts';

export default function NotFound() {
  return (
    <CustomNotFound
      message="No se pudo encontrar el turno solicitado."
      backHref={site.home.path}
    />
  );
}
