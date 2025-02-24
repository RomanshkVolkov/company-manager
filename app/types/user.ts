export type UsersTable = {
  id: number;
  name: string;
  username: string;
  email: string;
  profile: string;
  isActive: boolean;
};

export type EditableUser = {
  id: number;
  username: string;
  name: string;
  email: string;
  shiftID?: string;
  isActive: string | boolean;
  profileID: string;
  kitchenIDs?: string[];
};

export type Permission = {
  id: number;
  name: string;
  path: string;
  writing: boolean;
};
export type Profile = {
  id: number;
  name: string;
  permissions: Permission[];
};
