import User from '../models/userModel.js';
import Post from '../models/postModel.js';

import { v2 as cloudinary } from 'cloudinary';

const createPost = async (req, res) => {

    
    try {
        
        const { postedBy, text} = req.body;
        let {img} = req.body; //seperate because img changes

// checks
        if(!postedBy || !text){
                return res.status(400).json({ error: 'Post must contain a postedBy and text' });
            }

        const user = await User.findById(postedBy);

        if(!user)
            {
                return res.status(404).json({ error: 'User not found.' });
            }

        if( user._id.toString() !== req.user._id.toString()){
            return res.status(401).json({ error: 'You are not authorized to create a post.' });
        }

        const maxLength = 500;

        if(text.length > maxLength)
            {
                return res.status(400).json({ error: `Text must be less than or equal to ${maxLength} characters.` });
            }

// cratePost

        if(img)
        {
			const uploadedResponse = await cloudinary.uploader.upload(img);
			img = uploadedResponse.secure_url;
        }
  
		const newPost = new Post({ postedBy, text, img });
		await newPost.save();
        
        res.status(201).json(newPost);// message: "Post created successfully",

        
    } catch (err) {
        res.status(500).json({ error: err.message });
        console.log(err);
    }

};

const getPost = async (req, res) => {

    try {

        const post = await Post.findById(req.params.id);

        if(!post)
            {
                return res.status(404).json({ error: 'Post not found.' });
            }

        res.status(200).json( post );
        
    } catch (err) {
        res.status(500).json({ error: err.message });
    }

};

const deletePost = async (req, res) => {
    try {

        const post = await Post.findById(req.params.id);

        if(!post){
            return res.status(404).json({ error: 'Post not found.' });
        }

        // check real owner is deleted the post or other

        if(post.postedBy.toString()!== req.user._id.toString()){
            return res.status(401).json({ error: 'You are not authorized to delete this post.' });
        }

        // if user contains image so need to delete image from cloudinary also

        if(post.img){
            const imgId = post.img.split("/").pop().split(".")[0];  //we get the id from cloudinary imageId(large id so we extract from this)
            await cloudinary.uploader.destroy(imgId);
        }

        await Post.findByIdAndDelete(req.params.id);

        res.status(200).json({ message: 'Post deleted successfully.' });
        
    } catch (err) {
        res.status(500).json({ error:"Post could not be deleted"}).json({ message: err});
    }
};

const likeUnlikePost = async (req, res) => {

    try {

        const {id:postId} = req.params;
        const userId = req.user._id;

        const post = await Post.findById(postId);

        if(!post)
            {
                return res.status(404).json({ error: "Post not Found" });
            }

        // check if user like the post means it check userId on array of likes
        const userLikedPost = post.likes.includes(userId);

        if(userLikedPost){
            // Unlike Post 
            //pull means remove userId from likes array
            await Post.updateOne( { _id: postId}, { $pull: {likes: userId}}  )
            res.status(200).json({ message: "Post unliked successfully"});

        }else{
            // Like Post

            post.likes.push(userId);
            await post.save();
            res.status(200).json({ message: "Post liked successfully"});
        }
        
    } catch (err) {
        res.status(500).json({error: err.message });
    }

};

const replyToPost = async (req, res) => {

    try {

        const { text } = req.body;
        const postId   = req.params.id;
        const userId =   req.user._id;
        const userProfilePic = req.user.profilePic;
        const username = req.user.username;

        if(!text)
            {
                return res.status(400).json({ error: "Text field is required" });
            }

        const post = await Post.findById(postId);
        
        if(!post)
            {
               return res.status(404).json({ error: "Post not found" });
            }

        
        const reply = { userId, text , userProfilePic, username };

        post.replies.push(reply);
        await post.save();

        res.status(200).json( reply ); //message: "Reply added successfully"

        
    } catch (err) {
        res.status(500).json({error:err.message});
    }

};

const getFeedPosts = async (req, res) => { //show all following posts

    try {

        const userId = req.user._id;
        const user = await User.findById(userId);

        if(!user)
            {
                return res.status(404).json({ error: "User not found" });
            }

        const following = user.following;

             //latest post at the top of the page
        const feedPosts = await Post.find({postedBy:{$in:following}}).sort({createAt: -1});

		res.status(200).json(feedPosts);

        
    } catch (err) {
        res.status(500).json({error:err.message});
    }
}


const getUserPosts =  async (req, res) => {

    const { username } = req.params;

    try{
        const user = await User.findOne({ username });
        if(!user) {
            return res.status(404).json({error: "User not found"});
        }

        const posts = await Post.find({postedBy: user._id}).sort({createAt: -1}); // sort means last post is gonna be first object

        res.status(200).json(posts);
        
    }catch(error){
        res.status(500).json({error: error.message});
    }

}


export { createPost, getPost, deletePost , likeUnlikePost , replyToPost, getFeedPosts, getUserPosts };