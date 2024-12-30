import { ActionMeta, MultiValue, SingleValue } from "react-select";

export interface Option {
  label: string;
  value: string;
}

export type SelectOption = SingleValue<Option> | MultiValue<Option>;
export type SelectOnChange = (
  value: SingleValue<Option> | MultiValue<Option>,
  actionMeta?: ActionMeta<Option>
) => void;
