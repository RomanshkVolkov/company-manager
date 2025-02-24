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

type APIMethods = 'GET' | 'POST' | 'PUT' | 'DELETE';
export const httpMethod: Record<APIMethods, APIMethods> = {
  GET: 'GET',
  POST: 'POST',
  PUT: 'PUT',
  DELETE: 'DELETE',
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
  login: { name: 'Iniciar sesión', path: '/login', isPublic: true },
  // dashboard
  home: { name: 'Dashboard', path: '/dashboard' },
  // configuración - general
  generalSettings: {
    name: 'General',
    path: '/dashboard/settings/general',
  },
  // acciones de la tabla de perfiles
  createProfile: {
    name: 'Crear perfil',
    path: '/dashboard/settings/general/profiles/create',
  },
  editProfile: {
    name: 'Editar perfil',
    path: '/dashboard/settings/general/profiles/:id/edit',
  },
  deleteProfile: {
    name: 'Eliminar perfil',
    path: '/dashboard/settings/action-remove/profile/:id?name=:name',
  },
  // configuración - usuarios
  usersSettings: { name: 'Usuarios', path: '/dashboard/settings/users' },
  editUser: {
    name: 'Editar usuario',
    path: '/dashboard/settings/users/:id/edit',
  },
  // common route to action remove kitchen, shift, user, profile
  settingsActionRemove: {
    name: 'Eliminar',
    path: '/dashboard/settings/action-remove/:slugAction/:id?name=:name',
  },
  createKitchen: {
    name: 'Crear cocina',
    path: '/dashboard/settings/create-kitchen',
  },
  createShift: {
    name: 'Crear turno',
    path: '/dashboard/settings/create-shift',
  },
  editKitchen: {
    name: 'Editar cocina',
    path: '/dashboard/settings/set-kitchen',
  },
  editShift: { name: 'Editar turno', path: '/dashboard/settings/set-shift' },
  shiftsSettings: { name: 'Turnos', path: '/dashboard/settings/shifts' },
  kitchensSettings: { name: 'Cocinas', path: '/dashboard/settings/kitchens' },
  // configuración - documentos
  documentsSettings: {
    // table
    name: 'Documentos',
    path: '/dashboard/settings/documents',
  },
  createDocument: {
    name: 'Crear documento',
    path: '/dashboard/settings/documents/create',
  },
  editDocument: {
    name: 'Editar documento',
    path: '/dashboard/settings/documents/:id/edit',
  },
  // eliminar columna de documento
  deleteDocumentField: {
    name: 'Eliminar campo de documento',
    path: '/dashboard/settings/documents/delete-field/:id?field=:field',
  },
  deleteDocument: {
    name: 'Eliminar documento',
    path: '/dashboard/settings/documents/delete-item/:id?name=:name',
  },
  data: { name: 'Datos', path: '/dashboard/data', isPublic: true },
  dataTable: {
    name: 'Tabla',
    path: '/dashboard/data/table/:id',
    isPublic: true,
  },
  uploadDocument: {
    name: 'Subir documento',
    path: '/dashboard/data/upload-document?id=:documentID',
  },
  editDocumentRecord: {
    name: 'Editar fila de documento',
    path: '/dashboard/data/record-detail/:id/edit?documentID=:documentID',
  },
  deleteDocumentRecord: {
    name: 'Eliminar registro de documento',
    path: '/dashboard/data/detail-record/:id/delete?documentID=:documentID',
  },
  reports: { name: 'Reportes', path: '/dashboard/reports', isPublic: true },
  showReport: {
    name: 'Ver reporte',
    path: '/dashboard/reports/:id',
    isPublic: true,
  },
  changePassword: {
    name: 'Cambiar contraseña',
    path: '/dashboard/change-password',
  },
};

export const publicRoutes = Object.values(site)
  .filter((site) => site.isPublic)
  .map((site) => site.path);
