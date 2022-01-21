import * as React from 'react'

const InputText = ({
  className = '',
  isError = false,
  width = 'full',
  label,
  register = () => {},
  required,
  ...rest
}) => {
  const inputBaseStyle = `${className} input-text flex items-center relative w-full md:w-${width} px-3 py-2 rounded-lg`
  const inputBgStyle = 'bg-comic-gray-secondary'
  const inputBorderStyle = 'outline-none '
  const inputTextStyle = 'text-black text-opacity-90 text-body text-base '

  const inputStyle = `${inputBaseStyle} ${inputBgStyle} ${inputBorderStyle} ${inputTextStyle} ${
    isError ? 'input-text--error' : ''
  }`

  return (
    <input
      className={inputStyle}
      {...register(label, { required })}
      {...rest}
    />
  )
}

InputText.displayName = 'InputText'

export default InputText
