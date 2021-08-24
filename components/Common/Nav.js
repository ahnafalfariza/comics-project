import { useEffect, useRef, useState } from 'react'
import Link from 'next/link'
import HamburgerMenu from 'react-hamburger-menu'
import { useRouter } from 'next/router'
import near from 'lib/near'

import Button from './Button'
import Avatar from './Avatar'

import { IconLogout } from 'components/Icons'
import { parseImgUrl, prettyBalance } from 'utils/common'
import useStore from 'lib/store'
import LoginModal from 'components/Modal/LoginModal'

const Nav = () => {
  const profileModalRef = useRef()
  const mobileMenuRef = useRef()
  const router = useRouter()
  const currentUser = useStore((state) => state.currentUser)

  const [showProfileModal, setShowProfileModal] = useState(false)
  const [showHamburgerMenu, setShowHamburgerMenu] = useState(false)
  const [showLoginModal, setShowLoginModal] = useState(false)

  useEffect(() => {
    const onClickEv = (e) => {
      if (profileModalRef && !profileModalRef?.current?.contains(e.target)) {
        setShowProfileModal(false)
      }
    }

    if (showProfileModal) {
      document.body.addEventListener('click', onClickEv)
    }

    return () => {
      document.body.removeEventListener('click', onClickEv)
    }
  }, [showProfileModal])

  useEffect(() => {
    const onClickEv = (e) => {
      if (mobileMenuRef && !mobileMenuRef?.current?.contains(e.target)) {
        setShowHamburgerMenu(false)
      }
    }

    if (showHamburgerMenu) {
      document.body.addEventListener('click', onClickEv)
    }

    return () => {
      document.body.removeEventListener('click', onClickEv)
    }
  }, [showHamburgerMenu])

  const onClickProfile = () => {
    setShowProfileModal(!showProfileModal)
  }

  const onClickHamburger = () => {
    setShowHamburgerMenu(!showHamburgerMenu)
  }

  const onClickViewProfile = () => {
    router.push(`/${near.getAccount().accountId}`)
  }

  const ProfileModal = () => {
    return (
      <div className="absolute right-0 mt-3 z-30">
        <div className="min-w-max w-64 bg-blueGray-800 p-3 rounded-md shadow-xl">
          <div className="flex items-center">
            <Avatar
              size="lg"
              className="mr-3"
              entityName={near.getAccount().accountId}
              src={parseImgUrl(currentUser.imgUrl || '')}
            />
            <div>
              <p className="font-medium text-white">
                {near.getAccount().accountId}
              </p>
              <p className="font-light text-sm text-white opacity-75">
                {prettyBalance(near.getAccount().balance.available, 24, 4)} Ⓝ
              </p>
            </div>
          </div>
          <Button
            variant="primary"
            size="sm"
            isFullWidth
            className="mt-3"
            onClick={onClickViewProfile}
          >
            View Profile
          </Button>
          <hr className="opacity-10 -mx-2 my-3" />
          <div
            className="flex flex-shrink-0 items-center space-x-2 cursor-pointer"
            onClick={() => near.signOut()}
          >
            <IconLogout size={18} className="text-white opacity-80" />
            <p className="text-white opacity-80">Logout</p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <>
      <LoginModal
        title={`Login to Paras Comic`}
        show={showLoginModal}
        onClose={() => setShowLoginModal(false)}
      />
      <div ref={mobileMenuRef} className="bg-background sticky z-30 top-0">
        <div className="relative bg-background max-w-6xl m-auto flex p-4 items-center justify-between z-40">
          <div className="block md:hidden">
            <HamburgerMenu
              isOpen={showHamburgerMenu}
              menuClicked={onClickHamburger}
              width={21}
              height={15}
              strokeWidth={1}
              rotate={0}
              color="white"
              borderRadius={0}
              animationDuration={0.3}
            />
          </div>
          <div className="flex space-x-16 text-xl font-normal text-white items-center">
            <div className="w-32">
              <Link href="/">
                <a>
                  <img src="/logo.svg" />
                </a>
              </Link>
            </div>
            <Link href="/">
              <a className="hidden md:block font-semibold hover:text-primary">
                <span className={router.pathname === '/' ? `text-primary` : ''}>
                  Home
                </span>
              </a>
            </Link>
            <Link href="/comics">
              <a className="hidden md:block font-semibold hover:text-primary">
                <span
                  className={
                    router.pathname.includes('/comics') ? `text-primary` : ''
                  }
                >
                  Comics
                </span>
              </a>
            </Link>
            <Link href="/market">
              <a className="hidden md:block font-semibold hover:text-primary">
                <span
                  className={
                    router.pathname.includes('/market') ? `text-primary` : ''
                  }
                >
                  Market
                </span>
              </a>
            </Link>
            <Link href="/faq">
              <a className="hidden md:block font-semibold hover:text-primary">
                <span
                  className={router.pathname === '/faq' ? `text-primary` : ''}
                >
                  FAQ
                </span>
              </a>
            </Link>
          </div>
          {near.isLoggedIn() ? (
            <div ref={profileModalRef} className="relative h-auto">
              <Avatar
                className="w-10 h-10 align-middle"
                size="md"
                onClick={onClickProfile}
                entityName={currentUser.accountId}
                src={parseImgUrl(currentUser.imgUrl || '')}
              />
              {showProfileModal && ProfileModal()}
            </div>
          ) : (
            <Button
              variant="primary"
              size="md"
              onClick={() => setShowLoginModal(true)}
            >
              Login
            </Button>
          )}
        </div>
        <div className="relative">
          <div
            className={`absolute bg-background left-0 z-30 right-0 transform transition-transform duration-500 ${
              showHamburgerMenu ? 'translate-y-0' : '-translate-y-96'
            }`}
          >
            <div className="text-center text-white pb-3">
              <div className="p-3">
                <Link href="/">
                  <a className="font-semibold hover:text-primary">
                    <span
                      className={router.pathname === '/' ? `text-primary` : ''}
                    >
                      Home
                    </span>
                  </a>
                </Link>
              </div>
              <div className="p-3">
                <Link href="/comics">
                  <a className="font-semibold hover:text-primary">
                    <span
                      className={
                        router.pathname.includes('/comics')
                          ? `text-primary`
                          : ''
                      }
                    >
                      Comics
                    </span>
                  </a>
                </Link>
              </div>
              <div className="p-3">
                <Link href="/market">
                  <a className="font-semibold hover:text-primary">
                    <span
                      className={
                        router.pathname.includes('/market')
                          ? `text-primary`
                          : ''
                      }
                    >
                      Market
                    </span>
                  </a>
                </Link>
              </div>
              <div className="p-3">
                <Link href="/faq">
                  <a className="font-semibold hover:text-primary">
                    <span
                      className={
                        router.pathname === '/faq' ? `text-primary` : ''
                      }
                    >
                      FAQ
                    </span>
                  </a>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

export default Nav
