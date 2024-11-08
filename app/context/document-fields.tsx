'use client';
import React, { useState } from 'react';
import { DocumentFields } from '../types/forms';

const initialValue: {
  fields: DocumentFields[];
  setFields: React.Dispatch<React.SetStateAction<DocumentFields[]>>;
} = {
  fields: [],
  setFields: () => {},
};

type Props = {
  children: React.ReactNode;
};
export const DocumentFieldsContext = React.createContext(initialValue);

const DocumentFieldsProvider = ({ children }: Props) => {
  const [fields, setFields] = useState<DocumentFields[]>([]);

  return (
    <DocumentFieldsContext.Provider value={{ fields, setFields }}>
      {children}
    </DocumentFieldsContext.Provider>
  );
};

export default DocumentFieldsProvider;
