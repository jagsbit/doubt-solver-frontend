import {  privateAxios } from "./helper";
export const loadAllCategories=()=>{
    return privateAxios.get('/api/cat').then((response)=>response.data)
}