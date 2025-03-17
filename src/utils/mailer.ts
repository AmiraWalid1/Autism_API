import config from "config"
import nodemailer, {SendMailOptions} from "nodemailer";
import log from "./logger";

// async function createTestCreds(){
//     const creds = await nodemailer.createTestAccount();
//     console.log({ creds });
// }

// createTestCreds();

const smtp = config.get<{
    user: string;
    pass: string;
    host: string;
    port: string;
    secure: string;
}>('smtp');

const transporter = nodemailer.createTransport({
    host: smtp.host,
    port: parseInt(smtp.port, 10),
    secure: smtp.secure === "true",
    auth: {
        user: smtp.user,
        pass: smtp.pass
    }
})
async function sendEmail(payload: SendMailOptions){
    transporter.sendMail(payload, (err, info)=> {
        if (err){
            log.error(err, "Error sending email");
            return;
        }
        log.info(`Preview URL: ${nodemailer.getTestMessageUrl(info)}`);
        return `Preview URL: ${nodemailer.getTestMessageUrl(info)}`;
    })
}

export default sendEmail;