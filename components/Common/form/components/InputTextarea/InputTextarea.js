import * as React from 'react'
import { useFormContext } from 'react-hook-form'

const InputText = ({ className = '', isError = false, name = '', ...rest }) => {
  const inputBaseStyle = `${className} input-text flex items-center relative w-full px-3 py-2 rounded-lg`
  const inputBgStyle = 'bg-comic-gray-secondary'
  const inputBorderStyle = 'outline-none '
  const inputTextStyle = 'text-black text-opacity-90 text-body text-base '

  const inputStyle = `${inputBaseStyle} ${inputBgStyle} ${inputBorderStyle} ${inputTextStyle} ${
    isError ? 'input-text--error' : ''
  }`

  const { register } = useFormContext()

  return <textarea className={inputStyle} {...register(name)} {...rest} />
}

InputText.displayName = 'InputText'

export default InputText
