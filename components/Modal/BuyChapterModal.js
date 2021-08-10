import Button from 'components/Common/Button'
import Modal from 'components/Common/Modal'
import { IconX, IconXCircle } from 'components/Icons'

const BuyChapterModal = ({
  data = {
    cover:
      'https://d30womf5coomej.cloudfront.net/sa/62/7b09e240-fd2a-4e9c-ac85-d4b54ea39778_z.jpg',
    title: 'Paradigm Chapter 1',
    edition: 1,
    desc: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Integer elementum sem sed diam.',
    price: 1,
  },
  active,
  onClose,
}) => {
  return (
    <Modal closeOnBgClick closeOnEscape isShow={active} close={onClose}>
      <div className="relative m-auto">
        <div className="max-w-2xl md:flex bg-blueGray-800 rounded-lg m-4 md:m-auto overflow-hidden relative">
          <div
            className="md:block md:w-2/5 h-64 md:h-auto overflow-hidden"
            style={{
              backgroundImage: `url(${data.cover})`,
              backgroundSize: 'cover',
              backgroundRepeat: 'no-repeat',
              backgroundPosition: 'top',
            }}
          >
            <div className="w-full h-full bg-gradient-to-b from-transparent via-transparent to-blueGray-800 md:to-transparent" />
          </div>
          <div className="-mt-16 md:mt-0 md:w-3/5 relative p-6 md:p-8 flex flex-col justify-between h-96">
            <div>
              <p className="text-2xl text-gray-50">{data.title}</p>
              <p className="text-blueGray-400 text-lg">
                Edition {data.edition}
              </p>
              <p className="text-gray-200 mt-4 text-sm mb-6 md:mb-12">
                {data.desc}
              </p>
            </div>
            <div>
              <Button size="md" isFullWidth>
                Buy for 1
              </Button>
              <p className="text-blueGray-400 text-xs my-3 text-center">
                Looking for other?
              </p>
              <Button size="md" isFullWidth variant="ghost">
                Buy for {data.price} Ⓝ
              </Button>
            </div>
            <div
              className="absolute top-0 right-0 m-4 cursor-pointer hidden md:block"
              onClick={onClose}
            >
              <IconX size={24} />
            </div>
          </div>
        </div>
        <div
          className="absolute top-0 right-0 cursor-pointer md:hidden"
          onClick={onClose}
        >
          <IconXCircle size={32} />
        </div>
      </div>
    </Modal>
  )
}

export default BuyChapterModal
