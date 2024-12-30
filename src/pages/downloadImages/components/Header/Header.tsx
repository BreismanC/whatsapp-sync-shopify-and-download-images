import { Link } from "react-router";

export const Header = () => {
  return (
    <header>
      <nav className="w-full flex flex-wrap items-center justify-between px-2 py-8 navbar-expand-lg bg-primary text-white">
        <div className="container px-4 mx-auto flex flex-wrap items-center justify-between">
          <div className="w-full relative flex justify-between lg:w-auto lg:static lg:block lg:justify-start ">
            <a className="text-xl font-bold leading-relaxed inline-block mr-4 py-2 whitespace-nowrap uppercase text-white">
              Descargar imagenes de Whatsapp
            </a>
          </div>
          <div
            className="lg:flex flex-grow items-center lg:bg-opacity-0 lg:shadow-none hidden text-primary"
            id="example-collapse-navbar"
          >
            <ul className="flex flex-col lg:flex-row list-none lg:ml-auto items-center">
              <li className="flex items-center">
                <Link
                  to="/"
                  className="bg-white text-blueGray-700 active:bg-blueGray-50 text-lg font-bold px-10 py-2 rounded shadow hover:shadow-md outline-none focus:outline-none lg:mr-1 lg:mb-0 ml-3 mb-3 ease-linear transition-all duration-150"
                >
                  Inicio
                </Link>
              </li>
            </ul>
          </div>
        </div>
      </nav>
    </header>
  );
};
