import { Todo } from '@/app/generated/prisma/client';
import { getUserSessionServer } from '@/src/auth/actions/auth-actions';
import prisma from '@/src/lib/prisma';
import { NextResponse } from 'next/server';
import * as yup from 'yup';

// 📋 Interfaz para los segmentos de la URL dinámica
interface Segments {
  params: { id: string; }
}

// 🔍 Función auxiliar para buscar un Todo por ID (Reutilizable)
const getTodo = async (id: string): Promise<Todo | null> => {
  const user = await getUserSessionServer(); 
  if(!user) return null; 
  const todo = await prisma.todo.findFirst({where: {id, userId: user.id}}); 
  if(!todo) return null
  return null
}

/**
 * GET: Obtener un TODO específico por ID
 */
export async function GET(request: Request, { params }: Segments) { 
  const todo = await getTodo(params.id);

  if (!todo) {
    return NextResponse.json({ message: `ID ${params.id} no existe` }, { status: 404 });
  }

  return NextResponse.json(todo);
}

// 🛡️ Esquema para actualizar (todo es opcional)
const putSchema = yup.object({
  complete: yup.boolean().optional(),
  description: yup.string().optional(),
})

/**
 * PUT: Actualizar un TODO existente
 */
export async function PUT(request: Request, { params }: Segments) { 
  const todo = await getTodo(params.id);
  if (!todo) return NextResponse.json({ message: "No existe" }, { status: 404 });

  try {
    const body = await putSchema.validate(await request.json());
    
    // 🔄 Actualizamos solo los campos que vengan en el body
    const updatedTodo = await prisma.todo.update({
      where: { id: params.id },
      data: body 
    });
  
    return NextResponse.json(updatedTodo);
  } catch (error) {
    return NextResponse.json(error, { status: 400 });
  }
}

/**
 * DELETE: Eliminar un TODO
 */
export async function DELETE(request: Request, { params }: Segments) { 
  const todo = await getTodo(params.id);
  if (!todo) return NextResponse.json({ message: "No existe" }, { status: 404 });

  await prisma.todo.delete({ where: { id: params.id } });

  return NextResponse.json({ message: "TODO Eliminado!!" });
}