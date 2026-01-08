import { body } from "express-validator";
const userRegisterValidator=()=>{
    return [
        body("email").trim().notEmpty().withMessage("Email is required").isEmail().withMessage("Invalid email address").normalizeEmail(),
        body("username").notEmpty().withMessage("Username is required").isLength({min:3,max:30}).withMessage("Username must be between 3 and 30 characters").trim().escape().isLowercase().withMessage("Username must be in lowercase"),
        body("password").notEmpty().withMessage("Password is required").isLength({min:6}).withMessage("Password must be at least 6 characters long").trim(),
        body("fullName").optional().trim().escape(),
    ]
}
const userLoginValidator=()=>{
    return [
        body("email").trim().notEmpty().withMessage("Email is required").isEmail().withMessage("Invalid email address").normalizeEmail(),
        body("password").notEmpty().withMessage("Password is required").trim()    ]
}
const userChangeCurrentPasswordValidator = () => {
    return [
      body("oldPassword").notEmpty().withMessage("Old password is required"),
      body("newPassword").notEmpty().withMessage("New password is required"),
    ];
};
const userForgotPasswordValidator = () => {
    return [
      body("email")
        .notEmpty()
        .withMessage("Email is required")
        .isEmail()
        .withMessage("Email is invalid"),
    ];
  };
  
  const userResetForgotPasswordValidator = () => {
    return [body("newPassword").notEmpty().withMessage("Password is required")];
  };
  
export {  userLoginValidator,  userRegisterValidator,userChangeCurrentPasswordValidator,userForgotPasswordValidator,userResetForgotPasswordValidator};