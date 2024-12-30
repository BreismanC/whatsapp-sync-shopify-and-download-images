import { useState } from "react";
import { ImagesForm, SelectOnChange } from "../interfaces";

const initialImagesForm: ImagesForm = {
  group: null,
  initialDate: new Date(),
  initialTime: "",
  endDate: new Date(),
  endTime: "",
};

type KeyDate = "initialDate" | "endDate";

type KeyTime = "initialTime" | "endTime";

export const useImageForm = () => {
  const [imagesForm, setImagesForm] = useState<ImagesForm>(initialImagesForm);

  const handleSelect: SelectOnChange = (value) => {
    setImagesForm((prev: ImagesForm) => ({ ...prev, group: value }));
  };

  const handleDate = (key: KeyDate, date: Date | undefined) => {
    setImagesForm((prev) => ({ ...prev, [key]: date })); // Actualiza el estado con la fecha seleccionada
  };

  const handleTime = (key: KeyTime, time: string) => {
    setImagesForm((prev) => ({ ...prev, [key]: time }));
  };

  return {
    imagesForm,
    handleSelect,
    handleDate,
    handleTime,
  };
};
