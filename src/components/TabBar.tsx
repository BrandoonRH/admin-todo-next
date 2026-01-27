/**
 * 💻 CLIENT COMPONENT: TabBar
 * Necesitamos 'use client' porque manejamos eventos de clic y estado local.
 */
'use client';

import { setCookie } from "cookies-next"; // Librería útil para manejar cookies en el cliente
import { useRouter } from "next/navigation";
import { useState } from "react";

interface Props {
  currentTab?: number;
  tabOptions?: number[];
}

export const TabBar = ({ tabOptions = [1, 2, 3, 4], currentTab = 1 }: Props) => {

  const router = useRouter();
  
  // Inicializamos el estado con el valor que viene del servidor (la cookie)
  const [selected, setSelected] = useState(currentTab);

  /**
   * 🖱️ Al seleccionar una pestaña:
   * 1. Actualizamos el estado visual (UI).
   * 2. Grabamos la cookie en el navegador.
   * 3. Refrescamos la ruta para que el servidor se entere del cambio.
   */
  const onTabSelected = (tab: number) => {
    setSelected(tab);
    
    // Guardamos la cookie. Por defecto, estas cookies duran la sesión 
    // a menos que les pongas una fecha de expiración.
    setCookie('selectedTab', tab.toString());
    
    // IMPORTANTE: router.refresh() hace que Next.js pida de nuevo el Server Component
    // permitiendo que el layout y la página lean la nueva cookie.
    router.refresh();
  }

  return (
    <div className="grid w-full space-x-2 rounded-xl bg-gray-200 p-2 grid-cols-4">
      {
        tabOptions.map(tab => (
          <div key={tab}>
            <input 
              checked={selected === tab}
              onChange={() => {}} // Input controlado visualmente por el estado
              type="radio" 
              id={tab.toString()} 
              className="peer hidden" 
            />
            <label 
              onClick={() => onTabSelected(tab)}
              className="transition-all block cursor-pointer select-none rounded-xl p-2 text-center peer-checked:bg-blue-500 peer-checked:font-bold peer-checked:text-white"
            >
              {tab}
            </label>
          </div>
        ))
      }
    </div>
  )
}


/* 
! El ciclo de vida de este ejemplo:
*   Navegador: El usuario hace clic en el Tab 3.
*   Cliente (onTabSelected): Se ejecuta setCookie('selectedTab', '3') y luego router.refresh().
*   Servidor (CookiesPage): Next.js detecta el refresco, lee la cookie actualizada '3' y genera el HTML con el TabBar ya marcado en el 3.
*   Resultado: La UI se siente sólida y persistente sin haber tocado una base de datos.
*/