import {
  getCurrentUTCTime,
  extractLastPanDigits,
  cardNameSelector,
  mappedRowData,
  serializedFileCSV,
  txtToHash,
  formatDate,
  fileToHash,
  uint8ToShortHash,
  serializedDateFilter,
  serializeSearchParam,
  validateSession,
  reportErrorToSentry,
} from '../utils';
import {
  TransactionDefaultFormat,
  TransactionBillPocketFormat,
  TypeFile,
} from '@/app/types/documents';
import { auth } from '../../../auth';
import { DEFAULT_PAGINATION_LIMIT } from '../consts';
import { revalidatePath } from 'next/cache';

// Transaction CSV model

const requiredPropsDefaultFormat: (keyof TransactionDefaultFormat)[] = [
  'Referencia',
  'Monto Total',
  'Comisión',
  'Código autorización',
  'Fecha',
  'ID Terminal',
  'ID estatus de la transacción',
  'Status de transacción',
  'Marca de tarjeta',
  'Pan',
];

const requiredPropsBillPocketFormat: (keyof TransactionBillPocketFormat)[] = [
  'ID TRANSACCION',
  'DISPOSITIVO',
  'TARJETA',
  'TIPO',
  'MONTO TOTAL',
  'FECHA/HORA',
  'COMISION',
];

export async function processFile(
  file: File,
  comments: string,
  userID: string
) {
  if (file.type !== 'text/csv' && file.type !== 'application/vnd.ms-excel') {
    throw new Error('El archivo debe ser de tipo CSV');
  }

  const filename = file.name;
  const data = await serializedFileCSV(file);
  if (data.length === 0) {
    throw new Error('No se encontraron datos en el archivo');
  }

  const { missingProperties, typeFile } = findMissingProperties(data);

  if (missingProperties.length > 0) {
    throw new Error(
      `El archivo no contiene las siguientes propiedades: ${missingProperties.join(', ')}`
    );
  }

  const uint8File = await fileToHash(file);
  const fileShortHash = uint8ToShortHash(uint8File);

  const uploadRegister = await syncUploads(
    filename,
    fileShortHash,
    comments,
    userID,
    typeFile
  );

  await syncTerminals(
    data.map((item) => ({
      name: item['ID Terminal'] || item['DISPOSITIVO'],
    }))
  );

  await syncCardTypes(
    data.map((item) => ({
      name: item['Marca de tarjeta'] || item['TIPO'] || 'Sin especificar',
    }))
  );

  await syncTransactionStatus(
    data
      .filter((item) => !!item['ID estatus de la transacción'])
      .map((item) => ({
        id: +item['ID estatus de la transacción'],
        name: item['Status de transacción'],
      }))
  );

  const cardTypes = await prisma.cardType.findMany({
    select: {
      id: true,
      name: true,
    },
  });

  const terminals = await prisma.terminal.findMany();
  const fileData = serializerFileData(
    data,
    cardTypes,
    terminals,
    typeFile,
    uploadRegister.id
  );

  // create transactions
  await prisma.transaction.createMany({
    data: fileData,
    skipDuplicates: true,
  });
}

/**
 * Sync transaction status catalog
 */

async function syncTransactionStatus(status: { id: number; name: string }[]) {
  await prisma.statusTransaction.createMany({
    data: status,
    skipDuplicates: true,
  });
}

async function syncCardTypes(cardTypes: { name: string }[]) {
  await prisma.cardType.createMany({
    data: cardTypes,
    skipDuplicates: true,
  });
}

async function syncUploads(
  filename: string,
  fileHash: string,
  comments: string,
  userID: string,
  type: TypeFile
) {
  const existingUpload = await prisma.upload.findFirst({
    where: {
      fileHash,
    },
  });

  const currentTime = getCurrentUTCTime().toISOString();
  if (existingUpload) {
    return await prisma.upload.update({
      where: {
        id: existingUpload.id,
      },
      data: {
        comments: comments || null,
        updatedAt: currentTime,
      },
    });
  }
  return await prisma.upload.create({
    data: {
      filename,
      fileHash,
      comments: comments || null,
      date: currentTime,
      updatedAt: currentTime,
      userID: userID,
      type,
    },
  });
}

