// we need when i delete post or create post then we need show changes immediately so we do  setPosts((prev)=> prev.filter((p) =>  p._id !== post._id)); //prev = all the prev posts and find the post that we need to delete and then delete it (filter out)
            //this brute force approach helps to remove post immediately after deleting the post
            //so we don't need to refresh page to show changes

import { atom } from "recoil";



// so instead we do this everywhere(deletePost,createPost,like,unlike,follow,unfollow) we create atom (global variable) with the help of recoil


// show changes immediately we create atom


const postsAtom =  atom({
    key:"postsAtom",
    default:[], //posts are inside in this array first it is empty array when setPosts set the data on UserPage then all posts data are in this array
});

export default postsAtom;