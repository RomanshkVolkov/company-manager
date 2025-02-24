'use server';

// framework

// libs
import { read, utils } from 'xlsx';

// types and utils
import { apiRequest } from '@/app/lib/server-functions';
import { serializedPathname, validatedRequest } from '@/app/lib/utils';
import { createAction, deleteAction, editAction } from './generic.actions';
import { site } from '../consts';
import {
  DocumentFields,
  DocumentStrings,
  EditabledocumentStrings,
  ReportByID,
  TableByID,
} from '@/app/types/forms';
import { APIResponse, CommonFields } from '@/app/types/types';
import { Document, DocumentRowRecord } from '@/app/types/documents';

// components

export async function getDocuments<T>() {
  const response = await apiRequest<T[]>(
    '/documents',
    'GET',
    true,
    undefined,
    1200
  );

  return validatedRequest(response, []);
}

export async function getDocumentById(id: number) {
  const response = await apiRequest<Document>(`/documents/${id}`, 'GET', true);

  return validatedRequest(response, {} as Document);
}

export async function getRecordByID(id: number, documentID: number) {
  const response = await apiRequest<DocumentRowRecord[]>(
    `/documents/details/${documentID}/records/${id}`,
    'GET',
    true
  );

  return validatedRequest(response, []);
}

export async function editRecordDetail(
  documentID: number,
  recordID: number,
  records: DocumentRowRecord[],
  prevState: any,
  formData: FormData
) {
  const data = Object.fromEntries(formData);

  const documentRecordMapped = records.reduce(
    (current: any, record: DocumentRowRecord) => {
      current[record.field] = data[record.field];
      return current;
    },
    {}
  );

  const body = {
    documentID,
    id: recordID,
    records: [documentRecordMapped],
  };

  return await editAction<Record<string, string[]>>(
    '/documents/records',
    'Error al editar el registro',
    [
      serializedPathname(site.dataTable.path, { id: documentID }),
      serializedPathname(site.editDocumentRecord.path, {
        id: recordID,
        documentID,
      }),
    ],
    body,
    undefined,
    true
  );
}

export async function createDocument(
  fields: DocumentFields[],
  prevState: any,
  formData: FormData
) {
  const data = Object.fromEntries(formData);

  const fieldsMapped = fields.map((field) => {
    // eslint-disable-next-line no-unused-vars, @typescript-eslint/no-unused-vars
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

export async function updateDocument(
  id: number,
  fields: DocumentFields[],
  prevState: any,
  formData: FormData
) {
  const data = Object.fromEntries(formData);

  const fieldsMapped = fields.map((field) => {
    // eslint-disable-next-line no-unused-vars, @typescript-eslint/no-unused-vars
    const { id, ...rest } = field;
    if (id > 0) {
      return { ...rest, id };
    }
    return rest;
  });

  const body = {
    id,
    name: data.name,
    fields: fieldsMapped,
  };

  return await editAction<Record<EditabledocumentStrings, string[]>>(
    `/documents/${id}`,
    `Error al actualizar el documento${data.name}`,
    [
      serializedPathname(site.editDocument.path, { id }),
      site.documentsSettings.path,
    ],
    body,
    null,
    true
  );
}

export async function deleteFieldDocument(id: number) {
  return await deleteAction(
    `/documents/fields/${id}`,
    'Error al eliminar el campo del documento',
    serializedPathname(site.editDocument.path, { id })
  );
}

export async function deleteDocument(id: number) {
  return await deleteAction(
    `/documents/${id}`,
    'Error al eliminar el documento',
    site.documentsSettings.path
  );
}

export async function deleteDetailRecord(id: number, documentID: number) {
  await deleteAction(
    `/documents/details/${documentID}/records/${id}`,
    'Error al eliminar el registro',
    serializedPathname(site.dataTable.path, { id: documentID })
  );
}

export async function uploadDocument(
  id: number,
  prevData: any,
  formData: FormData
) {
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

  const path = serializedPathname(site.dataTable.path, {
    id,
  });

  return await createAction<Record<'file', string[]>>(
    '/documents/upload',
    'Error al cargar el documento',
    {
      revalidate: path,
    },
    {
      documentID: id,
      file: JSON.stringify(body),
    },
    true
  );
}

// data web section
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

export async function getDocumentTableById(
  id: number
): Promise<APIResponse<TableByID>> {
  const response = await apiRequest<TableByID>(
    `/documents/tables/${id}`,
    'GET',
    true,
    undefined,
    3600
  );

  return validatedRequest(response, {
    document: { id: 0, name: '' },
    table: [],
    columns: [],
  } as any as TableByID);
}

export async function getReports() {
  const response = await apiRequest<CommonFields[]>(
    '/documents/reports',
    'GET',
    true,
    undefined,
    1200
  );

  const data = response.data?.map((report) => ({
    ...report,
    link: site.showReport.path,
  }));

  response.data = data;
  return validatedRequest(response, []);
}

export async function getReportByID(id: number) {
  const response = await apiRequest<ReportByID>(
    `/documents/reports/${id}`,
    'GET',
    true,
    undefined
  );

  return validatedRequest(response, {} as ReportByID);
}
