import jwt from 'jsonwebtoken';


const generateTokenAndSetCookie = (userId,res) => {
   const token = jwt.sign({userId},process.env.JWT_SECRET,{expiresIn:'15d',})  //token creation

   // set token as a cookie
   res.cookie("jwt",token,{
    httpOnly:true, // This cookie cannot accessed by javascript/BROWSER so it create more privacy /more secure
    maxAge: 15*24*60*60*1000, //15 days validity of tokens
    sameSite:"strict",//CRSF or king of protected vernability or secure
   })

   return token;

}

export default generateTokenAndSetCookie;

