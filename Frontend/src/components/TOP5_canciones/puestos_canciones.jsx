import React from "react";
export default function Puestos({ canciones }) {
  return <div id="profile">{Item(canciones)}</div>;
}

function Item(data) {
  return (
    <>
      <div class="flex h-screen-full w-screen-full bg-black">
        <div class="m-auto content-center">
          <h1 class="mb-6 text-3xl font-extrabold dark:text-white md:text-5xl lg:text-6xl">
            <span class="animate-gradient text-transparent bg-300% bg-clip-text bg-gradient-to-r to-silver via-purple from-lightPurple">
              TOP 5 CANCIONES
            </span>
          </h1>
          <table class="table-auto bg-gradient-to-b from-black2 rounded-lg shadow sm:p-8 dark:bg-gradient-to-b from-purple to-95% dark:border-purple shadow-[0_35px_60px_-15px_rgba(255,255,255,0.5)] ">
            <thead>
              <tr>
                <th class="align-center py-4">
                  <h5 class="text-xl font-bold leading-none text-gray-900 dark:text-white">
                    Puesto
                  </h5>
                </th>
                <th class="align-center"></th>
                <th class="align-center">
                  <h5 class="text-xl font-bold leading-none text-gray-900 dark:text-white">
                    Nombre
                  </h5>
                </th>
                <th class="px-10">
                  <h5 class="text-xl font-bold leading-none text-gray-900 dark:text-white">
                    Reproducciones
                  </h5>
                </th>
              </tr>
            </thead>
            <tbody>
              {data.map((value, index) => (
                <tr>
                  <td class="px-10 text-center">
                    <p class="text-2xl font-medium text-gray-900 truncate dark:text-silver">
                      {index + 1}
                    </p>
                  </td>
                  <td class="px-10 py-6">
                    {" "}
                    <img
                      class="w-24 h-24 rounded-md"
                      src={value.path_imagen}
                      alt="artista"
                    ></img>
                  </td>
                  <td class="px-10 py-6 text-center">
                    <p class="text-sm font-medium text-gray-900 truncate dark:text-white">
                      {value.nombre}
                    </p>
                  </td>
                  <td class="text-right px-10 py-6 ">
                    <p class="text-sm font-medium text-gray-900 truncate dark:text-white">
                      {value.reproducciones}
                    </p>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
}
