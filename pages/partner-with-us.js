import axios from 'axios'
import Button from 'components/Common/Button'
import { InputTextarea } from 'components/Common/form'
import InputText from 'components/Common/form/components/InputText/InputText'
import Head from 'components/Common/Head'
import Layout from 'components/Common/Layout'
import useStore from 'lib/store'
import { useState } from 'react'

const PartnerWithUs = () => {
  const setToastConfig = useStore((state) => state.setToastConfig)

  const _showToast = (type, msg) => {
    setToastConfig({
      text: (
        <div className="text-sm font-semibold text-gray-900 text-center">
          <p>{msg}</p>
        </div>
      ),
      type: type,
      duration: 2500,
    })
  }

  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [subject, setSubject] = useState('')
  const [message, setMessage] = useState('')

  const _submitForm = async (e) => {
    e.preventDefault()

    try {
      await axios.post('https://submit-form.com/JQxGZARk', {
        email: email,
        name: name,
        subject: subject,
        message: message,
      })
      setName('')
      setEmail('')
      setSubject('')
      setMessage('')
      _showToast('success', "Thank you for your interest, We'll be in touch!")
    } catch (err) {
      console.log(err)
      _showToast('error', 'Something wrong happened, please try again!')
    }
  }

  return (
    <Layout>
      <Head title="Partner with Us" />
      <div className="max-w-xl m-auto py-12 px-4">
        <div className="text-center text-white font-bold text-4xl mb-8">
          Partner with Us
        </div>
        <p className="text-white mt-8 text-lg">
          Bring your IP or start new with us! Release your title, build your
          community, and experience Web 3.0 comic with 100% ownership of your
          collection.
        </p>
        <form onSubmit={_submitForm}>
          <div className="mt-6">
            <label className="text-gray-300 pb-2 block text-sm font-semibold">
              Name
            </label>
            <InputText
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Your name"
              required
            />
          </div>
          <div className="mt-6">
            <label className="text-gray-300 pb-2 block text-sm font-semibold">
              Email
            </label>
            <InputText
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Your email"
              required
            />
          </div>
          <div className="mt-6">
            <label className="text-gray-300 pb-2 block text-sm font-semibold">
              Subject
            </label>
            <InputText
              type="text"
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              placeholder="Subject"
              required
            />
          </div>
          <div className="mt-6">
            <label className="text-gray-300 pb-2 block text-sm font-semibold">
              Message
            </label>
            <InputTextarea
              type="text"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Message"
              className="resize-none h-32"
              required
            />
          </div>
          <div className="mt-8">
            <Button isFullWidth={true} type="submit">
              Submit
            </Button>
          </div>
        </form>
        <p className="text-white text-center mt-8">
          You can also find us on:
          <div className="flex flex-wrap justify-center -mx-2">
            <div className="flex items-center pt-2 px-2">
              <a
                href="https://twitter.com/ParasHQ"
                target="_blank"
                className="flex cursor-pointer "
                rel="noreferrer"
              >
                <svg
                  width="32"
                  height="32"
                  viewBox="0 0 32 32"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    fillRule="evenodd"
                    clipRule="evenodd"
                    d="M0 5C0 2.23858 2.23858 0 5 0H27C29.7614 0 32 2.23858 32 5V27C32 29.7614 29.7614 32 27 32H5C2.23858 32 0 29.7614 0 27V5ZM22.1 11.5C22.8 11.4 23.4 11.3 24 11C23.6 11.7 23 12.3 22.3 12.7C22.5 17.4 19.1 22.5 13 22.5C11.2 22.5 9.5 21.9 8 21C9.7 21.2 11.5 20.7 12.7 19.8C11.2 19.8 10 18.8 9.6 17.5C10.1 17.6 10.6 17.5 11.1 17.4C9.6 17 8.5 15.6 8.5 14.1C9 14.3 9.5 14.5 10 14.5C8.6 13.5 8.1 11.6 9 10.1C10.7 12.1 13.1 13.4 15.8 13.5C15.3 11.5 16.9 9.5 19 9.5C19.9 9.5 20.8 9.9 21.4 10.5C22.2 10.3 22.9 10.1 23.5 9.7C23.3 10.5 22.8 11.1 22.1 11.5Z"
                    fill="white"
                  />
                </svg>
              </a>
            </div>
            <div className="flex items-center pt-2 px-2">
              <a
                href="https://instagram.com/paras.hq"
                target="_blank"
                className="flex cursor-pointer "
                rel="noreferrer"
              >
                <svg
                  width="32"
                  height="32"
                  viewBox="0 0 32 32"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M16 18.8C14.5 18.8 13.2 17.6 13.2 16C13.2 14.5 14.4 13.2 16 13.2C17.5 13.2 18.8 14.4 18.8 16C18.8 17.5 17.5 18.8 16 18.8Z"
                    fill="white"
                  />
                  <path
                    fillRule="evenodd"
                    clipRule="evenodd"
                    d="M19.4 9.2H12.6C11.8 9.3 11.4 9.4 11.1 9.5C10.7 9.6 10.4 9.8 10.1 10.1C9.86261 10.3374 9.75045 10.5748 9.61489 10.8617C9.57916 10.9373 9.5417 11.0166 9.5 11.1C9.48453 11.1464 9.46667 11.1952 9.44752 11.2475C9.34291 11.5333 9.2 11.9238 9.2 12.6V19.4C9.3 20.2 9.4 20.6 9.5 20.9C9.6 21.3 9.8 21.6 10.1 21.9C10.3374 22.1374 10.5748 22.2495 10.8617 22.3851C10.9374 22.4209 11.0165 22.4583 11.1 22.5C11.1464 22.5155 11.1952 22.5333 11.2475 22.5525C11.5333 22.6571 11.9238 22.8 12.6 22.8H19.4C20.2 22.7 20.6 22.6 20.9 22.5C21.3 22.4 21.6 22.2 21.9 21.9C22.1374 21.6626 22.2495 21.4252 22.3851 21.1383C22.4209 21.0626 22.4583 20.9835 22.5 20.9C22.5155 20.8536 22.5333 20.8048 22.5525 20.7525C22.6571 20.4667 22.8 20.0762 22.8 19.4V12.6C22.7 11.8 22.6 11.4 22.5 11.1C22.4 10.7 22.2 10.4 21.9 10.1C21.6626 9.86261 21.4252 9.75045 21.1383 9.61488C21.0627 9.57918 20.9833 9.54167 20.9 9.5C20.8536 9.48453 20.8048 9.46666 20.7525 9.44752C20.4667 9.3429 20.0762 9.2 19.4 9.2ZM16 11.7C13.6 11.7 11.7 13.6 11.7 16C11.7 18.4 13.6 20.3 16 20.3C18.4 20.3 20.3 18.4 20.3 16C20.3 13.6 18.4 11.7 16 11.7ZM21.4 11.6C21.4 12.1523 20.9523 12.6 20.4 12.6C19.8477 12.6 19.4 12.1523 19.4 11.6C19.4 11.0477 19.8477 10.6 20.4 10.6C20.9523 10.6 21.4 11.0477 21.4 11.6Z"
                    fill="white"
                  />
                  <path
                    fillRule="evenodd"
                    clipRule="evenodd"
                    d="M0 5C0 2.23858 2.23858 0 5 0H27C29.7614 0 32 2.23858 32 5V27C32 29.7614 29.7614 32 27 32H5C2.23858 32 0 29.7614 0 27V5ZM12.6 7.7H19.4C20.3 7.8 20.9 7.9 21.4 8.1C22 8.4 22.4 8.6 22.9 9.1C23.4 9.6 23.7 10.1 23.9 10.6C24.1 11.1 24.3 11.7 24.3 12.6V19.4C24.2 20.3 24.1 20.9 23.9 21.4C23.6 22 23.4 22.4 22.9 22.9C22.4 23.4 21.9 23.7 21.4 23.9C20.9 24.1 20.3 24.3 19.4 24.3H12.6C11.7 24.2 11.1 24.1 10.6 23.9C10 23.6 9.6 23.4 9.1 22.9C8.6 22.4 8.3 21.9 8.1 21.4C7.9 20.9 7.7 20.3 7.7 19.4V12.6C7.8 11.7 7.9 11.1 8.1 10.6C8.4 10 8.6 9.6 9.1 9.1C9.6 8.6 10.1 8.3 10.6 8.1C11.1 7.9 11.7 7.7 12.6 7.7Z"
                    fill="white"
                  />
                </svg>
              </a>
            </div>
            <div className="flex items-center pt-2 px-2">
              <a
                href="https://t.me/parashq"
                target="_blank"
                className="flex cursor-pointer "
                rel="noreferrer"
              >
                <svg
                  width="32"
                  height="32"
                  viewBox="0 0 32 32"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    fillRule="evenodd"
                    clipRule="evenodd"
                    d="M5 0H27C29.7614 0 32 2.23858 32 5V27C32 29.7614 29.7614 32 27 32H5C2.23858 32 0 29.7614 0 27V5C0 2.23858 2.23858 0 5 0ZM16.6919 12.0074C15.2589 12.6034 12.3949 13.8371 8.09992 15.7083C7.40248 15.9856 7.03714 16.257 7.00388 16.5223C6.94767 16.9706 7.50915 17.1472 8.27374 17.3876C8.37774 17.4203 8.4855 17.4542 8.59598 17.4901C9.34822 17.7346 10.3601 18.0207 10.8862 18.0321C11.3633 18.0424 11.8959 17.8457 12.4839 17.4419C16.4968 14.7331 18.5683 13.3639 18.6983 13.3344C18.7901 13.3136 18.9172 13.2874 19.0034 13.3639C19.0895 13.4405 19.0811 13.5855 19.0719 13.6244C19.0163 13.8615 16.8123 15.9106 15.6717 16.971C15.3161 17.3015 15.0639 17.536 15.0124 17.5896C14.8969 17.7096 14.7791 17.823 14.666 17.9321C13.9672 18.6058 13.4431 19.111 14.695 19.936C15.2967 20.3325 15.7781 20.6603 16.2584 20.9874C16.7829 21.3446 17.306 21.7009 17.9829 22.1446C18.1554 22.2576 18.3201 22.375 18.4805 22.4894C19.0909 22.9246 19.6393 23.3155 20.3168 23.2532C20.7105 23.217 21.1172 22.8468 21.3237 21.7427C21.8118 19.1335 22.7712 13.4801 22.9929 11.1505C23.0123 10.9464 22.9879 10.6851 22.9683 10.5705C22.9486 10.4558 22.9076 10.2924 22.7586 10.1715C22.582 10.0283 22.3095 9.99805 22.1877 10.0001C21.6335 10.01 20.7834 10.3056 16.6919 12.0074Z"
                    fill="white"
                  />
                </svg>
              </a>
            </div>
            <div className="flex items-center pt-2 px-2">
              <a
                href="https://discord.paras.id"
                target="_blank"
                className="flex cursor-pointer "
                rel="noreferrer"
              >
                <svg
                  width="32"
                  height="32"
                  viewBox="0 0 32 32"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    fillRule="evenodd"
                    clipRule="evenodd"
                    d="M17.744 18.8C17.984 19.104 18.272 19.448 18.272 19.448C20.04 19.392 20.72 18.232 20.72 18.232C20.72 15.656 19.568 13.568 19.568 13.568C18.416 12.704 17.32 12.728 17.32 12.728L17.208 12.856C18.568 13.272 19.2 13.872 19.2 13.872C18.368 13.416 17.552 13.192 16.792 13.104C16.216 13.04 15.664 13.056 15.176 13.12C15.1341 13.12 15.0983 13.1261 15.0579 13.133L15.04 13.136C14.76 13.16 14.08 13.264 13.224 13.64C12.928 13.776 12.752 13.872 12.752 13.872C12.752 13.872 13.416 13.24 14.856 12.824L14.776 12.728C14.776 12.728 13.68 12.704 12.528 13.568C12.528 13.568 11.376 15.656 11.376 18.232C11.376 18.232 12.048 19.392 13.816 19.448C13.816 19.448 14.112 19.088 14.352 18.784C13.336 18.48 12.952 17.84 12.952 17.84C12.952 17.84 13.032 17.896 13.176 17.976C13.184 17.984 13.192 17.992 13.208 18C13.22 18.008 13.232 18.014 13.244 18.02C13.256 18.026 13.268 18.032 13.28 18.04C13.48 18.152 13.68 18.24 13.864 18.312C14.192 18.44 14.584 18.568 15.04 18.656C15.64 18.768 16.344 18.808 17.112 18.664C17.488 18.6 17.872 18.488 18.272 18.32C18.552 18.216 18.864 18.064 19.192 17.848C19.192 17.848 18.792 18.504 17.744 18.8ZM13.736 16.6C13.736 16.112 14.096 15.712 14.552 15.712C15.008 15.712 15.376 16.112 15.368 16.6C15.368 17.088 15.008 17.488 14.552 17.488C14.104 17.488 13.736 17.088 13.736 16.6ZM16.656 16.6C16.656 16.112 17.016 15.712 17.472 15.712C17.928 15.712 18.288 16.112 18.288 16.6C18.288 17.088 17.928 17.488 17.472 17.488C17.024 17.488 16.656 17.088 16.656 16.6Z"
                    fill="white"
                  />
                  <path
                    fillRule="evenodd"
                    clipRule="evenodd"
                    d="M27 0C29.7614 0 32 2.23858 32 5V27C32 29.7614 29.7614 32 27 32H5C2.23858 32 0 29.7614 0 27V5C0 2.23858 2.23858 0 5 0H27ZM10.64 9H21.36C22.264 9 23 9.736 23 10.648V25L21.28 23.48L20.312 22.584L19.288 21.632L19.712 23.112H10.64C9.736 23.112 9 22.376 9 21.464V10.648C9 9.736 9.736 9 10.64 9Z"
                    fill="white"
                  />
                </svg>
              </a>
            </div>
          </div>
        </p>
      </div>
    </Layout>
  )
}

export default PartnerWithUs
