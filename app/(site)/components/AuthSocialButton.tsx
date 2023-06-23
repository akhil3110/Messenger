import { IconType } from "react-icons"


interface AuthSocialButtonProps {
    icon: IconType;
    onClick: () => void;
}

 const  AuthSocialButton: React.FC<AuthSocialButtonProps>  =({
    icon: Icon,
    onClick
 }) =>{
    return (
        <button
            type="button"
            onClick={onClick}
            className="
            inline-flex
            w-full
            justify-center
            rounded-md
            bg-white
            text-gray-900
            px-4
            py-2
            shadow-sm
            ring-1
            ring-gray-300
            ring-inset
            hover:bg-gray-50
            focuc:outline-offset-2
            "
        >
            <Icon />
        </button>
  )
}

export default AuthSocialButton;
