import nodemailer from "nodemailer";
import handlebars from "handlebars";
import { readFileSync } from "fs";
require("dotenv").config();

export class Mailer {
  private static readonly host = process.env.MAIL_HOST;
  private static readonly port = process.env.MAIL_PORT;
  private static readonly user = process.env.MAIL_USER;
  private static readonly password = process.env.MAIL_PASS;

  public async registerConfirmation(
    receiver: string,
    name: string,
    active_token: string
  ) {
    const filePath = `${process.env.HTML_FILES_ROOT}/registerTemplate.html`;
    const source = readFileSync(filePath, "utf-8").toString();
    const template = handlebars.compile(source);
    const replacements = {
      user_name: `${name}`,
      user_email: `${receiver}`,
      verify_token_site: active_token,
    };
    const htmlToSend = template(replacements);
    const transporter = nodemailer.createTransport({
      host: Mailer.host,
      port: parseInt(Mailer.port, 10),
      secure: false,
      auth: {
        user: Mailer.user,
        pass: Mailer.password,
      },
    });
    const option = {
      from: `"B4LC" <${Mailer.user}>`,
      to: receiver,
      subject: "Activate Account",
      html: htmlToSend,
    };
    await transporter.sendMail(option);
  }
}
