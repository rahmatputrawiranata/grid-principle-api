import { PrismaClient } from "@internal/prisma-mysql/client";
import * as bcrypt from 'bcrypt';
const prisma = new PrismaClient({});

async function main() {
    await userSeeder()
}

main( )
    .then(async() => {
        await prisma.$disconnect()
    })
    .catch(async(e) => {
        console.error(e)
        await prisma.$disconnect()
        process.exit(1)
    })

 async function userSeeder() {
    await prisma.user.upsert({
        where: {
            email: 'user@mail.cc'
        },
        update: {},
        create: {
            email: 'user@mail.cc',
            password: await bcrypt.hash('password', 10),
            name: 'User'
        }
    })
 }