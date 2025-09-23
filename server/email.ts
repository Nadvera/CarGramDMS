import { Resend } from 'resend';

if (!process.env.RESEND_API_KEY) {
  throw new Error("RESEND_API_KEY environment variable must be set");
}

const resend = new Resend(process.env.RESEND_API_KEY);

interface DealerSignupEmailData {
  dealershipName: string;
  contactName: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  state: string;
  zipCode: string;
  dealerLicense?: string;
  monthlyInventory: string;
  currentSoftware?: string;
  interestedFeatures: string[];
}

export async function sendDealerSignupNotification(signupData: DealerSignupEmailData): Promise<boolean> {
  try {
    const htmlContent = `
      <h2>New Dealer Signup - Cargram Pro Version</h2>
      <p>A new used car dealer has signed up for Cargram Pro. Here are the details:</p>
      
      <h3>Dealership Information</h3>
      <ul>
        <li><strong>Dealership Name:</strong> ${signupData.dealershipName}</li>
        <li><strong>Contact Name:</strong> ${signupData.contactName}</li>
        <li><strong>Email:</strong> ${signupData.email}</li>
        <li><strong>Phone:</strong> ${signupData.phone}</li>
      </ul>
      
      <h3>Address</h3>
      <ul>
        <li><strong>Address:</strong> ${signupData.address}</li>
        <li><strong>City:</strong> ${signupData.city}</li>
        <li><strong>State:</strong> ${signupData.state}</li>
        <li><strong>Zip Code:</strong> ${signupData.zipCode}</li>
      </ul>
      
      <h3>Business Details</h3>
      <ul>
        <li><strong>Dealer License:</strong> ${signupData.dealerLicense || 'Not provided'}</li>
        <li><strong>Monthly Inventory:</strong> ${signupData.monthlyInventory}</li>
        <li><strong>Current Software:</strong> ${signupData.currentSoftware || 'Not provided'}</li>
      </ul>
      
      <h3>Interested Features</h3>
      <ul>
        ${signupData.interestedFeatures.length > 0 
          ? signupData.interestedFeatures.map(feature => `<li>${feature}</li>`).join('')
          : '<li>No specific features selected</li>'
        }
      </ul>
      
      <p>Please follow up with this dealer to schedule a demo and discuss their needs.</p>
    `;

    const textContent = `
New Dealer Signup - Cargram Pro Version

Dealership Information:
- Dealership Name: ${signupData.dealershipName}
- Contact Name: ${signupData.contactName}
- Email: ${signupData.email}
- Phone: ${signupData.phone}

Address:
- Address: ${signupData.address}
- City: ${signupData.city}
- State: ${signupData.state}
- Zip Code: ${signupData.zipCode}

Business Details:
- Dealer License: ${signupData.dealerLicense || 'Not provided'}
- Monthly Inventory: ${signupData.monthlyInventory}
- Current Software: ${signupData.currentSoftware || 'Not provided'}

Interested Features:
${signupData.interestedFeatures.length > 0 
  ? signupData.interestedFeatures.map(feature => `- ${feature}`).join('\n')
  : '- No specific features selected'
}

Please follow up with this dealer to schedule a demo and discuss their needs.
    `;

    await resend.emails.send({
      from: 'Cargram <noreply@cargram.io>',
      to: ['help@cargram.io'],
      subject: `New Dealer Signup: ${signupData.dealershipName}`,
      html: htmlContent,
      text: textContent,
    });

    return true;
  } catch (error) {
    console.error('Failed to send dealer signup notification:', error);
    return false;
  }
}

export async function sendDealerWelcomeEmail(email: string, dealershipName: string): Promise<boolean> {
  try {
    const htmlContent = `
      <h2>Welcome to Cargram Pro!</h2>
      <p>Dear ${dealershipName} team,</p>
      
      <p>Thank you for your interest in Cargram Pro! We're excited to help you modernize your used car dealership operations.</p>
      
      <h3>What's Next?</h3>
      <ol>
        <li>Our team will review your submission within 24 hours</li>
        <li>We'll schedule a personalized demo to show you how Cargram Pro can benefit your dealership</li>
        <li>You'll receive custom pricing based on your inventory size and needs</li>
      </ol>
      
      <h3>Cargram Pro Features</h3>
      <ul>
        <li><strong>KBB & MMR Appraisals:</strong> Get accurate vehicle valuations instantly</li>
        <li><strong>Carfax & AutoCheck Integration:</strong> Pull vehicle history reports seamlessly</li>
        <li><strong>E-Signature:</strong> Complete deals digitally from anywhere</li>
        <li><strong>Mobile-Friendly Interface:</strong> Manage your inventory on the go</li>
        <li><strong>Social Media Integration:</strong> Showcase your inventory on the Cargram social platform (Beta)</li>
      </ul>
      
      <p>Questions? Reply to this email or call us at (555) 123-4567.</p>
      
      <p>Best regards,<br>
      The Cargram Team<br>
      Orange County, California</p>
    `;

    const textContent = `
Welcome to Cargram Pro!

Dear ${dealershipName} team,

Thank you for your interest in Cargram Pro! We're excited to help you modernize your used car dealership operations.

What's Next?
1. Our team will review your submission within 24 hours
2. We'll schedule a personalized demo to show you how Cargram Pro can benefit your dealership
3. You'll receive custom pricing based on your inventory size and needs

Cargram Pro Features:
- KBB & MMR Appraisals: Get accurate vehicle valuations instantly
- Carfax & AutoCheck Integration: Pull vehicle history reports seamlessly
- E-Signature: Complete deals digitally from anywhere
- Mobile-Friendly Interface: Manage your inventory on the go
- Social Media Integration: Showcase your inventory on the Cargram social platform (Beta)

Questions? Reply to this email or call us at (555) 123-4567.

Best regards,
The Cargram Team
Orange County, California
    `;

    await resend.emails.send({
      from: 'Cargram <noreply@cargram.io>',
      to: [email],
      subject: 'Welcome to Cargram Pro - Next Steps',
      html: htmlContent,
      text: textContent,
    });

    return true;
  } catch (error) {
    console.error('Failed to send dealer welcome email:', error);
    return false;
  }
}