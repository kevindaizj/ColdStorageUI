export interface DCMenuAction {
  Checked: boolean;
  Id: string;
  MenuId: number;
  Name: string;
  SortOrder: number;
}

export interface DCMenu {
  Checked: boolean;
  Id: number;
  ParentId: number;
  Name: string;
  Code: string;
  Path: string;
  Icon: string;
  SortOrder: number;
  Type: number;
  Children: DCMenu[];
  MenuActionList: DCMenuAction[];
  expand: boolean;
  ActionId: string;
}

export interface AuthMenu {
  Checked: boolean;
  Name: string;
  Code: string;
  Path: string;
  MenuActionList: string[];
}

export const DEFAULT_MENU_ACTION = 'Manager';
export const ALL_RIGHTS_MENU_ACTION = 'Operator';
