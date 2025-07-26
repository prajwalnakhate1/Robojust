import LegalPageLayout from '../../../components/legal/LegalPageLayout';

const PrivacyPolicy = () => {
  return (
    <LegalPageLayout title="Privacy Policy">
      <h2>1. Introduction</h2>
      <p>Welcome to RoboJust! We respect your privacy and are committed to protecting your personal data. This policy explains how we handle information about our customers.</p>
      
      <h2>2. Information We Collect</h2>
      <h3>2.1 Personal Information</h3>
      <ul>
        <li>Name, email, phone number when you register</li>
        <li>Shipping address and payment details</li>
        <li>Order history and product preferences</li>
      </ul>
      
      <h3>2.2 Technical Information</h3>
      <ul>
        <li>IP address, browser type, device information</li>
        <li>Cookies and usage data</li>
      </ul>
      
      <h2>3. How We Use Your Information</h2>
      <table className="cookie-table">
        <thead>
          <tr>
            <th>Purpose</th>
            <th>Data Used</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>Order Processing</td>
            <td>Name, Address, Payment Info</td>
          </tr>
          <tr>
            <td>Customer Support</td>
            <td>Contact Info, Order History</td>
          </tr>
          <tr>
            <td>Website Improvement</td>
            <td>Usage Data, Cookies</td>
          </tr>
        </tbody>
      </table>
      
      <h2>4. Data Sharing</h2>
      <p>We only share your data with:</p>
      <ul>
        <li>Payment processors to complete transactions</li>
        <li>Shipping partners for delivery</li>
        <li>Legal authorities when required by law</li>
      </ul>
      
      <h2>5. Your Rights</h2>
      <p>You have the right to:</p>
      <ol>
        <li>Access your personal data</li>
        <li>Request correction of inaccurate data</li>
        <li>Delete your account data</li>
        <li>Opt-out of marketing communications</li>
      </ol>
      
      <h2>6. Contact Us</h2>
      <p>For any privacy concerns, please contact our Grievance Officer:</p>
      <p>
        <strong>Name:</strong> Data Protection Officer<br />
        <strong>Email:</strong> dpo@robojust.com<br />
        <strong>Address:</strong> RoboJust India Pvt. Ltd., Mumbai, Maharashtra
      </p>
    </LegalPageLayout>
  );
};

export default PrivacyPolicy;