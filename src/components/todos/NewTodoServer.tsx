/**
 * 🎨 COMPONENTE DE CLIENTE: NewTodoServer
 * Usamos 'use client' porque necesitamos interactividad:
 * 1. Manejo de estado local (useState) para el input.
 * 2. Manejo de eventos (onSubmit, onClick).
 */
'use client';

import { FormEvent, useState } from 'react';
import { IoTrashOutline } from 'react-icons/io5';

// ⚡ Importamos los Server Actions directamente como si fueran funciones locales
import { addTodo, deleteCompleted } from '@/src/actions/todo-action';
import * as todosApi from '@/src/helpers/todos';

export const NewTodoServer = () => {
  // Estado para controlar lo que el usuario escribe en el input
  const [description, setDescription] = useState('');

  /**
   * 📝 onSubmit: Manejador para crear un nuevo TODO
   */
  const onSubmit = async (e: FormEvent) => {
    e.preventDefault();
    
    // Validación básica: evitar descripciones vacías
    if (description.trim().length === 0) return;

    // 🔥 Llamada al Server Action 'addTodo'
    // Next.js se encarga de hacer la petición POST al servidor por detrás.
    /* await addTodo(description); */

    await todosApi.createTodo(description)
    
    // Limpiamos el input después de crear la tarea
    setDescription('');
  }

  return (
    <form onSubmit={onSubmit} className='flex w-full'>
      <input 
        type="text"
        onChange={(e) => setDescription(e.target.value)}
        value={description}
        className="w-6/12 -ml-10 pl-3 pr-3 py-2 rounded-lg border-2 border-gray-200 outline-none focus:border-sky-500 transition-all"
        placeholder="¿Qué necesita ser hecho?" 
      />

      <button 
        type='submit' 
        className="flex items-center justify-center rounded ml-2 bg-sky-500 p-2 text-white hover:bg-sky-700 transition-all"
      >
        Crear
      </button>

      {/* Espaciador flexible */}
      <span className='flex flex-1'></span>

      <button
        /**
         * ⚠️ NOTA TÉCNICA IMPORTANTE:
         * Usamos () => deleteCompleted() en lugar de pasar la referencia directa.
         * ¿Por qué? 
         * Si usamos onClick={deleteCompleted}, React pasa automáticamente el objeto del evento (Event) 
         * como primer argumento. Los Server Actions solo aceptan argumentos "serializables" 
         * (objetos planos, strings, números). Un objeto de evento tiene métodos y prototipos 
         * complejos que no se pueden enviar por la red al servidor.
         */
        onClick={() => deleteCompleted()}
        type='button' 
        className="flex items-center justify-center rounded ml-2 bg-red-400 p-2 text-white hover:bg-red-700 transition-all"
      >
        <IoTrashOutline />
        <span className='ml-2'>Borrar completados</span>
      </button>
    </form>
  )
}