require('dotenv').config();
const express = require('express');
const cors = require('cors');
const path = require('path');
const config = require('./sntp_conf');
const { sendEmail } = require('./send_mail');

console.log('読み込み確認');
console.log('SMTP_USER:', config.auth.user)
console.log('SMTP_PASS:', config.auth.pass)

const app = express();
app.use(cors());
app.use(express.json());

// public フォルダ内の静的ファイル（index.html, CSS, JS, images）を配信
app.use(express.static(path.join(__dirname, 'public')));

// 種別（radio）の英語valueを日本語表記に変換
const TYPE_MAP = {
  web: 'Web制作',
  system: 'システム開発',
  infra: 'ITインフラ',
  other: 'その他',
};

// フォーム受信API
app.post('/api/contact', async (req, res) => {
  const { company, name, email, tel, type, message } = req.body;

  if (!name || !email || !message || !type) {
    return res.status(400).json({ success: false, message: '必須項目が不足しています' });
  }

  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return res.status(400).json({ success: false, message: 'メールアドレスの形式が正しくありません' });
  }

  const typeLabel = TYPE_MAP[type] || type;

  // メール本文の作成
  const mailSubject = `【お問い合わせ】${typeLabel}：${name}様より`;
  const mailBody = `
Webサイトより新しいお問い合わせが届きました。

■ 会社名:
${company || '（未入力）'}

■ お名前:
${name}

■ メールアドレス:
${email}

■ 電話番号:
${tel || '（未入力）'}

■ お問い合わせ種別:
${typeLabel}

■ お問い合わせ内容:
${message}

--------------------------------------------------
送信日時: ${new Date().toLocaleString('ja-JP')}
`;

  try {
    // himace@gmail.com へメール送信
    await sendEmail(config.notificationEmail, mailSubject, mailBody);

    res.json({ success: true, message: 'お問い合わせを受け付けました' });
  } catch (error) {
    console.error('API処理エラー:', error);
    res.status(500).json({ success: false, message: 'メール送信に失敗しました' });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running at http://localhost:${PORT}`));