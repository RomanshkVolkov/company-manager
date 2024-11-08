import { SitePaths } from '@/app/types/types';

export const DEFAULT_PAGINATION_LIMIT = 20;

export const ROOT_USER_TYPE_UUID = 1;
export const ADMIN_USER_TYPE_UUID = 2;
export const CLIENT_USER_TYPE_UUID = '542a6123-115a-42b0-8a1d-4f093afa8e18';
export const EMPLOYEE_USER_TYPE_UUID = '3a89fab1-d87d-4e72-beda-eb3e7f4ddf72';
export const CELL_MAX_LENGTH = 15;

export const url = {
  api: process.env.NEXT_PUBLIC_API_URL,
};

export const pagePermissions = {
  root: true,
  admin: true,
  employee: [],
  customer: [],
};

export const commonErrors = {
  SESSION_NOT_FOUND: {
    message: 'No se pudo obtener la sesión del usuario',
    errors: {},
  },
};

export const DATABASE_TYPES = [
  {
    id: 1,
    name: 'NVARCHAR(300)',
  },
  {
    id: 2,
    name: 'NVARCHAR(100)',
  },
  {
    id: 3,
    name: 'NVARCHAR(50)',
  },
  {
    id: 4,
    name: 'NVARCHAR(20)',
  },
  {
    id: 5,
    name: 'INT',
  },
  {
    id: 6,
    name: 'DECIMAL(10, 2)',
  },
  {
    id: 7,
    name: 'DATETIME',
  },
];

export const site: SitePaths = {
  home: { name: 'Dashboard', path: '/dashboard' },
  login: { name: 'Iniciar sesión', path: '/login' },
  createProfile: {
    name: 'Crear perfil',
    path: '/dashboard/settings/create-profile',
  },
  editProfile: {
    name: 'Editar perfil',
    path: '/dashboard/settings/edit-profile/:id',
  },
  createKitchen: {
    name: 'Crear cocina',
    path: '/dashboard/settings/create-kitchen',
  },
  createShift: {
    name: 'Crear turno',
    path: '/dashboard/settings/create-shift',
  },
  setKitchen: {
    name: 'Editar cocina',
    path: '/dashboard/settings/set-kitchen',
  },
  setShift: { name: 'Editar turno', path: '/dashboard/settings/set-shift' },
  settingsActionRemove: {
    name: 'Eliminar',
    path: '/dashboard/settings/action-remove/:slugAction/:id?name=:name',
  },
  generalSettings: {
    name: 'General',
    path: '/dashboard/settings/general',
  },
  usersSettings: { name: 'Usuarios', path: '/dashboard/settings/users' },
  setUser: {
    name: 'Editar usuario',
    path: '/dashboard/settings/users/:id/edit',
  },
  shiftsSettings: { name: 'Turnos', path: '/dashboard/settings/shifts' },
  kitchensSettings: { name: 'Cocinas', path: '/dashboard/settings/kitchens' },
  documentsSettings: {
    name: 'Documentos',
    path: '/dashboard/settings/documents',
  },
  createDocument: {
    name: 'Crear documento',
    path: '/dashboard/settings/documents/create',
  },
  setDocument: {
    name: 'Editar documento',
    path: '/dashboard/settings/documents/:id/edit',
  },
  deleteDocument: {
    name: 'Eliminar documento',
    path: '/dashboard/settings/documents/:id/delete',
  },
  data: { name: 'Datos', path: '/dashboard/data' },
  dataTable: { name: 'Tabla', path: '/dashboard/data/table/:id' },
  uploadDocument: {
    name: 'Subir documento',
    path: '/dashboard/data/upload-document?id=:documentID',
  },
  reports: { name: 'Reportes', path: '/dashboard/reports' },
  changePassword: {
    name: 'Cambiar contraseña',
    path: '/dashboard/change-password',
  },
  // settings: {
  //   modals: {
  //     createProfile: '/dashboard/settings/create-profile',
  //     editProfile: (id: PageIDParam) =>
  //       `/dashboard/settings/edit-profile/${id}`,
  //     createKitchen: '/dashboard/settings/create-kitchen',
  //     createShift: '/dashboard/settings/create-shift',
  //     editKitchen: '/dashboard/settings/edit-kitchen/:id',
  //     editShift: '/dashboard/settings/edit-shift/:id',
  //     actionRemove: (slugAction: string) =>
  //       `/dashboard/settings/action-remove/${slugAction}/:id?name=:name`,
  //   },
  //   general: '/dashboard/settings/general',
  //   users: '/dashboard/settings/users',
  //   shifts: '/dashboard/settings/shifts',
  //   kitchens: '/dashboard/settings/kitchens',
  // },
  // documents: {
  //   init: '/dashboard/settings/documents',
  //   create: '/dashboard/settings/documents/create',
  //   editDocument: '/dashboard/settings/documents/:id/edit',
  //   deleteDocument: '/dashboard/settings/documents/:id/delete',
  // },
  // datax: {
  //   init: '/dashboard/data',
  //   table: '/dashboard/data/table/:id',
  //   uploadDocument: '/dashboard/data/upload-document?documentID=:documentID',
  // },
};
