import getCurrentUser from "@/app/actions/getCurrentUser"
import { NextResponse } from "next/server"
import prisma from "@/app/libs/prismadb"

export async function POST(
    request: Request
)  {
    try {
        const currentUsser = await getCurrentUser()

        const body = await request.json()

        const {
            name,
            image
        } = body

        if(!currentUsser){
            return new NextResponse('Un-Authorized ', {status:401})
        }

        const updatedUser = await prisma.user.update({
            where:{
                id: currentUsser.id
            },
            data: {
                image: image,
                name: name
            }
        })

        return NextResponse.json(updatedUser )
    } catch (error) {
        console.log(error,'ERROR_SETTINGS')
        return new NextResponse('Internal Error', {status:500})
    }
}