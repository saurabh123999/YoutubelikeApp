import {asyncHandler} from "../utils/asyncHander.js";
import {ApiError} from "../utils/ApiError.js";
import {User} from "../models/user.model.js";
import {uploadOnCloudinary} from "../utils/cloudinary.js";
import {ApiResponse} from "../utils/ApiResponse.js";

const registerUser = asyncHandler(async (req , res)=>{
  
   const {fullName,email,username,password}= req.body

//    console.log("email",email)

   if([fullName,email,username,password].some((field)=>
    field?.trim()==="")
   ){
    throw new ApiError("All feilds are required",400)

   }
  
   const existedUser = await User.findOne({
    $or: [
        {email},
        {username}
    ]
   })
   if(existedUser){
    throw new ApiError("user with email or username already exit",409)
   }

  const avatarLocalPath= req.files?.avatar[0]?.path;

//   const coverImageLocalPath= req.files?.coverImage[0]?.path;

let coverImageLocalPath;
if(req.files && Array.isArray(req.files.coverImage) && req.files.coverImage.length > 0){
    coverImageLocalPath= req.files.coverImage[0]?.path;
}

  if(!avatarLocalPath){
    throw new ApiError("avatar is required ",400);

  }

   const avatar = await uploadOnCloudinary(avatarLocalPath);
   const coverImage = await uploadOnCloudinary(coverImageLocalPath);

   if(!avatar){
    throw new ApiError("Avatar fileis required",400)
   }

   const user= await User.create({
    fullName,
    avatar: avatar.url,
    coverImage: coverImage?.url || "",
    email,
    password,
    username: username.toLowerCase()
   })


   const createdUser= await User.findById(user._id).select(
    "-password -refreshToken "
   )

   if(!createdUser){
    throw new ApiError("something went wrong by registering the user",500)

   }
    return res.status(201).json(
        new ApiResponse(200, createdUser, "User registered successfully")
    )


})


export {registerUser}