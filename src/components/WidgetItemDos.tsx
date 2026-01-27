interface Props {
  title: string;           // Título del widget
  children: React.ReactNode; // Contenido dinámico que se renderiza dentro
}

/**
 * Componente de contenedor reutilizable para mostrar información
 * en un cuadro con estilo uniforme.
 * 
 * Usado aquí para el resumen de pago, pero puede servir para cualquier widget.
 */
export const WidgetItemDos = ({ title, children }: Props) => {
  return (
    <div className="md:col-span-2 lg:col-span-1">
      {/* Tarjeta con borde y fondo blanco */}
      <div className="h-full py-8 px-6 space-y-6 rounded-xl border border-gray-200 bg-white">
        <div className="flex flex-col">
          {/* Título centrado */}
          <h5 className="text-xl text-gray-600 text-center">{title}</h5>

          {/* Contenido dinámico (lo que se pase entre las etiquetas del componente) */}
          <div className="mt-2 flex flex-col justify-center gap-4">
            {children}
          </div>
        </div>
      </div>
    </div>
  )
}