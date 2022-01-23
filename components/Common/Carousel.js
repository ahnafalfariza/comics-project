/* eslint-disable react/display-name */
import Slider from 'react-slick'
import 'slick-carousel/slick/slick.css'
import 'slick-carousel/slick/slick-theme.css'

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
  speed: 500,
  slidesToShow: 1,
  slidesToScroll: 1,
  adaptiveHeight: true,
  nextArrow: <SampleNextArrow />,
  prevArrow: <SamplePrevArrow />,
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

const Carousel = () => {
  return (
    <div className="group w-full mx-auto -mt-12">
      <Slider {...settings}>
        <div className="w-full h-52 md:h-64">
          <a
            href="https://ipfs.fleek.co/ipfs/bafybeiaam3zvrf6ar57peyn7n2z2yevfiddsaor5yiaphbfwbmvahw53nq"
            target="_blank"
            rel="noreferrer"
          >
            <img
              className="m-auto w-full h-full object-fill focus:outline-none active:outline-none"
              src="https://dummyimage.com/1200x300/000/fff"
            />
          </a>
        </div>
      </Slider>
    </div>
  )
}

export default Carousel
