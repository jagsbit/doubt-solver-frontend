import { myAxios } from "./helper";

export const sendEmail=(mail)=>{

    return myAxios.post(`/api/auth/send-code?email=${mail}`)
    .then((response)=>response.data);

}

export const verifyEmail=(mail,code)=>{
     return myAxios.post(`/api/auth/verify-code?email=${mail}&code=${code}`)
    .then((response)=>response.data);
}