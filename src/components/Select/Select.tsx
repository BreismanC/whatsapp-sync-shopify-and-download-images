import { ReactNode } from "react";
import {
  SelectOption,
  SelectOnChange,
} from "@/pages/downloadImages/interfaces";
import ReactSelect, { type Props as ReactSelectProps } from "react-select";

interface Props extends Partial<ReactSelectProps<Option>> {
  options: Option[];
  isDisabled?: boolean;
  isClearable?: boolean;
  isLoading?: boolean;
  placeholder?: ReactNode;
  required: boolean;
  value: SelectOption;
  onChange: SelectOnChange;
}

interface Option {
  label: string;
  value: string;
}

export const Select = (props: Props) => {
  return <ReactSelect {...props} />;
};
