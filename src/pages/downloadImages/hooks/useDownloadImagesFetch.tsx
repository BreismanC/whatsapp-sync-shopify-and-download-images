import { SyntheticEvent, useState } from "react";
import { type ImagesForm } from "../interfaces";

import { type Toast, type ToasterToast } from "@/hooks/use-toast";

type ToastFunction = ({ ...props }: Toast) => {
  id: string;
  dismiss: () => void;
  update: (props: ToasterToast) => void;
};

export const useDownloadImagesFetch = (toast: ToastFunction) => {
  // const [groups, setGroups] = useState<Option[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: SyntheticEvent, imagesForm: ImagesForm) => {
    try {
      e.preventDefault();
      setLoading(true);

      if (
        !imagesForm.group ||
        !imagesForm.initialDate ||
        !imagesForm.endDate ||
        !imagesForm.initialTime ||
        !imagesForm.endTime
      ) {
        throw new Error("Por favor debes diligenciar todos los datos");
      }

      const { group, initialDate, initialTime, endDate, endTime } =
        formatImagesGroupForm(imagesForm);

      const ROUTE_FETCH = `api/v1/contacts/${group}/chat?startDate=${initialDate}%20${initialTime}&endDate=${endDate}%20${endTime}`;

      console.log({ ROUTE_FETCH });

      const response = await fetch(ROUTE_FETCH);

      // Validar el código de estado de la respuesta
      if (!response.ok) {
        throw new Error(`Error al obtener el archivo: ${response.statusText}`);
      }

      // Procesar la respuesta como blob
      const blob = await response.blob();

      // Crear una URL para descargar el archivo
      const url = window.URL.createObjectURL(blob);

      // Crear un enlace temporal para descargar el archivo
      const a = document.createElement("a");
      a.href = url;
      a.download =
        response.headers.get("Content-Disposition")?.split("=")[1] ||
        "archivo.zip"; // Cambia el nombre del archivo según sea necesario
      a.click();

      // Liberar la URL creada
      window.URL.revokeObjectURL(url);

      toast({
        title: "Imagenes descargadas correctamente",
        description: "Archivo zip descargado correctamente",
      });
    } catch (error) {
      if (error instanceof Error) {
        console.log("Ocurrio un error al solicitar las fotos", error);
        setError(error.message);
        toast({
          title: "Ha ocurrido un error, intenta nuevamente",
          description: error.message,
        });
      }
    } finally {
      setLoading(false);
    }
  };

  return {
    handleSubmit,
    loading,
    error,
  };
};

function formatImagesGroupForm(imagesForm: ImagesForm) {
  const { group, endDate, endTime, initialDate, initialTime } = imagesForm;

  if (!group || !("value" in group)) {
    throw new Error("El grupo debe ser una instancia de SingleValue");
  }

  if (!endDate || !initialDate) {
    throw new Error("Error al procesar las fechas del formulario");
  }

  return {
    group: group.value,
    initialDate: formatDate(initialDate),
    initialTime: formatTime(initialTime),
    endDate: formatDate(endDate),
    endTime: formatTime(endTime),
  };
}

function formatDate(date: Date): string {
  const month = (date.getMonth() + 1).toString().padStart(2, "0");
  const day = date.getDate().toString().padStart(2, "0");
  const year = date.getFullYear().toString();

  return `${month}/${day}/${year}`;
}

function formatTime(time: string): string {
  const [hour, minute, period] = time
    .toUpperCase()
    .match(/(\d{1,2})\s(\d{2})\s(AM|PM)/)!
    .slice(1);

  let hours24 = parseInt(hour, 10);

  if (period === "PM" && hours24 !== 12) {
    hours24 += 12;
  } else if (period === "AM" && hours24 === 12) {
    hours24 = 0;
  }

  const hoursFormatted = hours24.toString().padStart(2, "0");
  const minutesFormatted = minute.padStart(2, "0");

  return `${hoursFormatted}:${minutesFormatted}:00`;
}
