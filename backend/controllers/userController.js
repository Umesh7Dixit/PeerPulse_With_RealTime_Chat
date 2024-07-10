import User from "../models/userModel.js";
import Post from "../models/postModel.js";
import bcrypt from "bcryptjs";
import generateTokenAndSetCookie from "../utils/helpers/generateTokenAndSetCookie.js";
import { v2 as cloudinary} from "cloudinary";
import mongoose from "mongoose";


// ___________Get User Profile__________

// const getUserProfile = async (req, res) => {

//   const {username} = req.params;

//   try {
//                                                             //select everyting but not password
//     const user = await User.findOne({ username: username }).select("-password").select("-updatedAt");
//     if (!user) return res.status(404).json({ error: "User not found" });
    
//     res.status(200).json(user); //if user is found then send the user data

//   } catch (err) {
//     res.status(500).json({error: err.message});
//     console.log("Error in getUserProfile: ", err.message);
//   }

// };


const getUserProfile = async (req, res) => {
	// We will fetch user profile either with username or userId
	// query is either username or userId
	const { query } = req.params;

	try {
		let user;

		// if query valid is userId
		if (mongoose.Types.ObjectId.isValid(query)) {
			user = await User.findOne({ _id: query }).select("-password -updatedAt");
		} else {
			//if query is username
			user = await User.findOne({ username: query }).select("-password -updatedAt") ;
		}

		if (!user)
      {
        console.log(`User not found for query: ${query}`);
       return res.status(404).json({ error: "User not found" });
      }

		res.status(200).json(user);
	} catch (err) {
		res.status(500).json({ error: err.message });
		console.log("Error in getUserProfile: ", err.message);
	}
};


// // ___________signUp User__________

// const signupUser = async (req, res) => {
//   try {
//     const { name, email, username, password } = req.body; //we are able to parse these data by app.use(express.json()) middleware
//     const user = await User.findOne({ $or: [{ email }, { username }] }); //we find if this username or email is already exist if exists then it sends the error that user already exists

//     if (user) {
//       res.status(400).json({ error: "User already exists" });
//     }

//     const salt = await bcrypt.genSalt(10); //10length random characters
//     const hashedPassword = await bcrypt.hash(password, salt); //it add hashed password with sait

//     const newUser = new User({
//       name,
//       email,
//       username,
//       password: hashedPassword,
//     });

//     await newUser.save(); //save new user on Database

//     if (newUser) {
//       const t = generateTokenAndSetCookie(newUser._id, res); //we setting/sending the cookies inside the cookies
//       return res.status(201).json(
//         {
//           //201 means created
//           _id: newUser._id,
//           name: newUser.name,
//           email: newUser.email,
//           username: newUser.username,
//           bio: newUser.bio,
//           profilePic: newUser.profilePic
           
//           // token: generateToken(newUser._id) //generateToken is a function in auth.js file
//         } );
        
//     } else {
//         return res.status(400).json({ error: "User not created OR Invalid user data" });
//     }

//   } catch (err) {
//     console.log("Error in SignUpUser", err.message);
//     return res.status(500).json({ error: err.message });
//   }
// };

// // ___________Login User__________

// const loginUser = async (req,res) => {

//   try {
//     const { username, password } = req.body;
    
//     const user = await User.findOne({ username });

//     if (!user) {
//       res.status(400).json({ error: "User not found" });
//     }
//     //check if the password is correct
//     const isMatch = await bcrypt.compare(password, user?.password || "");

//     if(!isMatch||!user ) {
//       return res.status(400).json({ error: "Invalid username OR password" });
//     }

//     generateTokenAndSetCookie(user._id, res);

//     return res.status(200).json({
//       _id: user._id,
//       name: user.name,
//       email: user.email,
//       username: user.username,    
//       bio: user.bio,
//       profilePic: user.profilePic,
//     });

//   } catch (error) {
//       res.status(500).json({ error: error.message });
//       console.log("Error in LoginUser", error.message);  
//   }

// };




// ___________signUp User__________

const signupUser = async (req, res) => {
  try {
    const { name, email, username, password } = req.body;
    const user = await User.findOne({ $or: [{ email }, { username }] });

    if (user) {
      return res.status(400).json({ error: "User already exists" });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const newUser = new User({
      name,
      email,
      username,
      password: hashedPassword,
    });

    await newUser.save();

    generateTokenAndSetCookie(newUser._id, res);

    return res.status(201).json({
      _id: newUser._id,
      name: newUser.name,
      email: newUser.email,
      username: newUser.username,
      bio: newUser.bio,
      profilePic: newUser.profilePic
    });

  } catch (err) {
    console.error("Error in SignUpUser", err.message);
    return res.status(500).json({ error: err.message });
  }
};

// ___________Login User__________

const loginUser = async (req, res) => {
  try {
    const { username, password } = req.body;
    
    const user = await User.findOne({ username });

    if (!user) {
      return res.status(400).json({ error: "User not found" });
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(400).json({ error: "Invalid username or password" });
    }

    generateTokenAndSetCookie(user._id, res);

    return res.status(200).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      username: user.username,    
      bio: user.bio,
      profilePic: user.profilePic,
    });

  } catch (error) {
    console.error("Error in LoginUser", error.message);
    return res.status(500).json({ error: error.message });
  }
};

