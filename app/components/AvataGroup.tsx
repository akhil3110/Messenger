'use client'

import { User } from "@prisma/client"
import Image from "next/image"


interface AvataGroupProps {
    users?: User[]
}

const AvataGroup:React.FC<AvataGroupProps> = ({users = []}) => {
  
    const slicedUsers = users.slice(0,3)

    const positionMap = {
        0:'top-0 left-[12px]',
        1:'bottom-0',
        2:'bottom-0 right-0'
    };


    return (
    <div className="relative w-11 h-11" >
        {slicedUsers.map((user,index) => (
            <div
                key={user.id}
                className={`
                    absolute
                    rounded-full
                    overflow-hidden
                    inline-block
                    h-[21px]
                    w-[21px]
                    ${positionMap[index as keyof typeof positionMap]}
                `}
            >
                <Image
                    alt= "avatar"
                    src = {user?.image ||  'https://cdn.landesa.org/wp-content/uploads/default-user-image.png'}
                    fill
                />
            </div>
        ))}
    </div>
  )
}

export default AvataGroup
