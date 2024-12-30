import { ReactNode } from "react";

interface Props {
  children?: ReactNode;
}

export const ContainerInput = ({ children }: Props) => {
  return <div className="flex flex-col space-y-2 w-full">{children}</div>;
};
