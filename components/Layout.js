import Footer from './Common/Footer'
import Nav from './Common/Nav'

const Layout = ({
  children,
  showNav = true,
  className = '',
  showFooter = true,
}) => (
  <div className={`min-h-screen ${className}`}>
    {showNav && <Nav />}
    {children}
    {showFooter && <Footer />}
  </div>
)

export default Layout
