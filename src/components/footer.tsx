function Footer() {
  return (
    <footer className="footer p-10 bg-base-100 text-sm mt-40 justify-around">
      <nav>
        <h6 className="footer-title">Services</h6>
        <a className="link link-hover text-cyan-900">Branding</a>
        <a className="link link-hover text-cyan-900">Design</a>
        <a className="link link-hover text-cyan-900">Marketing</a>
        <a className="link link-hover text-cyan-900">Advertisement</a>
      </nav>
      <nav>
        <h6 className="footer-title ">Company</h6>
        <a className="link link-hover text-cyan-900">About us</a>
        <a className="link link-hover text-cyan-900">Contact</a>
        <a className="link link-hover text-cyan-900">Jobs</a>
        <a className="link link-hover text-cyan-900">Press kit</a>
      </nav>
      <nav>
        <h6 className="footer-title">Legal</h6>
        <a className="link link-hover text-cyan-900">Terms of use</a>
        <a className="link link-hover text-cyan-900">Privacy policy</a>
        <a className="link link-hover text-cyan-900">Cookie policy</a>
      </nav>
    </footer>
  );
}
export default Footer;
