import { type DefaultSession } from 'next-auth';
// eslint-disable-next-line no-unused-vars

export type APIError = {
  name: string;
  message: string;
  stack?: string;
};

export type APIResponse<T> = {
  success: boolean;
  message: {
    en: string;
    es: string;
  };
  data: T;
  schema: {
    [key: string]: string[];
  };
  error: APIError;
};

export type ActionState<FormFields> = {
  message: string;
  errors: FormFields;
  finishedProcess?: boolean;
};

// Name and Email are already defined by DefaultSession
export interface UserSession {
  id: string;
  name: string;
  email: string;
  profile: {
    id: number;
    name: string;
    slug: string;
  };
  token: string;
}

export type TableProps<T> = {
  columns: {
    uid: string;
    name: string;
    align?: 'start' | 'end' | 'center' | undefined;
  }[];
  data: T[];
  totalPages?: number;
  cellActions?: {
    editPath: string;
    deletePath: string;
  };
  filters?: {
    search: boolean;
    date: boolean;
  };
  limitRecordsPerPage?: number;
};

export type TableColumns<T> = {
  uid: T;
  name: string;
  align?: 'start' | 'end' | 'center' | undefined;
};

declare module 'next-auth' {
  // eslint-disable-next-line no-unused-vars
  interface Session {
    user: UserSession & DefaultSession['user'];
  }
}

export type GormModel = {
  createdAt: Date;
  updatedAt: Date;
  deletedAt?: Date;
};

export type Catalog = {
  id: number;
  name: string;
};

export type CommonFields = Catalog & GormModel;

export type SearchParamQuery = {
  [x: string]: {
    contains: string;
    mode: 'insensitive';
  };
};

export type SearchPrismaCondition = {
  OR: SearchParamQuery[];
};

export type DateInput = string | Date | undefined;

type PathNamesStrings =
  | 'home'
  | 'login'
  | 'createProfile'
  | 'editProfile'
  | 'createKitchen'
  | 'createShift'
  | 'setKitchen'
  | 'setShift'
  | 'settingsActionRemove'
  | 'generalSettings'
  | 'usersSettings'
  | 'setUser'
  | 'shiftsSettings'
  | 'kitchensSettings'
  | 'documentsSettings'
  | 'createDocument'
  | 'setDocument'
  | 'deleteDocumentField'
  | 'deleteDocument'
  | 'data'
  | 'dataTable'
  | 'uploadDocument'
  | 'reports'
  | 'changePassword';

export type SitePaths = Record<
  PathNamesStrings,
  { name: string; path: string }
>;
