export const dynamic = 'force-dynamic';
export const revalidate = 0;

import { NewTodoServer } from "@/src/components/todos/NewTodoServer"
import { TodosGrid } from "@/src/components/todos/TodosGrid"
import prisma from "@/src/lib/prisma"
import { Metadata } from "next"

export const metadata: Metadata = {
  title: 'Listado de Tareas SERVER ACTIONS',
  description: 'TODOS SERVER ACTIONS'
}

export default async function ServerActionsPage() {


  const todos = await prisma.todo.findMany({
    orderBy: { description: 'asc' }
  });

  return (
    <div>
      <div className="w-full px-3 mx-5 mb-5">
        <NewTodoServer />
      </div>

      <TodosGrid todos={todos} />
    </div>
  );
}