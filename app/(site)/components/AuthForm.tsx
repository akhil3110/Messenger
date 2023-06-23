'use client';


import { use, useCallback, useEffect, useState } from "react";
import { SubmitHandler,FieldValues,useForm } from "react-hook-form";
import Input from "@/app/components/inputs/Input";
import Button from "@/app/components/Button/Button"
import AuthSocialButton from "./AuthSocialButton";
import { BsGithub,BsGoogle } from "react-icons/bs";
import axios from "axios";
import {toast} from "react-hot-toast";
import {signIn, useSession} from "next-auth/react";
import { useRouter } from "next/navigation";


type Variant = "LOGIN" | "REGISTER"

export default function AuthForm() {
    const session = useSession();
    const router = useRouter()
    const [variant, setVariant] = useState<Variant>('LOGIN')
    const [isLoading, setIsLoading] = useState<boolean>(false)


    useEffect(() => {
        if(session?.status === 'authenticated'){
           router.push('/users')
        }
    }, [session?.status, router])


    const toggleVariant = useCallback(() =>{
        if(variant === 'LOGIN'){
            setVariant('REGISTER')
        }else{
            setVariant('LOGIN')
        }
    },[variant])

    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<FieldValues>({
        defaultValues: {
            name: '',
            email: '',
            password: '',
        }
    })

    const onSubmit: SubmitHandler<FieldValues> = (data) =>{
        setIsLoading(true);

        if(variant === 'REGISTER'){
            axios.post('/api/register',data)
                .then(()=> signIn('credentials',data
                ))
                .catch(()=> toast.error("Something went wrong"))
                .finally(() => setIsLoading(false))
        }
        
        if(variant === 'LOGIN'){
            signIn('credentials',{
                ...data,
                redirect: false,
            }).then((callback)=>{
                if(callback?.error){
                    toast.error('Invalid Credentials')
                }

                if(callback?.ok && !callback?.error){
                    toast.success('Logged in Successfully')
                    router.push('/users')
                }
            }).finally(() => setIsLoading(false))
        }
            
    }


    const socialAction = (action: string) =>{
        setIsLoading(true);

        signIn(action, {redirect: false})
        .then((callback) => { 
            if(callback?.error){
                toast.error('Something went wrong')
            }

            if(callback?.ok && !callback?.error){
                toast.success('Logged in Successfully')
                router.push('/users')
            }
        }).finally(() => setIsLoading(false))
    }

    return (
    <div
        className="
        mt-8
        sm:mx-auto
        sm:w-full
        sm:max-w-md"
    >
        <div
             className="
             bg-white 
             px-4
             py-8
             shadow
             sm:rounded-lg
             sm:px-10"
        >
            <form
                className="space-y-6"

                onSubmit={handleSubmit(onSubmit)}
            >
                {variant === 'REGISTER' && (
                    <Input 
                        id="name" 
                        label="Name"  
                        register={register} 
                        errors={errors}
                        disabled={isLoading}
                    />
                )}
                <Input
                    id="email"
                    label="Email address"
                    type="email"
                    register={register}
                    errors={errors}
                    disabled={isLoading}
                />
                <Input
                    id="password"
                    label="password"
                    type="password"
                    register={register}
                    errors={errors}
                    disabled={isLoading}
                />
                <div>
                    <Button
                        disabled={isLoading}
                        fullWidth
                        type="submit"
                    >
                        {variant === 'REGISTER' ? 'Register' : 'Login'}
                    </Button>
                </div>
            </form>

            <div className="mt-6">
                    <div className="relative">
                        <div className="absolute inset-0 flex items-center">
                            <div className="w-full border-t border-gray-800" />
                        </div>
                        <div className="relative flex justify-center text-sm">
                            <span className="px-2 text-gray-800 bg-white">
                                Or continue with
                            </span>
                        </div>
                    </div>

                    <div className="mt-6 flex gap-2">
                        <AuthSocialButton 
                            icon={BsGithub}
                            onClick={() => socialAction('github')}
                        />
                        <AuthSocialButton 
                            icon={BsGoogle}
                            onClick={() => socialAction('google')}
                        />
                    </div>
                </div>
            <div className="
                flex
                gap-2
                justify-center
                text-md
                mt-6
                px-2
                text-gray-900
            ">
                <div>
                    {variant === 'LOGIN' ? 'New To Messenger?' : 'Already have an account?'}
                </div>
                <div
                    onClick={toggleVariant}
                    className="underline cursor-pointer"
                >
                    {variant === 'LOGIN' ? 'Register' : 'Login'}
                </div>

            </div>
        </div>
    </div>
  )
}
