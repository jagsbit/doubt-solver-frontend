import { privateAxios } from "./helper"

export const addComment=(comment,userId,doubtId)=>{
   return privateAxios.post(`/api/comments/user/${userId}/doubt/${doubtId}`,comment)
   .then((response)=>response.data);
}

export const upVote=(commentId,userId)=>{
    return privateAxios.put(`/api/comments/upvote/${commentId}/user/${userId}`)
    .then((response)=>response.data);
}