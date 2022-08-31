import * as React from 'react'

const InputText = ({
  className = '',
  isError = false,
  width = 'full',
  label,
  register = () => {},
  required,
  type,
  ...rest
}) => {
  const inputBaseStyle = `${className} input-text flex items-center relative w-full md:w-${width} px-3 py-2 rounded-lg`
  const inputBgStyle = 'bg-comic-gray-secondary'
  const inputBorderStyle = 'outline-none '
  const inputTextStyle = 'text-black text-opacity-90 text-body text-base '

  const inputStyle = `${inputBaseStyle} ${inputBgStyle} ${inputBorderStyle} ${inputTextStyle} ${
    isError ? 'input-text--error' : ''
  }`

  if (type === 'phone_number') {
    return (
      <input
        className={inputStyle}
        {...register(label, {
          pattern: /628\d{8}/,
        })}
        {...rest}
      />
    )
  } else if (type === 'instagram') {
    return (
      <input
        className={inputStyle}
        {...register(label, {
          pattern:
            /^((https?):\/\/)?(www\.)?(instagram\.com)\/([A-z0-9\-#_=+()*<>'"`]+)\/?/,
        })}
        {...rest}
      />
    )
  } else if (type === 'twitter') {
    return (
      <input
        className={inputStyle}
        {...register(label, {
          pattern:
            /^((https?):\/\/)?(www\.)?(twitter\.com)\/([A-z0-9\-#_=+()*<>'"`]+)\/?/,
        })}
        {...rest}
      />
    )
  } else if (type == 'password') {
    return (
      <input
        type={'password'}
        className={inputStyle}
        {...register(label, {
          required,
        })}
        {...rest}
      />
    )
  } else {
    return (
      <input
        className={inputStyle}
        {...register(label, {
          required,
        })}
        {...rest}
      />
    )
  }
}

InputText.displayName = 'InputText'

export default InputText
