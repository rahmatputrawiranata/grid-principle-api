import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

async function main() {
    await bookSeeder()
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

 async function bookSeeder() {
    await prisma.book.createMany({
        data: [
            {
                title: 'Book 1',
                author: 'Author 1',
            }
        ]
    })
 }