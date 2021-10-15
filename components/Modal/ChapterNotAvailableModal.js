import Modal from 'components/Common/Modal'
import Link from 'next/link'
import { useRouter } from 'next/router'

const ChapterNotAvailableModal = ({ show, onClose }) => {
  const router = useRouter()

  return (
    <Modal isShow={show} close={onClose} closeOnBgClick closeOnEscape>
      <div className="px-4 py-2 bg-blueGray-800 max-w-xs w-full rounded-md m-auto">
        <div className="py-2 text-white">
          <p>
            This chapter is not available for read at this moment. Please try
            again later.
          </p>
          <div className="mt-4">
            <a
              className="cursor-pointer inline-flex items-center hover:opacity-75"
              onClick={() => router.back()}
            >
              <span>
                <svg
                  width="16"
                  height="16"
                  viewBox="0 0 16 16"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    fillRule="evenodd"
                    clipRule="evenodd"
                    d="M5.41412 7.00001H13.9999V9.00001H5.41412L8.70701 12.2929L7.2928 13.7071L1.58569 8.00001L7.2928 2.29291L8.70701 3.70712L5.41412 7.00001Z"
                    fill="white"
                  />
                </svg>
              </span>
              <span className="pl-2">Back</span>
            </a>
          </div>
        </div>
      </div>
    </Modal>
  )
}

export default ChapterNotAvailableModal