// ___________Logout User___________

const logoutUser = (req, res) => {
  try {

    res.cookie("jwt","",{maxAge:1});
    res.status(200).json({ message: "Logged out Successfully" });
    
  } catch (err) {
      res.status(500).json({ error: err.message });
      console.log("Error in LogoutUser: ", err.message);
  }
};

// __________FollowUnfollowUser____________________

const followUnfollowUser = async (req, res) => {
  try {

    const { id } = req.params; //getting the id of other user(trying to follow or unfollow someone)
    const userToModify = await User.findById(id);
    const currentUser  = await User.findById(req.user._id); //we pass req.user = user; on protectRout.js because bidefault req don't contain user
     
    // if we follow ourself   convert object to string req.user._id.toString()
    if(id === req.user._id.toString())return res.status(400).json({ error:"You cannot follow/unfolloe yourself"});

    if(!userToModify || !currentUser) return res.status(400).json({ error:"User not found"});

    // checking if we follow or not 
    const isFollowing = currentUser.following.includes(id);

    if(isFollowing)
      {
        //when-> Unfollow user
        //Modify current use following, modify followers of userToModify
        // example-> john unfollow the roy         john                   roy
           await User.findByIdAndUpdate( id, { $pull: { followers: req.user._id }});
          //  we also update on other user side decrease the followers count
           await User.findByIdAndUpdate( req.user._id, { $pull: { following: id }});

           res.status(200).json({ message:"User Unfollowed successfully" });
      }
    else{
      //when-> Follow user
       await User.findByIdAndUpdate(id, { $push: { followers: req.user._id }});  
       await User.findByIdAndUpdate(req.user._id, { $push: { following:id }});

       res.status(200).json({ message:"User followed successfully" });

    }
     
  } catch (err) {
      res.status(500).json({ error: err.message });
      console.log("Error in followUnfollowUser: ", err.message);
  }
}

// ___________Update User Profile__________

const updateUser = async (req, res) => {
  
  const { name ,email, username, password, bio } = req.body;
  let { profilePic } = req.body;

  const userId = req.user._id;

  try {

    let user = await User.findById(userId);
    
    if (!user) {
      return res.status(400).json({ error: "User not found" });
    }

    // we cannot update other users profile
    if(req.params.id !== userId.toString())
      {
        return res.status(400).json({ error: "You cannot update other user's profile" });  //401 unauthorized status code to indicate the request was unauthorized.
      }

    if(password) {
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(password, salt);
      user.password = hashedPassword;
    }

    if(profilePic){   //if user upload the profile image then we uploaded into cloudinary
      if(user.profilePic)
        {
          await cloudinary.uploader.destroy(user.profilePic.split("/").pop().split(".")[0]);  //if user update profilePic then we delete the old one from cloudinary first before upload new one.  //it is important to delete old image because cloudinary has limit on image size and we want to make sure we have the best image size.  //it is very important to delete old image because cloudinary has limit on image size and we want to make sure we have the best image size.  //it is very important to delete old image because cloudinary has limit on image size and we want to make sure we have the best image size.  //it is very important to delete old image because cloudinary has limit on image size and we want to make sure we have the best image size.  //it is very important to delete old image because cloudinary has limit on image size and we want to make sure we have the best image size.  //it is very important to delete old image because
          //we split example =>  https://res.cloudinary.com/dlmetwu8v/image/upload/v1720003229/onz4rwfzzyvpce5bp5cj.jpg  and we need only onz4rwfzzyvpce5bp5cj (image id)
        }
        //upload new image into cloudinary
      const uploadedResponse = await cloudinary.uploader.upload(profilePic);
      profilePic = uploadedResponse.secure_url;
    }

    // if user update these stuff then update or as itis value
    user.name = name || user.name;
    user.email = email || user.email;
    user.username = username || user.username;
    user.profilePic = profilePic || user.profilePic;
    user.bio = bio || user.bio;
    
     user = await user.save();

     //we need when we update the username or profilePic then it show on other posts reply (show my updated profilePic and username)
    //  so we do this
    //read form mongoDb notes  7:23  to 7:25
    await Post.updateMany(
      {"replies.userId": user.id},
      {
        $set:{
          "replies.$[reply].username":user.username,  //changing or update username 
          "replies.$[reply].userProfilePic":user.profilePic
        }
      },
      {arrayFilters:[{"reply.userId":userId}]}
    )

    //  password should be null when seding the response to client browser(console)
    user.password = null;

     res.status(200).json( user );//message:"profile updated successfully",

  } catch (err) {
      res.status(500).json({ error: err.message });
      console.log("Error in updateUser: ", err.message);
  }

}





export { signupUser, loginUser, logoutUser, followUnfollowUser, updateUser ,getUserProfile };
