import path from 'path';
// path.resolve(__dirname, '../api/login/newpassword/');

const url = 'http://localhost:3000/api/login/newpassword/'


export default class Mailer {

  static mailjet = require('node-mailjet')
    .connect(process.env.MAILJET_APIKEY!, process.env.MAILJET_APISECRET!);

  static sendEmail(email: string, token: string) {

    const request = this.mailjet
      .post("send", { 'version': 'v3.1' })
      .request(
        {
          "Messages": [
            {
              "From": {
                "Email": "g.ram.bt@hotmail.com",
                "Name": "Gus Ramírez"
              },
              "To": [
                {
                  "Email": `${email}`,
                }
              ],
              "Subject": "Reset Password",
              "TextPart": "Request reset password",
              "HTMLPart": `<h3>Dear user, please refer next link for generate new password <a href="${url + token}">Reset Password</a>!</h3><br />Only valid for 10 minutes`,
              "CustomID": "SendEmailForgotPassword"
            }
          ]
        }
      );

    return request;

  }

}

//  private mailer(emailSent: any) {

//   const mailjet = require('node-mailjet')
//     .connect(process.env.MAILJET_APIKEY!, process.env.MAILJET_APISECRET!);

// }

