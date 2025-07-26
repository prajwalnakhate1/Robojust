import './LegalPageLayout.css';

const LegalPageLayout = ({ title, children }) => {
  return (
    <div className="legal-page-container">
      <div className="legal-header">
        <h1>{title}</h1>
        <p className="last-updated">Last Updated: 25th july 2025</p>
      </div>
      <div className="legal-content-wrapper">
        <div className="legal-content">
          {children}
        </div>
      </div>
    </div>
  );
};

export default LegalPageLayout;