import { ContainerInput, Label } from "@/components";
import { DateAndTimeInputs } from "../DateAndTimeInputs/DateAndTimeInputs";
import { SelectGroups } from "../SelectGroups/SelectGroups";

import { useDownloadImagesFetch, useImageForm } from "../../hooks";
import { Toaster } from "@/components/ui/toaster";
import { useToast } from "@/hooks/use-toast";

export const ImagesForm = () => {
  const { imagesForm, handleSelect, handleDate, handleTime } = useImageForm();
  const { toast } = useToast();
  const { handleSubmit, loading, error } = useDownloadImagesFetch(toast);

  return (
    <form onSubmit={(e) => handleSubmit(e, imagesForm)}>
      <div className="flex flex-col space-y-4 w-[90%] mx-auto">
        <ContainerInput>
          <Label htmlFor="group" label="Selecciona un contacto" />
          <SelectGroups
            selectValue={imagesForm.group}
            handleSelect={handleSelect}
          />
        </ContainerInput>
        <div className="flex justify-between border-solid border-1 border-gray-500 rounded-xl">
          <DateAndTimeInputs
            legend="Inicio de búsqueda"
            labelDate="Fecha de inicio"
            labelTime="Hora de inicio"
            date={imagesForm.initialDate}
            dateKey="initialDate"
            handleDate={handleDate}
            time={imagesForm.initialTime}
            timeKey="initialTime"
            handleTime={handleTime}
          />
          <DateAndTimeInputs
            legend="Fin de búsqueda"
            labelDate="Fecha final"
            labelTime="Hora final"
            date={imagesForm.endDate}
            dateKey="endDate"
            handleDate={handleDate}
            time={imagesForm.endTime}
            timeKey="endTime"
            handleTime={handleTime}
          />
        </div>

        {error && (
          <div className="w-full my-2 text-red-600 flex justify-center">
            <span>{error}</span>
          </div>
        )}

        <button
          type="submit"
          className="bg-primary text-white py-3 rounded-md w-72 mx-auto disabled:cursor-progress"
          disabled={loading}
        >
          {loading ? (
            <div className="w-full mx-aut flex justify-center">
              <img src="/src/assets/loader.gif" className="w-5 h-5" />
            </div>
          ) : (
            <span>Descargar</span>
          )}
        </button>
        <Toaster />
      </div>
    </form>
  );
};
