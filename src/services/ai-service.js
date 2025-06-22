import { myAxios } from "./helper"

export const getAnswer=(question)=>{
    return myAxios.post('/api/ai',question)
    .then((response)=>response.data);
}

export const getQuiz=(topic)=>{
   return myAxios.post('/api/ai/generate-quiz',topic)
   .then((response)=>response.data);
}