export async function syncTerminals(terminals: { name: string }[]) {
  const data = terminals.map((item) => ({
    name: item.name.trim(),
    nameHash: txtToHash(item.name.trim()),
  }));

  await prisma.terminal.createMany({
    data,
    skipDuplicates: true,
  });
}

// serializer data from csv to prisma model
function serializerFileData(
  data: (TransactionDefaultFormat & TransactionBillPocketFormat)[],
  cardTypes: { id: string; name: string }[],
  terminals: Terminal[],
  typeFile: TypeFile,
  uploadID: string
) {
  return data.map((item) => {
    const mappedItem = mappedRowData(typeFile, item);
    const cardName = item[cardNameSelector[typeFile]] || 'Sin especificar';
    const cardType = cardTypes.find((card) => card.name === cardName);
    const terminalName = item['ID Terminal'] || item['DISPOSITIVO'];
    const terminal = terminals.find((t) => t.name === terminalName);
    return {
      ...mappedItem,
      cardTypeID: cardType!.id,
      terminalID: terminal!.id,
      date: new Date(mappedItem.date).toISOString(),
      statusTransactionID: +(mappedItem.statusTransactionID || 1),
      lastPanDigits: extractLastPanDigits(String(mappedItem.lastPanDigits)),
      uploadID,
    };
  });
}

const findMissingProperties = (
  arr: Partial<TransactionDefaultFormat | TransactionBillPocketFormat>[]
): { missingProperties: string[]; typeFile: TypeFile } => {
  const uniqueMissingProps = new Set<string>();
  const uniqueMissingPropsBillPocket = new Set<string>();

  arr.forEach((item) => {
    requiredPropsDefaultFormat.forEach((prop) => {
      if (!(prop in item)) {
        uniqueMissingProps.add(prop);
      }
    });

    requiredPropsBillPocketFormat.forEach((prop) => {
      if (!(prop in item)) {
        uniqueMissingPropsBillPocket.add(prop);
      }
    });
  });

  const typeFile =
    uniqueMissingProps.size < uniqueMissingPropsBillPocket.size
      ? 'spiral'
      : 'billpocket';

  return {
    typeFile,
    missingProperties: {
      spiral: Array.from(uniqueMissingProps),
      billpocket: Array.from(uniqueMissingPropsBillPocket),
    }[typeFile],
  };
};

export async function getUploads(
  page: number = 1,
  query?: string,
  from?: string,
  to?: string
) {
  const session = await auth();
  validateSession(session);

  // pagination
  const defaultLimit = DEFAULT_PAGINATION_LIMIT;
  const skip = (page - 1) * defaultLimit;
  const pagination = { skip, take: defaultLimit };

  // filters
  const date = serializedDateFilter(from, to);
  const search = serializeSearchParam(query || '', ['filename', 'comments']);

  const totalItemsPromise = await prisma.upload.count({
    where: {
      date,
      ...search,
    },
  });

  const uploadsPromise = prisma.upload.findMany({
    ...pagination,
    where: {
      date,
      ...search,
    },
    select: {
      id: true,
      filename: true,
      date: true,
      updatedAt: true,
      comments: true,
      user: true,
      type: true,
    },
  });
  try {
    const [totalItems, uploads] = await Promise.all([
      totalItemsPromise,
      uploadsPromise,
    ]);

    const data = uploads.map((item) => ({
      ...item,
      date: formatDate(item.date),
      updatedAt: formatDate(item.updatedAt),
    }));

    return {
      data,
      totalItems,
    };
  } catch (e) {
    reportErrorToSentry(e, 'Upload Service Get table');
    throw new Error();
  }
}

export async function getAssociedTransactionsByUploadID(uploadID: string) {
  const quantity = await prisma.transaction.count({
    where: {
      uploadID,
    },
  });
  return quantity;
}

export async function deleteUpload(id: string) {
  await prisma.$transaction(async (prisma) => {
    const transactions = await prisma.transaction.findMany({
      where: {
        uploadID: id,
      },
      select: { reference: true, uploadID: true },
    });

    await prisma.transaction.deleteMany({
      where: {
        AND: transactions.map((item) => ({
          reference: item.reference,
          uploadID: item.uploadID,
        })),
      },
    });

    await prisma.upload.delete({
      where: {
        id,
      },
    });
  });
  const path = '/dashboard/uploads';
  revalidatePath(path);
}
