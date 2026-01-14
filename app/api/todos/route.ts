import prisma from "@/src/lib/prisma";
import { NextResponse } from "next/server";
import * as yup from "yup";

/**
 * GET: Obtener lista de TODOS con paginación
 */
export async function GET(request: Request) {
  // 1. Extraemos parámetros de la URL (ej: ?take=5&skip=0)
  const { searchParams } = new URL(request.url);
  const take = Number(searchParams.get("take") ?? "10");
  const skip = Number(searchParams.get("skip") ?? "0");

  // 2. Validamos que sean números válidos
  if (isNaN(take)) return NextResponse.json({ message: "Take debe ser número" }, { status: 400 });
  if (isNaN(skip)) return NextResponse.json({ message: "Skip debe ser número" }, { status: 400 });

  // 3. Consultamos la DB usando Prisma
  const todos = await prisma.todo.findMany({ take, skip });

  return NextResponse.json(todos);
}

// 🛡️ Esquema de validación para creación
const postSchema = yup.object({
  description: yup.string().required(),
  complete: yup.boolean().optional().default(false),
});

/**
 * POST: Crear un nuevo TODO
 */
export async function POST(request: Request) {
  try {
    // 1. Validamos el body contra el esquema de Yup
    const { complete, description } = await postSchema.validate(await request.json());

    // 2. Creamos el registro en la DB
    const todo = await prisma.todo.create({ data: { complete, description } });

    return NextResponse.json(todo);
  } catch (error) {
    // Si la validación falla, enviamos el error
    return NextResponse.json(error, { status: 400 });
  }
}