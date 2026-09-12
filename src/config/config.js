import dotenv from "dotenv";

dotenv.config();

if (!process.env.MONGO_URI){
  throw new Error("mongo_uri  is not defined in eviorment variables");
}

 if (!process.env.JWT_secret){
  throw new Error("jwt_secret is not defeind in enviorment varibales")
 }
 
   const  config  = {
     MONGO_URI: process.env.MONGO_URI,
     JWT_secret: process.env.JWT_secret

   }
  
export default config