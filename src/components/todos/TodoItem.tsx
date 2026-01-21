/**
 * ⚡ COMPONENTE TODO ITEM CON UI OPTIMISTA
 * Este componente se encarga de mostrar cada tarea individual y gestionar
 * el cambio de estado (check/uncheck) de forma instantánea.
 */
'use client';

import { IoCheckboxOutline, IoSquareOutline } from "react-icons/io5"
import { Todo } from "@/app/generated/prisma/client"
import styleTodoItem from './TodoItem.module.css'
import { startTransition, useOptimistic } from "react"

interface Props {
  todo: Todo;
  // Acción que viene desde el componente padre (Server Action)
  toggleTodo: (id: string, complete: boolean) => Promise<Todo | void>
}

export const TodoItem = ({ todo, toggleTodo }: Props) => {

  /**
   * 🧠 HOOK: useOptimistic
   * Nos permite mostrar un estado diferente mientras una acción asíncrona (Server Action) está en curso.
   * * @param todo - El estado inicial real (el que viene de la base de datos).
   * @param (state, newValue) - Función reductora que define cómo se verá el estado temporal.
   */
  const [todoOptimistico, toggleTodoOptimistic] = useOptimistic(
    todo, 
    (state, newValue: boolean) => ({ ...state, complete: newValue })
  );

  /**
   * 🔄 Manejador del Toggle
   * Combina la actualización visual inmediata con la persistencia en el servidor.
   */
  const onToggleTodo = async () => {
    try {
      // 1. startTransition es necesario para envolver actualizaciones optimistas.
      // Indica a React que esta actualización es una transición de UI.
      startTransition(() => {
        // Ejecutamos el cambio visual INMEDIATAMENTE.
        toggleTodoOptimistic(!todoOptimistico.complete);
      })

      // 2. Ejecutamos la acción real en el servidor (esto tarda, por ejemplo, los 3 segundos de tu 'sleep').
      await toggleTodo(todoOptimistico.id, !todoOptimistico.complete);

    } catch (error) {
      // 3. Si algo falla, revertimos el estado optimista.
      startTransition(() => {
        toggleTodoOptimistic(!todoOptimistico.complete);
      })
    }
  }

  return (
    // Usamos 'todoOptimistico' para las clases y el renderizado, no el 'todo' de las Props.
    <div className={todoOptimistico.complete ? styleTodoItem.todoDone : styleTodoItem.todoPending}>
      <div className="flex flex-col sm:flex-row justify-start items-center gap-4">

        <div
          onClick={onToggleTodo}
          className={`
            flex p-2 rounded-md cursor-pointer
            hover:bg-opacity-60
            ${todoOptimistico.complete ? 'bg-blue-100' : 'bg-red-100'}
          `}>
          {
            todoOptimistico.complete
              ? <IoCheckboxOutline size={30} />
              : <IoSquareOutline size={30} />
          }
        </div>

        <div className="text-center sm:text-left">
          {todoOptimistico.description}
        </div>
      </div>
    </div>
  )
}


/**
 * =============================================================================
 * 📘 EXPLICACIÓN TÉCNICA: EL HOOK useOptimistic
 * =============================================================================
 * * ¿QUÉ ES?
 * Es un hook de React diseñado para mejorar la "Experiencia de Usuario" (UX) 
 * permitiendo mostrar un estado temporal en la interfaz ANTES de que el 
 * servidor responda a una acción asíncrona (como un Server Action).
 * * 🛠️ ANATOMÍA DEL HOOK:
 * const [state, addOptimistic] = useOptimistic(paso1, paso2);
 * * 1. El estado inicial (todo): El valor real que viene de la base de datos.
 * 2. La función actualizadora: (state, newValue) => { ... } 
 * Define CÓMO debe verse el estado mientras la acción está "en vuelo".
 * * ⚙️ FLUJO DE TRABAJO EN ESTE COMPONENTE:
 * * 1. DISPARO (startTransition):
 * Se llama a toggleTodoOptimistic(!todoOptimistico.complete). 
 * En este microsegundo, la UI cambia visualmente (el check se marca/desmarca).
 * * 2. EJECUCIÓN ASÍNCRONA:
 * Se ejecuta 'await toggleTodo(...)'. Mientras el servidor procesa (tus 3 seg
 * de delay), el usuario ya ve el cambio aplicado. No hay "lag" visual.
 * * 3. RESOLUCIÓN:
 * - ÉXITO: El Server Action termina, Next.js hace 'revalidatePath' y los 
 * nuevos datos reales llegan al componente. React descarta el estado 
 * optimista y usa el real (que ahora coincide).
 * - ERROR: Si la promesa falla, React detecta que el estado real nunca 
 * cambió y AUTOMÁTICAMENTE revierte la interfaz al valor original.
 * * 🎯 BENEFICIO PRINCIPAL:
 * Convierte una aplicación web tradicional (esperar -> ver cambio) en una 
 * aplicación reactiva e instantánea (ver cambio -> confirmar en servidor).
 * * ⚠️ REQUISITO:
 * Las actualizaciones optimistas DEBEN estar envueltas en 'startTransition'
 * para que React pueda gestionar la prioridad de renderizado correctamente.
 * =============================================================================
 */