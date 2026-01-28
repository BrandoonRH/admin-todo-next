/**
 * 🚀 SERVER ACTIONS - Next.js
 * * La directiva "use server" al inicio le indica a Next.js que todas las funciones
 * exportadas en este archivo son acciones del servidor. 
 * Esto significa que se ejecutan EXCLUSIVAMENTE en el servidor y pueden ser
 * llamadas desde componentes de cliente sin necesidad de configurar una API REST manual.
 */
"use server";

import { Todo } from "@/app/generated/prisma/client";
import prisma from "../lib/prisma";
import { revalidatePath } from "next/cache";

/**
 * ⏳ Helper: sleep
 * Función de utilidad para simular latencia de red.
 * Se usa para probar cómo reacciona la UI (como useOptimistic) ante esperas largas.
 */
const sleep = (seconds: number = 0): Promise<boolean> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(true);
    }, seconds * 1000);
  });
};

/**
 * ✅ toggleTodo
 * Cambia el estado (completado/pendiente) de una tarea.
 * * @param id - El identificador único del TODO.
 * @param isCompleted - El nuevo estado que queremos asignar.
 * @returns El objeto Todo actualizado.
 */
export const toggleTodo = async (
  id: string,
  isCompleted: boolean,
): Promise<Todo> => {
  
  // ⏱️ Forzamos una espera de 3 segundos para probar la UI optimista.
  await sleep(3);

  // 1. Buscamos el registro en la base de datos a través de Prisma.
  const todo = await prisma.todo.findFirst({ where: { id } });

  // 🛡️ Validación de existencia.
  if (!todo) {
    throw "No existe el TODO con el ID: " + id;
  }

  // 2. Realizamos la actualización en la DB.
  const updateTodo = await prisma.todo.update({
    where: { id: id },
    data: { complete: isCompleted },
  });

  /**
   * 🔄 REVALIDACIÓN DE CACHÉ
   * Este es el paso más importante. Next.js cachea las páginas por defecto.
   * revalidatePath le dice a Next que los datos en la ruta especificada ya no son válidos.
   * Al hacerlo, Next vuelve a renderizar el Server Component y envía los datos nuevos al cliente.
   */
  revalidatePath("/dashboard/server-todos");
  
  return updateTodo;
};

/**
 * ➕ addTodo
 * Crea una nueva tarea en la base de datos.
 * * @param description - El texto de la tarea.
 */
export const addTodo = async (description: string, userId: string) => {
  try {
    // 1. Creamos el registro indicando que por defecto no está completado.
    const todo = await prisma.todo.create({
      data: { complete: false, description, userId},
    });

    // 🔄 Notificamos el cambio para refrescar la lista en pantalla.
    revalidatePath("/dashboard/server-todos");
    
    return todo;
  } catch (error) {
    return {
      message: "Error al Crear el Todo",
    };
  }
};

/**
 * 🗑️ deleteCompleted
 * Elimina de forma masiva todos los registros que tengan 'complete: true'.
 */
export const deleteCompleted = async () => {
  try {
    // 1. Ejecutamos un borrado masivo con Prisma.
    await prisma.todo.deleteMany({
      where: {
        complete: true,
      },
    });

    // 🔄 Refrescamos la vista del servidor.
    revalidatePath("/dashboard/server-todos");
    
  } catch (error) {
    return {
      message: "Error al intentar eliminar los completados",
    };
  }
};