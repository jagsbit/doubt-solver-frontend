import { privateAxios } from "./helper";

// save doubt
export const saveDoubt=(content,aiAnswer,userId,catId)=>{
    const createdAt = new Date().toISOString();
    const doubtDto={
        content,
        aiAnswer,
        createdAt
    }
    return privateAxios.post(`/api/doubts/user/${userId}/category/${catId}`,doubtDto)
    .then((response)=>response.data)


}

// get All doubts
export const getAllDoubt=(pageNumber = 0, catId,pageSize = 6)=>{
    let url=`/api/doubts?pageNumber=${pageNumber}&pageSize=${pageSize}`;
    if(catId){
        url=`/api/doubts/category/${catId}?pageNumber=${pageNumber}&pageSize=${pageSize}`;
    }
    return privateAxios.get(url)
    .then((response)=>response.data)
}

 

// get doubts by category
export const getDoubtsByCategory=(catId,pageNumber = 0, pageSize = 6)=>{
    return privateAxios.get(`/api/doubts/category/${catId}?pageNumber=${pageNumber}&pageSize=${pageSize}`)
     .then((response)=>response.data)
}

// get single doubt

export const getDoubtById=(doubtId)=>{
    return privateAxios.get(`/api/doubts/${doubtId}`)
    .then((response)=>response.data)
}

// get doubt y user

export const getDoubtByUser=(userId,pageNumber=0,pageSize=6)=>{
    return privateAxios.get(`/api/doubts/user/${userId}?pageNumber=${pageNumber}&pageSize=${pageSize}`)
    .then((response)=>response.data)
}

