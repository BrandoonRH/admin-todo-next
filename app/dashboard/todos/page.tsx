import { getUserSessionServer } from "@/src/auth/actions/auth-actions"
import { NewTodo } from "@/src/components/todos/NewTodo"
import { TodosGrid } from "@/src/components/todos/TodosGrid"
import prisma from "@/src/lib/prisma"
import { Metadata } from "next"

export const metadata: Metadata = {
  title: 'Listado de Tareas',
  description: 'Página de gestión de tareas'
}

/**
 * EXPLICACIÓN: ¿Por qué consulta directa?
 * Al ser un SERVER COMPONENT:
 * 1. Seguridad: Las credenciales de la BD nunca viajan al cliente.
 * 2. Rendimiento: Cero latencia de red (el servidor está al lado de la BD).
 * 3. Menos código: No necesitas useEffect ni estados de carga inicial.
 */
export default async function TodosPage() {

    const user = await getUserSessionServer(); 
  // Consultamos la BD directamente antes de renderizar el HTML
  const todos = await prisma.todo.findMany({
    orderBy: { description: 'asc' },
    where: {
      userId: user?.id
    }
  });

  return (
    <div>
      <div className="w-full px-3 mx-5 mb-5">
        <NewTodo />
      </div>
      {/* Pasamos los datos ya obtenidos a los componentes hijos */}
      <TodosGrid todos={todos} />
    </div>
  );
}