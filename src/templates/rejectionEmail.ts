export const getRegistrationRejectedEmailHtml = (firstName: string, genre: string, reason?: string) => `
<!DOCTYPE html>
<html>
<body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 20px auto;">
    <h2 style="color: #e00;">Action Required: Registration Update - Talentron '26</h2>
    
    <p>Hi ${firstName},</p>
    
    <p>We are writing to inform you that your registration for <strong>${genre}</strong> at Talentron '26 could not be approved at this time.</p>
    
    <div style="background-color: #fff0f0; padding: 15px; border: 1px solid #ffcccc; border-radius: 5px; margin: 20px 0;">
        <p style="margin: 5px 0;"><strong>Reason for Rejection:</strong></p>
        <p style="margin: 5px 0;">${reason || 'Payment verification failed or incomplete details provided.'}</p>
    </div>

    <p><strong>Is this a mistake?</strong></p>
    <p>If you believe your registration was rejected in error or you have already made the payment, please contact us immediately at <a href="mailto:support@talentron.in">support@talentron.in</a> with your transaction details and TLRN ID.</p>

    <p>Thank you for your interest in Talentron '26.</p>

    <p>Best regards,<br>
    <strong>Management Team</strong><br>
    Talentron '26<br>
    Zeal Institutes, Pune</p>
</body>
</html>
`;
