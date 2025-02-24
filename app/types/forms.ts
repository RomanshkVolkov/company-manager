import { Catalog, TableProps } from './types';

// Document CRUD
export type DocumentFields = {
  id: number;
  field: string;
  typeField: string;
  documentKey: string;
};
export type DocumentStrings = 'name' | 'table';
export type EditabledocumentStrings = 'name';
export type CreateDocument = Record<DocumentStrings, string> & {
  fields: DocumentFields[];
};
export type EditableDocument = Record<DocumentStrings, string> & {
  id: number;
  fields: DocumentFields[];
};
export type EditableDocumentWithFields = Record<DocumentStrings, string> & {
  id: number;
  fields: DocumentFields[];
};

// data
export type TableByID = {
  document: Catalog;
  table: any[];
  columns: TableProps<any>['columns'][];
};

// reports
export type ReportByID = {
  report: Catalog;
  table: any[];
  columns: TableProps<any>['columns'];
};
