import toast from "react-hot-toast";

export const show_toast=(message,type)=>{
    if(type){
        toast.success(message)
    }
    else{
        toast.error(message)
    }
}