import { PrismaClient, Prisma } from "../app/generated/prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import bcrypt from "bcryptjs";
import "dotenv/config";

// 🔌 Configuración de la conexión con el adaptador de PostgreSQL
const adapter = new PrismaPg({
  connectionString: process.env.DATABASE_URL,
});

const prisma = new PrismaClient({ adapter });

// 📝 Datos de ejemplo para Usuarios
const userData: Prisma.UserCreateInput[] = [
  { id: "5d29f619-0f0f-42a3-ba12-a73bbfee19a6", name: "Alice", email: "alice@prisma.io", password: bcrypt.hashSync("admin123") },
];

// 📝 Datos de ejemplo para Todos (Tareas)
// Usamos Prisma.TodoCreateManyInput que NO incluye relaciones anidadas
const todoData: Prisma.TodoCreateManyInput[] = [
  { 
    description: "Aprender Next.js con Prisma", 
    userId: "5d29f619-0f0f-42a3-ba12-a73bbfee19a6" // ID directo, no relación anidada
  },
  {
    description: "Aprender Ingles", 
    userId: "5d29f619-0f0f-42a3-ba12-a73bbfee19a6" 
  },
  {
    description: "Aprender Mate", 
    userId: "5d29f619-0f0f-42a3-ba12-a73bbfee19a6" 
  },

];

export async function main() {
  try {
    console.log("🧹 1. Limpiando la base de datos...");
    // Borramos datos existentes para evitar duplicados al re-ejecutar el seed
    // El orden importa si hay relaciones entre tablas (primero hijos, luego padres)
    await prisma.todo.deleteMany();
    await prisma.user.deleteMany();

    console.log("👤 2. Insertando usuarios...");
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