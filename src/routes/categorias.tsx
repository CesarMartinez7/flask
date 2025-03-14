import { useEffect, useState, useRef } from "react";
import { Response } from "../types/response";
import { Data } from "../types/response";

export default function Categorias() {
  const [data, setData] = useState<Response>();
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [selectedCategory, setSelectedCategory] = useState<Data | null>(null); 
  const inputRefDescripcion = useRef<HTMLInputElement>(null);
  const inputRefNombre = useRef<HTMLInputElement>(null);

  const handleClickDelete = ({
    id_categoria,
    estado,
  }: {
    id_categoria: number;
    estado: number;
  }) => {
    fetch("http://127.0.0.1:5000/cambiar_estado_categorias", {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        estado: estado,
        id_categoria: id_categoria,
      }),
    })
      .then((response) => response.json())
      .then((json) => console.log(json))
      .catch((err) => console.log(err));
  };

  const handleUpdateCategoria = (object: Data) => {
    fetch("http://127.0.0.1:5000/actualizar_categorias", {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        nombre: object.nombre,
        descripcion: object.descripcion,
        id_categoria: object.id_categoria,
      }),
    })
      .then((response) => response.json())
      .then((json) => console.log(json))
      .catch((err) => console.log(err));
  };

  // Petición para cargar las categorías
  useEffect(() => {
    fetch("http://127.0.0.1:5000/categorias")
      .then((response) => response.json())
      .then((data) => setData(data));
  }, []);

  const handleModalOpen = (index: number) => {
    setSelectedCategory(data?.data[index] || null);
    setIsModalOpen(true);
  };

  const handleModalClose = () => {
    setIsModalOpen(false);
    setSelectedCategory(null);
  };

  // Si tenemos data, renderizamos
  if (data) {
    return (
      <main className="flex flex-col gap-2">
        <div className="flex justify-end">
          <button className="btn">Crear Categoria</button>
        </div>
        <div className="flex gap-2 flex-col">
          {data.data.map((item, index) => (
            <div
              key={item.id_categoria}
              className="flex flex-row rounded-md p-3 border-base-200 border justify-between"
            >
              <div>
                <p className="font-semibold text-xl uppercase">{item.nombre}</p>
                <p className="font-light text-xs">{item.descripcion}</p>
              </div>
              <div className="flex flex-row gap-2">
                <div>
                  <button
                    className="btn btn-neutral"
                    onClick={() => {
                      handleClickDelete({
                        id_categoria: item.id_categoria,
                        estado: 2,
                      });
                    }}
                  >
                    Eliminar
                  </button>
                </div>
                <div>
                  <button
                    className="btn"
                    onClick={() => handleModalOpen(index)}
                  >
                    Actualizar
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Modal */}
        {isModalOpen && selectedCategory && (
          <dialog open className="modal">
            <div className="modal-box">
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  if (
                    inputRefDescripcion.current?.value &&
                    inputRefNombre.current?.value
                  ) {
                    handleUpdateCategoria({
                      descripcion: inputRefDescripcion.current.value,
                      id_categoria: selectedCategory.id_categoria,
                      nombre: inputRefNombre.current.value,
                    });
                  }
                  handleModalClose();
                }}
              >
                <button className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2">
                  ✕
                </button>
                <h3 className="font-bold text-lg uppercase">
                  {selectedCategory.nombre}
                </h3>
                <p>{selectedCategory.descripcion}</p>
                <input
                  ref={inputRefNombre}
                  type="text"
                  defaultValue={selectedCategory.nombre}
                  className="input w-full"
                />
                <input
                  ref={inputRefDescripcion}
                  type="text"
                  defaultValue={selectedCategory.descripcion}
                  className="input w-full"
                />
                <button className="btn btn-neutral">Enviar</button>
              </form>
            </div>
          </dialog>
        )}
      </main>
    );
  }

  return <div>Loading...</div>;
}
