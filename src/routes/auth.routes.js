import {Router} from 'express';
import {forgotPasswordRequest, getCurrentUser, login,logoutUser,refreshAccessToken,registerUser, resendEmailVerification, resetForgotPassword, verifyEmail} from '../controllers/auth.controllers.js';
import {validate} from '../middlewares/validator.middlewares.js';
import {verifyJWT} from '../middlewares/auth.middlewares.js';
import {userChangeCurrentPasswordValidator, userLoginValidator,userRegisterValidator} from '../validators/index.js';
const router = Router();
router.route("/register").post(userRegisterValidator(),validate,registerUser);
router.route("/login").post(userLoginValidator(),validate,login);
router.route("/verify-email/:verificationToken").get(verifyEmail);
router.route("/refresh-token").post(refreshAccessToken);
router.route("/forgot-password").post(userForgotPasswordValidator(),validate,forgotPasswordRequest);
router.route("/reset-password/:resetToken").post(userResetForgotPasswordValidator(),validate,resetForgotPassword);


//secured route
router.route("/logout").post(verifyJWT,logoutUser);
router.route("/current-user").post(verifyJWT,getCurrentUser);
router.route("/change-password").post(verifyJWT,userChangeCurrentPasswordValidator(),validate,changeCurrentPassword);
router.route("/resend-email-verification").post(verifyJWT,resendEmailVerification);




export default router;