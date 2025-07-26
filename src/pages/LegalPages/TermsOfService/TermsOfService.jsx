import LegalPageLayout from '../../../components/legal/LegalPageLayout';

const TermsOfService = () => {
  return (
    <LegalPageLayout title="Terms of Use">
      <h2>1. Your Account</h2>
      <ul>
        <li>You must be at least 18 years old to create an account</li>
        <li>Keep your login credentials secure</li>
        <li>You're responsible for all activities under your account</li>
      </ul>
      
      <h2>2. Product Listings</h2>
      <p>We strive for accuracy but:</p>
      <ul>
        <li>Product images may vary slightly from actual items</li>
        <li>Technical specifications are provided by manufacturers</li>
        <li>Prices are subject to change without notice</li>
      </ul>
      
      <h2>3. Orders & Payments</h2>
      <ol>
        <li>Order confirmation doesn't guarantee availability</li>
        <li>We accept various payment methods including UPI, cards, and net banking</li>
        <li>Failed payments may result in order cancellation</li>
      </ol>
      
      <h2>4. Returns & Refunds</h2>
      <table className="cookie-table">
        <thead>
          <tr>
            <th>Product Type</th>
            <th>Return Window</th>
            <th>Conditions</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>Electronic Components</td>
            <td>10 Days</td>
            <td>Original packaging required</td>
          </tr>
          <tr>
            <td>Development Boards</td>
            <td>7 Days</td>
            <td>No physical damage</td>
          </tr>
        </tbody>
      </table>
      
      <h2>5. Limitation of Liability</h2>
      <p>RoboJust shall not be liable for:</p>
      <ul>
        <li>Any indirect, incidental damages</li>
        <li>Product misuse or improper installation</li>
        <li>Third-party services or products</li>
      </ul>
      
      <h2>6. Governing Law</h2>
      <p>These terms shall be governed by Indian law. Any disputes shall be subject to the exclusive jurisdiction of courts in Mumbai.</p>
    </LegalPageLayout>
  );
};

export default TermsOfService;