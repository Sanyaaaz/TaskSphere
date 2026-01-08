import { text } from "express";
import Mailgen from "mailgen";
import nodemailer, { createTransport } from "nodemailer";

const sendEmail=async(options)=>{
    const mailGenerator=new Mailgen({
        theme:"default",
        product:{
            name:"Task Manager",
            link:process.env.FRONTEND_URL ||"http://localhost:3000"
        }
    });
    const emailTextual = mailGenerator.generatePlaintext(options.mailgenContent);
    const emailHTML = mailGenerator.generate(options.mailgenContent);

    const transporter=nodemailer.createTransport({
        host:process.env.MAILTRAP_SMTP_HOST,
        port:process.env.MAILTRAP_SMTP_PORT,
        auth:{
            user:process.env.MAILTRAP_SMTP_USER,
            pass:process.env.MAILTRAP_SMTP_PASS
        }

    });
    const mail={
        from:"sanyasaxenaaa@gmail.com",
        to:options.email,
        subject:options.subject,
        text:emailTextual,
        html:emailHTML
    }
    try{
        await transporter.sendMail(mail);
        console.log("Email sent successfully to",options.email);
    }catch(error){
        console.error("Error sending email to",options.email,error);
    }
}
const emailVerificationMailgenContent=(username,verificationURL)=>{
    return{
        body:{
            name:username,
            intro:"Welcome to Our Application! We're excited to have you on board.",
            action:{
                instructions:"To get started, please verify your email address by clicking the button below:",
                button:{
                    color:"#22BC66",
                    text:"Verify Your Email",
                    link:verificationURL
                }
            },
            outro:"If you did not create an account, no further action is required on your part."
        }
    }
}

const forgotPasswordMailgenContent=(username,passwordResetURL)=>{
    return{
        body:{
            name:username,
            intro:"You have requested to reset your password.",
            action:{
                instructions:"To reset your password, please click the button below:",
                button:{
                    color:"#FF5733",
                    text:"Reset Your Password",
                    link:passwordResetURL
                }
            },
            outro:"If you did not request a password reset, please ignore this email."
        } 
    }
}

export {emailVerificationMailgenContent,forgotPasswordMailgenContent,sendEmail}; 