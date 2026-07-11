import Link from 'next/link';

export default function SiteHeader() {
  return (
    <header className="site-header">
      <div className="container">
        <Link href="/" className="brand">
          <span className="brand-mark">SE</span>
          <span className="brand-name">
            SecureEdge Cyber Technologies LLP
            <small>IT · Cyber Security · Digital Information Security</small>
          </span>
        </Link>
        <nav className="main-nav" aria-label="Main navigation">
          <a href="/#services">Services</a>
          <a href="/#products">Products</a>
          <a href="/#contact">Get a Quote</a>
          {/* Login link on the right side of the page header */}
          <Link href="/login" className="login-link">
            Login
          </Link>
        </nav>
      </div>
    </header>
  );
}
