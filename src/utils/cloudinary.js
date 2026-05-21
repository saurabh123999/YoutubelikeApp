import { v2 as cloudinary } from 'cloudinary';
import fs from 'fs';


 cloudinary.config({ 
        cloud_name: process.env.CLOUDINARY_CLOUD_NAME, 
        api_key: process.env.CLOUDINARY_API_KEY, 
        api_secret: process.env.CLOUDINARY_API_SECRET 
    });


    const uploadToCloudinary= async (localFilePath)=>{
        try {
            if(!localFilePath) return null
            // upload file to cloudinary

           const respone= await cloudinary.uploader.upload(localFilePath, {
                resource_type:"auto"
            })
            // file has been upload successfully
            console.log("file has been uploaded on cloudinary ",respone.url);
            return respone;
            
        } catch (error) {
            fs.unlinkSync(localFilePath)   //remove the locally saved temorary file as the upload operation got failed

            return null;
            
        }
    }

    export {uploadToCloudinary};