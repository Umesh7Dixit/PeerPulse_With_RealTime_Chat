import { atom } from 'recoil'

export const conversationsAtom = atom({
    key: 'conversationsAtom',
    default: [],
})



// when we select any conversation then it pop up on right side
export const selectedConversationAtom = atom({
    key: 'selectedConversationAtom',
    default:{
        _id:"", //id of the conversation
        userId:"",  //id of the other user which i am chatting with
        username:"",  //other user's username
        userProfilePic:"",
    }
})