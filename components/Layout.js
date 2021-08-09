import Nav from './Common/Nav'

const Layout = ({ children, showNav = true, className }) => (
  <div className={`min-h-screen ${className}`}>
    {showNav && <Nav />}
    {children}
  </div>
)

export default Layout
