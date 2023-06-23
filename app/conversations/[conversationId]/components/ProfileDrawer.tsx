'use client'

import { useState } from "react"
import useOtherUser from "@/app/hooks/useOtherUser"
import { Conversation,User } from "@prisma/client"
import {format} from "date-fns"
import { useMemo,Fragment } from "react"
import { Transition, Dialog } from "@headlessui/react"
import { IoClose, IoTrash } from "react-icons/io5"
import Avatar from "@/app/components/Avatar"
import AvatarGroup from "@/app/components/AvataGroup"
import ConfirmModel from "./ConfirmModel"
import useActiveList from "@/app/hooks/useActiveList"


interface ProfileDrawerProps {
    data: Conversation &{
        users: User[]
    }
    isOpen: boolean
    onClose: () => void
}


const ProfileDrawer:React.FC<ProfileDrawerProps> = ({
    data,
    isOpen,
    onClose
}) => {

  const otherUser = useOtherUser(data)
  const [confirmOpen, setConfirmOpen] = useState(false)

  const { members} = useActiveList()
    const isActive = members.indexOf(otherUser?.email!) !== -1

  const joinedDate = useMemo(() => {
    return format(new Date(otherUser.createdAt), "PP")
  }, [otherUser.createdAt])

  const title = useMemo(() => {
    return data.name || otherUser.name
  },[data.name,otherUser.name])

  const statusText = useMemo(() => {
    if(data.isGroup){
      return `${data.users.length} members`
    }
    else{
      return isActive ? 'Active now' : 'Offline'
    }
  },[data,isActive])

  return (
    <>
    <ConfirmModel 
      isOpen = {confirmOpen}
      onClose={() => setConfirmOpen(false)}
    />
    <Transition.Root show={isOpen} as={Fragment} > 
      <Dialog  as="div" className="relative z-50" onClose={onClose}>
        <Transition.Child  
          as={Fragment}
          enter="ease-out duration-500"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-500"
          leaveFrom="opacity-100"
          leaveTo="opacity-0" 
        >
          <div 
            className="fixed inset-0 bg-black bg-opacity-50"
          />
        </Transition.Child>

        <div
          className="
            fixed
            inset-0
            overflow-hidded
          "
        >
          <div
            className="
              absolute
              inset-0
              overflow-hidden
            "
          >
            <div
              className="
                pointers-events-none
                fixed
                inset-y-0
                right-0
                flex
                max-w-full
                pl-10
              "
            >
              <Transition.Child 
                as={Fragment}
                enter= "transform transition ease-in-out duration-500"
                enterFrom="translate-x-full"
                enterTo="translate-x-0"
                leave= "transform transition ease-in-out duration-500"
                leaveTo="translate-x-full"
              >
                <Dialog.Panel
                  className="
                    w-screen
                    pointer-events-auto
                    max-w-md
                  "
                >
                  <div
                   className="h-full 
                              flex 
                              flex-col 
                              py-6 
                              bg-white 
                              shadow-xl 
                              overflow-y-scroll"
                  >
                    <div className="px-4 sm:px-6">
                      <div 
                        className="flex
                                    items-start
                                    justify-end"
                        >
                          <div
                            className="
                              ml-3
                              flex
                              items-center
                              h-7
                            "
                          >
                            <button
                              onClick={onClose}
                              type="button"
                              className="
                                    rounded-md
                                    bg-white
                                    text-gray-400
                                    hover:text-gray-500
                                    focus:outline-none
                                    focus:ring-2
                                    focut:ring-offset-2
                                    focus:ring-sky-500
                                  "
                            >
                              <span className="sr-only">Close panel</span>
                              <IoClose size={25} />
                            </button>
                          </div>
                        </div>
                    </div>
                    <div className="relative mt-6 flex-1 px-4 sm:px-6">
                    <div className="flex flex-col items-center">
                      <div className="mb-2">
                      {
                        data.isGroup ?(
                          <AvatarGroup users={data.users}/>
                        )
                        :(
                          <Avatar user={otherUser}/>
                        )
                      }
                      </div>
                      <div>
                        {title}
                      </div>
                      <div className="text-sm text-gray-500">
                        {statusText}
                      </div>
                      <div className="flex gap-10 my-8">
                        <div
                          onClick={()=> setConfirmOpen(true)}
                          className="
                            flex
                            flex-col
                            items-center
                            cursor-pointer
                            gap-3
                            hover: opacity-80
                          "
                        >
                          <div
                            className="
                              w-10
                              h-10
                              bg-neutral-100
                              rounded-full
                              flex
                              items-center
                              justify-center
                            ">
                            <IoTrash size={20}  />
                          </div>
                          <div
                            className="
                              text-sm
                              font-light
                              text-neutral-600
                            "
                          >Delete
                          </div>
                        </div>
                      </div>
                      <div
                        className="
                          w-full
                          pb-5
                          pt-5
                          sm:px-0
                          sm:pt-0
                        "
                      >
                        <dl className="space-y-8 px-4 sm:space-x-6 sm:px-6">
                          
                          {data.isGroup && (
                            <div>
                              <dt
                                className="
                                  text-sm
                                  font-medium
                                  text-gray-500
                                  sm:w-40
                                  sm:flex-shrink-0
                                "
                              >
                                Emails
                              </dt>
                              <dd
                                className="
                                  mt-1
                                  text-sm
                                  text-gray-900
                                  sm:col-span-2
                                "
                              >
                                {data.users.map((user) => user.email).join(', ')} 

                              </dd>
                            </div>
                          )}
                          
                          {!data.isGroup && (
                            <div className="sm:col-span-1">
                              <dt
                                className="
                                text-sm
                                font-medium
                                text-gray-500
                                sm:w-40
                                sm:flex-shrink-0
                                "
                              >
                                Email
                              </dt>
                              <dd
                                className="
                                  mt-1
                                  text-sm
                                  text-gray-900
                                  sm:col-span-2
                                "
                              >
                                {otherUser.email}
                              </dd>
                            </div>
                          )}
                          {!data.isGroup && (
                            <>
                              <hr />
                              <div>
                                <dt
                                  className="
                                    text-sm
                                    font-medium
                                    text-gray-500
                                    sm:w-40
                                    sm:flex-shrink-0
                                  "
                                >
                                  Joined
                                </dt>
                                <dd
                                  className="
                                    mt-1
                                    text-sm
                                    text-gray-900
                                    sm:col-span-2"
                                >
                                  <time dateTime={joinedDate}>
                                    {joinedDate}
                                  </time>
                                </dd>
                              </div>
                            </>
                          )}
                        </dl>
                      </div>
                    </div>
                    </div>
                  </div>
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </div>
      </Dialog>
    </Transition.Root>
    </>
  )
}

export default ProfileDrawer
