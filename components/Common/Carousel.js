import Slider from 'react-slick'
import 'slick-carousel/slick/slick.css'
import 'slick-carousel/slick/slick-theme.css'
import { parseImgUrl } from 'utils/common'

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
  autoplaySpeed: 3000,
}

const Carousel = ({ banner }) => {
  return (
    <>
      {/* Desktop */}
      <div className="w-full mx-auto -mt-12 max-w-6xl md:px-2 hidden md:block">
        <Slider {...settings}>
          {banner.map((item, idx) => (
            <div className="w-full md:hidden" key={idx}>
              <a href={`${item.openLink}`} target="_blank" rel="noreferrer">
                <img
                  className="m-auto object-fill focus:outline-none active:outline-none"
                  src={parseImgUrl(item.bannerDesktop, null, {
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
          {banner.map(
            (item, idx) =>
              item.bannerMobile && (
                <div className="w-full md:hidden" key={idx}>
                  <a href={item.openLink} target="_blank" rel="noreferrer">
                    <img
                      className="m-auto object-fill focus:outline-none active:outline-none"
                      src={parseImgUrl(item.bannerMobile, null, {
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
