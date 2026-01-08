import {Router} from 'express';
import {login,logoutUser,registerUser} from '../controllers/auth.controllers.js';
import {validate} from '../middlewares/validator.middlewares.js';
import {verifyJWT} from '../middlewares/auth.middlewares.js';
import {userLoginValidator,userRegisterValidator} from '../validators/index.js';
const router = Router();
router.route("/register").post(userRegisterValidator(),validate,registerUser);
router.route("/login").post(userLoginValidator(),validate,login);
router.route("/logout").post(verifyJWT,logoutUser);

export default router;