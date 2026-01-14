import { PrismaClient, Prisma } from "../app/generated/prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import "dotenv/config";

// 🔌 Configuración de la conexión con el adaptador de PostgreSQL
const adapter = new PrismaPg({
  connectionString: process.env.DATABASE_URL,
});

const prisma = new PrismaClient({ adapter });

// 📝 Datos de ejemplo para Usuarios
const userData: Prisma.UserCreateInput[] = [
  { name: "Alice", email: "alice@prisma.io" },
  { name: "Bob", email: "bob@prisma.io" },
];

// 📝 Datos de ejemplo para Todos (Tareas)
const todoData: Prisma.TodoCreateInput[] = [
  { description: "Aprender Next.js con Prisma" },
  { description: "Configurar el primer Seed", complete: true },
  { description: "Dominar los Server Actions" },
  { description: "Publicar en Vercel", complete: false },
];

export async function main() {
  try {
    console.log("🧹 1. Limpiando la base de datos...");
    // Borramos datos existentes para evitar duplicados al re-ejecutar el seed
    // El orden importa si hay relaciones entre tablas (primero hijos, luego padres)
    await prisma.todo.deleteMany();
    await prisma.user.deleteMany();

    console.log("👤 2. Insertando usuarios...");
    /**
     * MODO EFICIENTE: createMany
     * En lugar de un 'for' que hace 10 llamadas a la DB, 
     * createMany envía una sola instrucción SQL con todos los registros.
     */
    await prisma.user.createMany({
      data: userData,
      skipDuplicates: true, // Evita errores si un registro ya existe
    });

    console.log("✅ 3. Insertando tareas (Todos)...");
    await prisma.todo.createMany({
      data: todoData,
    });

    console.log("✨ ¡Seed finalizado con éxito!");
  } catch (error) {
    console.error("❌ Error en el proceso de Seeding:", error);
    process.exit(1);
  } finally {
    // 🔒 Cerramos la conexión para liberar recursos
    await prisma.$disconnect();
  }
}

main();