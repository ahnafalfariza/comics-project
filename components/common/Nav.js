import { useEffect, useRef, useState } from 'react'
import Link from 'next/link'
import HamburgerMenu from 'react-hamburger-menu'
import { useRouter } from 'next/router'
import near from 'lib/near'

import Button from './Button'
import Avatar from './Avatar'

import { IconLogout } from 'components/Icons'
import { prettyBalance } from 'utils/common'
import { PROFILE_IMAGE } from 'constants/dummy'

const Nav = () => {
  const profileModalRef = useRef()
  const mobileMenuRef = useRef()
  const router = useRouter()

  const [showProfileModal, setShowProfileModal] = useState(false)
  const [showHamburgerMenu, setShowHamburgerMenu] = useState(false)

  useEffect(() => {
    const onClickEv = (e) => {
      if (profileModalRef && !profileModalRef.current.contains(e.target)) {
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
      if (mobileMenuRef && !mobileMenuRef.current.contains(e.target)) {
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
    router.push('/user')
  }

  const ProfileModal = () => {
    return (
      <div className="absolute right-0 mt-3 z-30">
        <div className="min-w-max w-64 bg-blueGray-800 p-3 rounded-md shadow-xl">
          <div className="flex items-center">
            <Avatar size="lg" className="mr-3" src={PROFILE_IMAGE} />
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
      <div className="bg-background sticky z-30 top-0">
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
            <div className="w-10 h-10 text-white flex justify-center items-center bg-primary my-auto rounded-full">
              <div>P</div>
            </div>
            <Link href="/">
              <a className="hidden md:block">Home</a>
            </Link>
            <Link href="/comics">
              <a className="hidden md:block">Comics</a>
            </Link>
            <Link href="/collectibles">
              <a className="hidden md:block">Collectibles</a>
            </Link>
          </div>
          {near.isLoggedIn() ? (
            <div ref={profileModalRef} className="relative h-auto">
              <Avatar
                className="w-10 h-10 align-middle"
                size="md"
                onClick={onClickProfile}
                src={PROFILE_IMAGE}
              />
              {showProfileModal && ProfileModal()}
            </div>
          ) : (
            <Button variant="primary" size="md" onClick={() => near.signIn()}>
              Login
            </Button>
          )}
        </div>
        <div ref={mobileMenuRef} className="relative">
          <div
            className={`absolute bg-background left-0 z-30 right-0 transform transition-transform duration-500 ${
              showHamburgerMenu ? 'translate-y-0' : '-translate-y-96'
            }`}
          >
            <div className="text-center text-white pb-3">
              <div className="p-3">
                <Link href="/">
                  <a>Home</a>
                </Link>
              </div>
              <div className="p-3">
                <Link href="/comics">
                  <a>Comics</a>
                </Link>
              </div>
              <div className="p-3">
                <Link href="/collectibles">
                  <a>Collectibles</a>
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
