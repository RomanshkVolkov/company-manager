'use server';

// framework

// libs
import { read, utils } from 'xlsx';

// types and utils
import { apiRequest } from '@/app/lib/server-functions';
import { serializedPathname, validatedRequest } from '@/app/lib/utils';
import { createAction } from './generic.actions';
import { site } from '../consts';
import {
  CreateDocument,
  DocumentFields,
  DocumentStrings,
  EditableDocumentWithFields,
  TableByID,
} from '@/app/types/forms';
import { CommonFields } from '@/app/types/types';
import { Document } from '@/app/types/documents';

// components

export async function getDocuments<T>() {
  const response = await apiRequest<T[]>('/documents', 'GET', true);

  return validatedRequest(response, []);
}

export async function getDocumentById(id: number) {
  const response = await apiRequest<Document>(`/documents/${id}`, 'GET', true);

  return validatedRequest(response, {} as Document);
}

export async function createDocument(
  fields: DocumentFields[],
  prevState: any,
  formData: FormData
) {
  const data = Object.fromEntries(formData);

  const fieldsMapped = fields.map((field) => {
    const { id, ...rest } = field;
    return rest;
  });

  const body = {
    name: data.name,
    table: data.table,
    fields: fieldsMapped,
  };

  return await createAction<Record<DocumentStrings, string[]>>(
    '/documents',
    'Error al crear el documento',
    {
      revalidate: site.documentsSettings.path,
      redirect: site.documentsSettings.path,
    },
    body
  );
}

export async function uploadDocument(
  id: number,
  prevData: any,
  formData: FormData
) {
  const data = Object.fromEntries(formData);

  const file = formData.get('file_input_excel') as File;
  const arrayBuffer = await file.arrayBuffer();
  const extractData = new Uint8Array(arrayBuffer);
  const workbook = read(extractData, { type: 'array' });

  const firstSheet = workbook.Sheets[workbook.SheetNames[0]];
  const jsonData = utils.sheet_to_json(firstSheet, { header: 1 });
  const headers = (jsonData[0] as string[])?.map((header) =>
    header.trim().replace(/\s/g, '_')
  );

  if (!headers) {
    return {
      message: 'No se encontraron encabezados en el archivo',
      errors: { file: ['No se encontraron encabezados en el archivo'] },
    };
  }

  const rows = jsonData.slice(1);
  const body = rows.reduce((acc: any, row: any) => {
    const obj: any = {};
    (headers as any).forEach((header: any, index: number) => {
      obj[header] = row[index];
    });
    acc.push(obj);
    return acc;
  }, []);

  const pathRedirectAndRevalidate = serializedPathname(site.dataTable.path, {
    id,
  });

  return await createAction<Record<'file', string[]>>(
    '/documents/upload',
    'Error al cargar el documento',
    {
      revalidate: pathRedirectAndRevalidate,
      redirect: pathRedirectAndRevalidate,
    },
    {
      documentID: id,
      file: JSON.stringify(body),
    }
  );
}

export async function getDocumentTables() {
  const response = await apiRequest<CommonFields[]>(
    '/documents/tables',
    'GET',
    true,
    undefined,
    1200
  );

  return validatedRequest(response, []);
}

export async function getDocumentTableById(id: number) {
  const response = await apiRequest<TableByID>(
    `/documents/tables/${id}`,
    'GET',
    true
  );

  return validatedRequest(response, {
    report: {},
    table: [],
    columns: [],
  } as any as TableByID);
}
