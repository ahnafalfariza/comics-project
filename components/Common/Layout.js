import Footer from './Footer'
import Nav from './Nav'

const Layout = ({
  children,
  showNav = true,
  className = '',
  showFooter = true,
}) => (
  <div className={`min-h-screen ${className} flex flex-col`}>
    {showNav && <Nav />}
    <div className="flex-1">{children}</div>
    {showFooter && <Footer />}
  </div>
)

export default Layout
