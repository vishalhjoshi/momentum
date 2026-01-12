// Simple script to check table existence
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
    console.log('Checking database connection and tables...')
    try {
        const tableResult = await prisma.$queryRaw`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public' 
      ORDER BY table_name;
    `
        console.log('--- TABLES IN DB (public schema) ---')
        console.table(tableResult)
        console.log('--------------------')

        const schemaResult = await prisma.$queryRaw`
      SELECT schema_name 
      FROM information_schema.schemata;
    `
        console.log('--- SCHEMAS FOUND ---')
        console.table(schemaResult)
        console.log('---------------------')

        // Check specifically for users table
        interface TableResult {
            table_name: string
        }
        const tables = (tableResult as TableResult[]).map(t => t.table_name)
        if (tables.includes('users')) {
            console.log('SUCCESS: "users" table exists.')

            // Check user count
            const userCount = await prisma.user.count()
            console.log(`User count: ${userCount}`)
        } else {
            console.error('ERROR: "users" table MISSING!')
            process.exit(1)
        }

    } catch (e) {
        console.error('Database check failed:', e)
        process.exit(1)
    } finally {
        await prisma.$disconnect()
    }
}

main()
