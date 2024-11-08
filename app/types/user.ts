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
