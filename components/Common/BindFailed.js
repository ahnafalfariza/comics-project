import PropTypes from 'prop-types'

const BindFailed = ({ title, message }) => {
  return (
    <>
      <img src="/delete-sign.png" width={180}></img>
      <h3 className="font-bold">{title}</h3>
      <p className="mt-2">{message}</p>
    </>
  )
}

BindFailed.defaultProps = {
  title: 'Binding Failed!',
  message:
    ' =This email has not yet registered in Paras Comic Mobile App. Please register on Paras Comic Mobile App first.',
}

BindFailed.propTypes = {
  title: PropTypes.string,
  message: PropTypes.string,
}

export default BindFailed
