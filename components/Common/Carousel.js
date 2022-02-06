import Slider from 'react-slick'
import 'slick-carousel/slick/slick.css'
import 'slick-carousel/slick/slick-theme.css'
import { parseImgUrl } from 'utils/common'

// Temporary, later will use from the API
const bannerData = [
  {
    bannerDestop: 'bafkreidlneo32hgod2vxbtsosugcdyti533zbuiumbra6vgevo6s5brvni',
    bannerMobile: 'bafybeigvbovollwy5zxsiug4qjxwywx4k3dgwdkcq7fcurxn5ksi2u7bzm',
    openLink:
      'https://ipfs.fleek.co/ipfs/bafybeifk36itrr3axxejjftknzci35fafvu5yigp65wb4tcmq3vpdp4qw4',
  },
  {
    bannerDestop: 'bafkreictpj6ilj7q45c6agk24lodo5kwfrgo6np4pxhmyhenpz2r6blyeq',
    bannerMobile: '',
    openLink: 'https://www.instagram.com/p/CYoRYKep-5F/',
  },
  {
    bannerDestop: 'bafybeibjx4oixk3kcqxhtwlkwymnpnvnvju2swio737ax5kls6oqccrdp4',
    bannerMobile: '',
    openLink:
      'https://ipfs.fleek.co/ipfs/bafybeiaam3zvrf6ar57peyn7n2z2yevfiddsaor5yiaphbfwbmvahw53nq',
  },
]

const SampleNextArrow = (props) => {
  const { onClick } = props
  return (
    <div
      className="before:leading-none group-hover:opacity-100 transition duration-500 ease-in-out opacity-0 block absolute right-3 bg-opacity-0 top-1/2 h-auto w-5 -mt-7 lg:-mt-10 cursor-pointer translate-x-0 -translate-y-1/2 z-10"
      onClick={onClick}
    >
      <div className="rounded-full text-white text-5xl lg:text-6xl">{'>'}</div>
    </div>
  )
}

function SamplePrevArrow(props) {
  const { onClick } = props
  return (
    <div
      className="before:leading-none group-hover:opacity-100 transition duration-500 ease-in-out opacity-0 block absolute -left-0 bg-opacity-0 top-1/2 h-auto w-5 -mt-7 lg:-mt-10 cursor-pointer translate-x-0 -translate-y-1/2 z-10"
      onClick={onClick}
    >
      <div className="rounded-full text-white text-5xl lg:text-6xl">{'<'}</div>
    </div>
  )
}

const settings = {
  dots: true,
  infinite: true,
  speed: 700,
  slidesToShow: 1,
  slidesToScroll: 1,
  adaptiveHeight: true,
  nextArrow: <SampleNextArrow />,
  prevArrow: <SamplePrevArrow />,
  /* eslint-disable react/display-name */
  appendDots: (dots) => (
    <div
      style={{
        padding: '10px',
        marginBottom: '30px',
        zIndex: '10',
      }}
    >
      <ul> {dots} </ul>
    </div>
  ),
  autoplay: true,
  autoplaySpeed: 5000,
}

const Carousel = () => {
  return (
    <>
      {/* Desktop */}
      <div className="w-full mx-auto -mt-12 max-w-6xl md:px-2 hidden md:block">
        <Slider {...settings}>
          {bannerData.map((banner, idx) => (
            <div className="w-full md:hidden" key={idx}>
              <a href={banner.openLink} target="_blank" rel="noreferrer">
                <img
                  className="m-auto object-fill focus:outline-none active:outline-none"
                  src={parseImgUrl(banner.bannerDestop, null, {
                    width: 1200,
                  })}
                />
              </a>
            </div>
          ))}{' '}
        </Slider>
      </div>

      {/* Mobile */}
      <div className="w-full mx-auto -mt-12 max-w-6xl md:px-2 md:hidden">
        <Slider {...settings}>
          {bannerData.map(
            (banner, idx) =>
              banner.bannerMobile && (
                <div className="w-full md:hidden" key={idx}>
                  <a href={banner.openLink} target="_blank" rel="noreferrer">
                    <img
                      className="m-auto object-fill focus:outline-none active:outline-none"
                      src={parseImgUrl(banner.bannerMobile, null, {
                        width: 1200,
                      })}
                    />
                  </a>
                </div>
              )
          )}{' '}
        </Slider>
      </div>
    </>
  )
}

export default Carousel
