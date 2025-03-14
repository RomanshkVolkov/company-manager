export type Document = {
  id: number;
  createdAt: string;
  updatedAt: string;
  name: string;
  table: string;
  fields: {
    id: number;
    documentID?: number;
    field: string;
    typeField: string;
    documentKey: string;
  }[];
};

export type DocumentRowRecord = {
  id: number;
  field: string;
  documentKey: string;
  typeField: string;
  value: string;
};

export type PickDataSourceDocumentFields = keyof Pick<
  Document['fields'][0],
  'field' | 'typeField' | 'documentKey'
>;
