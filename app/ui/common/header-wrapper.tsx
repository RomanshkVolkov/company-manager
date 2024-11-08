import React from 'react';

export default function HeaderWrapper({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="mb-6 ml-2 flex w-full justify-between">{children}</div>
  );
}
