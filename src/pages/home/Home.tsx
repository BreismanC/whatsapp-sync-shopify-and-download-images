import { Button } from "@/components/ui/button";
import { WhatsappConnector } from "./componentes";
import { Link } from "react-router";

export const Home = () => {
  return (
    <main className="bg-slate-100 h-min-screen flex flex-col items-center justify-center helvetica sans-serif max-w-sm mx-auto my-24 text-center rounded-lg shadow-lg">
      <header className="bg-[#03773f] py-5 font-bold text-xl text-white text-center w-full rounded-t-lg">
        <h1>Autenticación en Whatsapp</h1>
      </header>
      <section className="p-5">
        <WhatsappConnector />
      </section>

      <section>
        <Button className="w-full my-4">
          <Link to="/download-images">Descargar imágenes</Link>
        </Button>
      </section>
    </main>
  );
};
