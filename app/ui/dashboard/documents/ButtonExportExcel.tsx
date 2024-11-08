'use client';
import useExcel from '@/app/hooks/useExcel';
import { getExcelTransactions } from '@/app/lib/actions/transaction';
import { getCurrentTimeClient } from '@/app/lib/utils';
import { DocumentArrowDownIcon } from '@heroicons/react/24/outline';
import { Button } from '@nextui-org/react';
import { useEffect, useState } from 'react';
import { useFormState } from 'react-dom';

export default function ButtonExportExcel({
  from,
  to,
  query,
}: {
  from: string;
  to: string;
  query: string;
}) {
  const [isExported, setIsExported] = useState(false);
  const { handleExport } = useExcel();
  const action = getExcelTransactions.bind({ from, to, query });

  const [state, dispatch] = useFormState(
    (prevState: any, formData: FormData) =>
      action({ from, to, query }, prevState, formData),
    null
  );
  useEffect(() => setIsExported(false), [state]);

  if (Array.isArray(state?.data) && state.data.length > 0 && !isExported) {
    handleExport(
      'Transacciones',
      `transactions_exported_by_${state.name}_${getCurrentTimeClient()}`,
      state.data
    );
    setIsExported(true);
  }

  return (
    <form action={dispatch}>
      <Button
        className="hidden md:flex"
        color="primary"
        variant="flat"
        size="lg"
        type="submit"
      >
        <span>Exportar a Excel</span>
      </Button>
      <Button
        className="md:hidden"
        color="primary"
        variant="flat"
        size="lg"
        type="submit"
        isIconOnly
      >
        <DocumentArrowDownIcon className="w-6" />
      </Button>
    </form>
  );
}
