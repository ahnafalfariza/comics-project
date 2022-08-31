import PropTypes from 'prop-types'

const BindSuccess = ({ title, message }) => {
  return (
    <>
      <img src="/check-mark.png" width={180}></img>
      <h3 className="font-bold">{title}</h3>
      <p className="mt-2">{message}</p>
    </>
  )
}

BindSuccess.defaultProps = {
  title: 'Binding Success!',
  message:
    ' Your account has been successfully binded. You will have access to the comic which you previously purchased.',
}

BindSuccess.propTypes = {
  title: PropTypes.string,
  message: PropTypes.string,
}

export default BindSuccess
