import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import { ImagesForm } from "../ImagesForm/ImagesForm";

export const CardForm = () => {
  return (
    <Card className="w-full max-w-screen-lg">
      <CardHeader>
        <CardTitle className="text-bold text-center text-2xl mb-5">
          Descargar imagenes de whatsapp
        </CardTitle>
        <CardDescription className="text-base">
          Selecciona un grupo y un rango de fechas en las que deseas realizar la
          descarga.
        </CardDescription>
      </CardHeader>
      <Separator />
      <CardContent className="my-5">
        <ImagesForm />
      </CardContent>
    </Card>
  );
};

const Separator = () => {
  return (
    <div className="w-[98%] mx-auto">
      <hr />
    </div>
  );
};
