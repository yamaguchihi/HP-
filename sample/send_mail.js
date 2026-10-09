const nodemailer = require('nodemailer');

async function sendEmail(to, subject, text) {

  //ここでテストアカウントを作成
  //
  const testAccount = await nodemailer.createTestAccount();

  console.log("User:%s", testAccount.user)
  console.log("Pass:%s", testAccount.pass)

  const transporter = nodemailer.createTransport({
    host: testAccount.smtp.host,
    port: testAccount.smtp.port,
    secure: testAccount.smtp.secure,
    auth: {
      user: testAccount.user,
      pass: testAccount.pass,
    },
  });

  const mailOptions = {
    from: `"お問い合わせ" <${testAccount.user}>`,
    to: to,
    subject: subject,
    text: text,
  };

  const info = await transporter.sendMail(mailOptions);

  console.log('--- [Ethereal Mail] 送信成功 ---');
  console.log('Message ID:', info.messageId);
  console.log('プレビューURL:', nodemailer.getTestMessageUrl(info));
  console.log('--------------------------------');

  return info;
}

// 💡 呼び出し名と一致させて export
module.exports = { sendEmail };

// const nodemailer = require('nodemailer');
// const { v4: uuidv4 } = require('uuid');
// const config = require('./sntp_conf');

// const transporter = nodemailer.createTransport({
//   service: 'gmail',
//   auth: {
//     user: process.env.SMTP_USER,
//     pass: process.env.SMTP_PASS,
//   },
// });


// async function sendEmail(to, subject, message) {
//   const mailOptions = {
//     from: `"${config.fromName}" <${config.fromEmail}>`,
//     to: to,
//     subject: subject,
//     text: message,
//     headers: {
//       'Message-ID': `<${uuidv4()}@${config.host}>`,
//       'X-Sender': config.envelopeFrom,
//     },
//     envelope: {
//       from: config.envelopeFrom,
//       to: to,
//     },
//   };

//   try {
//     const info = await transporter.sendMail({
//       from: `${config.fromName}`,
//       to
//     });
//     console.log(`[Mail Sent] Message-ID: ${info.messageId}`);
//     return { success: true, messageId: info.messageId };
//   } catch (error) {
//     console.error(`[Mail Error] ${error.message}`);
//     throw error;
//   }
// }

// module.exports = { sendEmail };






// const nodemailer = require('nodemailer');
// const { v4: uuidv4 } = require('uuid'); 
// const config = require('./smtp_config');

// // トランスポートは関数の外で1度だけ初期化するのが効率的
// const transporter = nodemailer.createTransport({
//   host: config.host,
//   port: config.port,
//   secure: config.secure,
//   auth: {
//     user: config.auth.user,
//     pass: config.auth.pass,
//   },
// });

// async function sendEmail(to, subject, message) {
//   const mailOptions = {
//     from: `"${config.fromName}" <${config.fromEmail}>`,
//     to: to,
//     subject: subject,
//     text: message,
//     headers: {
//       'Message-ID': `<${uuidv4()}@${config.host}>`,
//       'X-Sender': config.envelopeFrom,
//     },
//     envelope: {
//       from: config.envelopeFrom,
//       to: to,
//     },
//   };

//   try {
//     const info = await transporter.sendMail(mailOptions);
//     console.log(`Message sent: ${info.messageId}`);
//   } catch (error) {
//     console.error(`Error occurred: ${error.message}`);
//     process.exit(1); // エラー時に終了ステータスを返すと呼び出し元で検知しやすいです
//   }
// }

// // 引数のチェック（第1引数: node, 第2引数: script.js, 第3: to, 第4: subject, 第5: message）
// if (process.argv.length !== 5) {
//   console.log('Usage: node send_mail.js <to> <subject> <message>');
//   process.exit(1);
// }

// const to = process.argv[2];
// const subject = process.argv[3];
// const message = process.argv[4];

// sendEmail(to, subject, message);