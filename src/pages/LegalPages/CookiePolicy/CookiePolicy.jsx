import LegalPageLayout from '../../../components/legal/LegalPageLayout';

const CookiePolicy = () => {
  return (
    <LegalPageLayout title="Cookie Policy">
      <h2>1. What Are Cookies?</h2>
      <p>Cookies are small text files stored on your device when you visit websites. They help sites remember information about your visit.</p>
      
      <h2>2. How We Use Cookies</h2>
      <table className="cookie-table">
        <thead>
          <tr>
            <th>Cookie Type</th>
            <th>Purpose</th>
            <th>Examples</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>Essential</td>
            <td>Basic site functionality</td>
            <td>Login, cart retention</td>
          </tr>
          <tr>
            <td>Performance</td>
            <td>Site optimization</td>
            <td>Google Analytics</td>
          </tr>
          <tr>
            <td>Functional</td>
            <td>Enhanced features</td>
            <td>Language preferences</td>
          </tr>
          <tr>
            <td>Advertising</td>
            <td>Relevant promotions</td>
            <td>Product recommendations</td>
          </tr>
        </tbody>
      </table>
      
      <h2>3. Managing Cookies</h2>
      <p>You can control cookies through:</p>
      <ol>
        <li>Browser settings (disable/enable)</li>
        <li>Our cookie consent banner</li>
        <li>Third-party opt-out tools</li>
      </ol>
      <p>Note: Disabling cookies may affect site functionality.</p>
      
      <h2>4. Changes to This Policy</h2>
      <p>We may update this policy as our cookie usage evolves. Please check back periodically.</p>
    </LegalPageLayout>
  );
};

export default CookiePolicy;