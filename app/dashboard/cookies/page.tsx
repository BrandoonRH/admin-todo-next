/**
 * 🏢 SERVER COMPONENT: CookiesPage
 * Aquí leemos la cookie directamente desde las cabeceras de la petición.
 */
import { TabBar } from "@/src/components/TabBar";
import { Metadata } from "next";
import { cookies } from "next/headers"; // Función de Next para acceder a cookies en el servidor
//? https://nextjs.org/docs/app/api-reference/functions/cookies 🌐🔗

export const metadata: Metadata = {
  title: 'Cookies Page',
  description: 'Manejo de cookies en el servidor'
}

export default function CookiesPage() {
  
  // 1. Obtenemos el repositorio de cookies
  const cookieStore = cookies();
  
  // 2. Intentamos obtener la cookie 'selectedTab'. 
  // Si no existe, usamos '1' como valor por defecto.
  const cookieTab = cookieStore.get('selectedTab')?.value ?? '1';

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
      <div className="flex flex-col">
        <span className="text-3xl mb-2">Tabs (Persistentes)</span>
        
        {/* Pasamos el valor de la cookie al componente de cliente.
            Usamos el símbolo '+' para convertir el string de la cookie en un número.
        */}
        <TabBar currentTab={ +cookieTab } />
      </div>
    </div>
  );
}