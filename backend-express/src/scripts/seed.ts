import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
  const email = 'jose@app.com'
  const existing = await prisma.user.findUnique({ where: { email } })

  if (existing) {
    console.log(`✓ Usuario "${email}" ya existe. No se creó duplicado.`)
    return
  }

  const rounds = 10
  const hashedPassword = await bcrypt.hash('123456', rounds)

  const user = await prisma.user.create({
    data: { email, password: hashedPassword, name: 'Jose' },
  })

  console.log(`✓ Usuario creado: ${user.email} (id: ${user.id})`)

  // Crear categorías por defecto
  const defaultCategories = [
    { name: 'Alimentación', color: '#f97316', icon: 'Utensils' },
    { name: 'Transporte', color: '#3b82f6', icon: 'Car' },
    { name: 'Vivienda', color: '#8b5cf6', icon: 'Home' },
    { name: 'Servicios', color: '#eab308', icon: 'Zap' },
    { name: 'Salud', color: '#ef4444', icon: 'Heart' },
    { name: 'Entretenimiento', color: '#ec4899', icon: 'Gamepad2' },
    { name: 'Educación', color: '#06b6d4', icon: 'GraduationCap' },
    { name: 'Compras', color: '#10b981', icon: 'ShoppingCart' },
    { name: 'Otros', color: '#6b7280', icon: 'MoreHorizontal' },
  ]

  for (const cat of defaultCategories) {
    await prisma.category.create({ data: { ...cat, userId: user.id } })
  }

  console.log(`✓ ${defaultCategories.length} categorías por defecto creadas.`)
  console.log('\n🎉 Seed completado. Puedes ingresar con:')
  console.log('   Email:    jose@app.com')
  console.log('   Password: 123456')
}

main()
  .catch((e) => {
    console.error('Error en seed:', e)
    process.exit(1)
  })
  .finally(() => prisma.$disconnect())
