import * as React from 'react'

const InputText = ({
  className = '',
  isError = false,
  label,
  register = () => {},
  required,
  maxLength = '524288',
  ...rest
}) => {
  const inputBaseStyle = `${className} input-text flex items-center relative w-full px-3 py-2 rounded-lg`
  const inputBgStyle = 'bg-comic-gray-secondary'
  const inputBorderStyle = 'outline-none '
  const inputTextStyle = 'text-black text-opacity-90 text-body text-base '

  const inputStyle = `${inputBaseStyle} ${inputBgStyle} ${inputBorderStyle} ${inputTextStyle} ${
    isError ? 'input-text--error' : ''
  }`

  return (
    <textarea
      maxLength={maxLength}
      className={inputStyle}
      {...register(label, { required })}
      {...rest}
    />
  )
}

InputText.displayName = 'InputText'

export default InputText
