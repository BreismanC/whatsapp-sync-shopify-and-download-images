import { Select } from "@/components";
import { useGetGroups } from "../../hooks";
import { SelectOnChange, SelectOption } from "../../interfaces";

const errorInfo = [{ label: "Ha ocurrido un error", value: "" }];

interface Props {
  handleSelect: SelectOnChange;
  selectValue: SelectOption;
}

export const SelectGroups = ({ selectValue, handleSelect }: Props) => {
  const { error, loading, groups } = useGetGroups();

  return (
    <div className="container mx-auto">
      <Select
        options={error || !groups.length ? errorInfo : groups}
        isClearable
        isLoading={loading}
        placeholder="Selecciona el contacto de interés"
        required
        value={selectValue}
        onChange={handleSelect}
      />
    </div>
  );
};
