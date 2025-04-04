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

async function sendEmail(payload: SendMailOptions): Promise<string> {
    return new Promise((resolve, reject) => {
        transporter.sendMail(payload, (err, info) => {
            if (err) {
                log.error(err, "Error sending email");
                reject(err);
                return;
            }
            
            const previewUrl = nodemailer.getTestMessageUrl(info);
            log.info(`Preview URL: ${previewUrl}`);
            
            if (previewUrl) {
                resolve(`Preview URL: ${previewUrl}`);
            } else {
                resolve("Email sent successfully");
            }
        });
    });
}

export default sendEmail;