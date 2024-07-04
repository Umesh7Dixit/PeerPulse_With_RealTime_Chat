import express from 'express';
const router = express.Router();

// if we write down many numbers of line of code in /signup and then in login or update
// profile them we was very massy to handle this and typical also for node js
// so we need controllers to handle the line of code

// so insted to do this
// router.get('/signup', (req,res)=>{
//     res.send("Signed up successfully");
// } );
// we do this(Best Practice)

// import { signupUser } from '../controllers/userController.js';
// router.get('/signup', signupUser);

import { signupUser, loginUser, logoutUser, followUnfollowUser, updateUser,getUserProfile} from '../controllers/userController.js';
import protectRoute from '../middlewares/protectRoute.js';
 
// getUserProfile is not protected by middlewares (we can see others users profile without loggedin)
router.get("/profile/:query", getUserProfile)

router.post('/signup', signupUser);

router.post('/login', loginUser);

router.post("/logout",logoutUser);

router.post("/follow/:id", protectRoute, followUnfollowUser); //we want to follow the user so id would be dynamic
// i use protectRoute as a middleware because i don't want to a user who are not loggedIN can not follow or unfollow someone


// update user profile
router.put("/update/:id", protectRoute, updateUser);  //put for update profile

export default router;