import {
  verifySmtpConnection,
  sendSubscriptionReminder,
} from '../src/services/emailService';

async function main() {
  console.log('Testing SMTP connection...');
  try {
    await verifySmtpConnection();
    console.log('✅ SMTP connection OK!');

    console.log('Sending test email...');
    await sendSubscriptionReminder({
      toEmail: 'rifkialmunawar34@gmail.com', // Replace with a valid test email if needed
      userName: 'Test User',
      plan: 'PREMIUM_MONTHLY',
      endDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
      daysLeft: 7,
    });
    console.log('✅ Test email sent!');
  } catch (err: any) {
    console.error('❌ Error:', err.message);
  }
}

main();
