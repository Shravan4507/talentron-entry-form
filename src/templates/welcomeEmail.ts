export const getWelcomeEmailHtml = (firstName: string, genre: string, teamType: string, transactionId: string, amount: number) => `
<!DOCTYPE html>
<html>
<body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 20px auto;">
    <h2 style="color: #000;">Talentron '26 - Registration Received</h2>
    
    <p>Hi ${firstName},</p>
    
    <p>Thank you for registering for <strong>Talentron '26</strong>! We have received your registration request and it is currently under verification.</p>
    
    <div style="background-color: #f4f4f4; padding: 15px; border: 1px solid #ddd; border-radius: 5px;">
        <p style="margin: 5px 0;"><strong>Registration Details:</strong></p>
        <p style="margin: 5px 0;">Competition: ${genre}</p>
        <p style="margin: 5px 0;">Team Type: ${teamType}</p>
        <p style="margin: 5px 0;">Transaction ID: ${transactionId}</p>
        <p style="margin: 5px 0;">Amount Paid: ₹${amount}</p>
    </div>

    <p><strong>Next Steps:</strong></p>
    <p>Our team will verify your payment screenshot within a few days. Once verified, your status will be updated, and you will receive an <strong>official invoice</strong> along with further instructions regarding the Round 1 schedules.</p>

    <p>If you have any questions, please feel free to reach out to us at <a href="mailto:support@talentron.in">support@talentron.in</a>.</p>

    <p>Best regards,<br>
    <strong>Management Team</strong><br>
    Talentron '26<br>
    Zeal Institutes, Pune</p>
</body>
</html>
`;
