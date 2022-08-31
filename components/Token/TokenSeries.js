import { useEffect, useRef, useState } from 'react'
import { Blurhash } from 'react-blurhash'
import { parseImgUrl } from 'utils/common'

const TokenSeries = ({
  metadata,
  imgWidth = 640,
  imgHeight = 890,
  initialRotate = {
    x: 0,
    y: 0,
  },
  borderRadius = '10px',
}) => {
  const containerRef = useRef()
  const cardRef = useRef()
  const [imgLoaded, setImgLoaded] = useState(null)
  const [dimension, setDimension] = useState({ width: 0, height: 0 })
  const [rotate, setRotate] = useState(initialRotate)

  let cardTimeout

  useEffect(() => {
    var img = new Image()
    img.onload = function () {
      setImgLoaded(parseImgUrl(metadata.media))
    }
    img.src = parseImgUrl(metadata.media)
  }, [metadata.media])

  useEffect(() => {
    function updateSize() {
      let w = containerRef.current.parentNode.offsetWidth
      let h =
        containerRef.current.parentNode.offsetWidth * (imgHeight / imgWidth)

      if (
        containerRef.current.parentNode.offsetHeight !== 0 &&
        h > containerRef.current.parentNode.offsetHeight
      ) {
        w =
          (imgWidth * containerRef.current.parentNode.offsetHeight) / imgHeight
        h = containerRef.current.parentNode.offsetHeight
      }

      setDimension({
        width: w,
        height: h,
      })
    }
    window.addEventListener('resize', updateSize)
    updateSize()
    return () => window.removeEventListener('resize', updateSize)
  }, [containerRef])

  const handleMouseMove = (e) => {
    const bbox = cardRef.current.getBoundingClientRect()

    const mouseX = e.pageX - (bbox.left + window.scrollX) - dimension.width / 2
    const mouseY = e.pageY - (bbox.top + window.scrollY) - dimension.height / 2

    const mousePX = mouseX / dimension.width
    const mousePY = mouseY / dimension.height

    setRotate({
      x: mousePX * 30,
      y: mousePY * -30,
    })
  }

  const handleMouseEnter = () => {
    clearTimeout(cardTimeout)
  }

  const handleMouseLeave = () => {
    cardTimeout = setTimeout(() => {
      setRotate(initialRotate)
    }, 500)
  }

  return (
    <div
      className="relative select-none m-auto"
      style={{
        transition: `transform .6s .1s`,
        // transform: !isShowFront && `rotateY(180deg)`,
        transformStyle: `preserve-3d`,
        width: dimension.width,
        height: dimension.height,
      }}
      ref={containerRef}
    >
      <div
        className="card-front absolute inset-0"
        style={{
          transform: `rotateY(0deg)`,
          backfaceVisibility: `hidden`,
          WebkitBackfaceVisibility: 'hidden',
        }}
      >
        <div
          className={`card-wrap`}
          onMouseMove={handleMouseMove}
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
          ref={cardRef}
          style={{
            transform: `perspective(${dimension.height * 4}px)`,
          }}
        >
          <div
            className="card  bg-gray-800 w-full h-full"
            style={{
              transform: `rotateY(${rotate.x}deg) rotateX(${rotate.y}deg)`,
              borderRadius: borderRadius,
              boxShadow:
                'rgba(255, 255, 255, 0.2) 0 0 40px 5px, white 0 0 0 1px,rgba(0, 0, 0, 0.66) 0 30px 60px 0',
            }}
          >
            <div className="card-bg relative">
              <img
                className="object-cover w-full h-full relative z-10"
                src={imgLoaded}
              />
              <div
                className="absolute inset-0 z-20 transition-opacity duration-500 ease-in"
                style={{
                  opacity: imgLoaded ? 0 : 1,
                }}
              >
                <Blurhash
                  hash={
                    metadata.blurhash || 'UZ9ZtPzmpHv;R]ONJ6bKQ-l7Z.S_bow5$-nh'
                  }
                  width={`100%`}
                  height={`100%`}
                  resolutionX={32}
                  resolutionY={32}
                  punch={1}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default TokenSeries
