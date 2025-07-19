// ---------------mandatory intefaces---------------------------------------
export interface IFormInput {
  name: string;
  labelName: string;
  placeHolder: string;
  type: string;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  value: string | number;
}
export interface IFormSelectData {
  _id: string;
  name: string;
}

export interface IActionButton {
  name: string;
  onClick: (id: string) => void;
  testId?: string;
  variant?: "primary" | "secondary" | "danger"| "confirm"
}

export interface IFormSelect {
  name: string;
  labelName: string;
  data: IFormSelectData[];
}
export interface IButton {
  name: string;
  onClick: () => void;
  testId: string;
}
export interface ISidebarRoute {
  name: string;
  link: string;
}
export interface IButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "danger"| "confirm" | "success"
}
// --------------------------------------------------------------------------

export interface ILogin {
  email: string;
  password: string;
}
export interface IUser {
  name: string;
  email: string;
  age: number;
  _id?: string;
}
