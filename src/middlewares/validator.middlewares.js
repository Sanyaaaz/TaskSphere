import { validationResult } from "express-validator";
import { ApiError } from "../utils/api-error.js";
export const validate=(req,res,next)=>{
    const errors=validationResult(req);
    if(errors.isEmpty()){
        return next();
    }
    const extractedErrors=[];
    errors.array().map((err)=>extractedErrors.push({[err.path]:err.msg}));
    throw new ApiError("Validation failed",422,extractedErrors);

}
export default validate;