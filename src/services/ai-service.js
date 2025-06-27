import { getUser } from "../auth";
import { myAxios } from "./helper"

export const getAnswer=(question)=>{
    let user=getUser();
    let data={
        email:user?.email,
        question:question
    }
    return myAxios.post('/api/ai',data)
    .then((response)=>response.data);
}

export const getQuiz=(topic)=>{
   return myAxios.post('/api/ai/generate-quiz',topic)
   .then((response)=>response.data);
}