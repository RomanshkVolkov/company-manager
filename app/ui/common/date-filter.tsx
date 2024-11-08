'use client';

import React from 'react';
import { DateRangePicker, DateValue, RangeValue } from '@nextui-org/react';
import { today, CalendarDate } from '@internationalized/date';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { I18nProvider } from '@react-aria/i18n';

export default function DateFilter({
  onChange,
  defaultFromValue,
  defaultToValue,
  label,
}: {
  onChange?: (_value: RangeValue<DateValue>) => void;
  defaultFromValue?: CalendarDate;
  defaultToValue?: CalendarDate;
  label?: string;
}) {
  const { replace } = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const initialStartDate =
    stringToCalendarDate(searchParams.get('from')) ||
    today('utc').add({ weeks: -1 });
  const initialEndDate =
    stringToCalendarDate(searchParams.get('to')) || today('utc');

  const handleChange = (value: RangeValue<DateValue>) => {
    const { start, end } = value;
    const from = stringToCalendarDate(start?.toString());
    const to = stringToCalendarDate(end?.toString());

    replace(`${pathname}?from=${from}&to=${to}`);
  };

  return (
    <I18nProvider locale="es-MX-u-ca-gregory">
      <DateRangePicker
        showMonthAndYearPickers
        className="w-full lg:max-w-xs"
        defaultValue={{
          start: defaultFromValue || initialStartDate,
          end: defaultToValue || initialEndDate,
        }}
        onChange={onChange || handleChange}
        label={label || 'Filtrar por fecha'}
        aria-label="Date range picker"
        labelPlacement="inside"
        autoCapitalize="off"
      />
    </I18nProvider>
  );
}

export function stringToCalendarDate(date: string | null): CalendarDate | null {
  if (!date) return null;
  const [year, month, day] = date.split('-').map(Number);
  return new CalendarDate(year, month, day);
}
