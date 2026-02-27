export const getParticipationConfirmedEmailHtml = (firstName: string, genre: string, teamType: string, transactionId: string, amount: number) => `
<!DOCTYPE html>
<html>
<body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 20px auto;">
    <h2 style="color: #28a745;">Participation Confirmed - Talentron '26</h2>
    
    <p>Hi ${firstName},</p>
    
    <p>We are pleased to inform you that your registration for <strong>Talentron '26</strong> has been officially <strong>Confirmed</strong> and your payment has been successfully verified.</p>
    
    <div style="background-color: #f9f9f9; padding: 15px; border: 1px solid #e0e0e0; border-radius: 5px;">
        <p style="margin: 5px 0;"><strong>Verified Details:</strong></p>
        <p style="margin: 5px 0;">Competition: ${genre}</p>
        <p style="margin: 5px 0;">Team Type: ${teamType}</p>
        <p style="margin: 5px 0;">Transaction ID: ${transactionId}</p>
        <p style="margin: 5px 0;">Amount Paid: ₹${amount}</p>
    </div>

    <p><strong>Invoice Attached:</strong></p>
    <p>Please find your official payment invoice attached to this email for your records.</p>

    <p><strong>What's Next?</strong></p>
    <p>You are now officially part of our lineup! We will be sharing the final schedules, venue details, and reporting times via WhatsApp or Email as the event date approaches.</p>

    <p>We look forward to seeing your performance!</p>

    <p>If you have any queries, reach us at <a href="mailto:support@talentron.in">support@talentron.in</a>.</p>

    <p>Best regards,<br>
    <strong>Management Team</strong><br>
    Talentron '26<br>
    Zeal Institutes, Pune</p>
</body>
</html>
`;
