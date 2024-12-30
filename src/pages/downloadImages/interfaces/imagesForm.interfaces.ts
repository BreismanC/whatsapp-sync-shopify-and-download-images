import { type SelectOption } from "./selectComponent.interface";

export interface ImagesForm {
  group: SelectOption | null;
  initialDate: Date | undefined;
  initialTime: string;
  endDate: Date | undefined;
  endTime: string;
}
