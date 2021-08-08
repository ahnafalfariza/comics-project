import Nav from './Common/Nav'

const Layout = ({ children, showNav = true }) => (
  <div className="min-h-screen">
    {showNav && <Nav />}
    {children}
  </div>
)

export default Layout
