import Button from 'components/Common/Button'
import { InputText } from 'components/Common/form'
import Modal from 'components/Common/Modal'

const BuyTokenModal = ({ show, onClose }) => {
  return (
    <Modal
      isShow={show}
      closeOnBgClick={false}
      closeOnEscape={false}
      close={onClose}
    >
      <div className="max-w-sm w-full p-4 bg-blueGray-800 m-auto rounded-xl">
        <div>
          <h1 className="text-2xl font-bold text-white tracking-tight">
            Confirm Buy
          </h1>
          <p className="text-white mt-2">
            You are about to purchase Metamaskk
            {/* You are about to purchase <b>{localToken.metadata.name}</b> from{' '}
            <b>{chosenSeller.ownerId}</b>. */}
          </p>
          <form>
            {/* <form onSubmit={handleSubmit(_buy)}> */}
            <div className="mt-4">
              <label className="block text-sm text-white opacity-80 mb-3">
                Buy quantity (Available for buy:{' 5 '})
                {/* {chosenSeller.marketData.quantity}) */}
              </label>
              <InputText
                type="number"
                name="buyQuantity"
                placeholder="Number of card(s) to buy"
              />
              {/* <input
                type="number"
                name="buyQuantity"
                // ref={register({
                //   required: true,
                //   min: 1,
                //   max:
                //     whitelist[0] === 'token_whitelisted'
                //       ? 3
                //       : chosenSeller.marketData.quantity,
                // })}
                // className={`${errors.buyQuantity && 'error'}`}
                placeholder="Number of card(s) to buy"
              /> */}
              <div className="mt-2 text-sm text-red-500">
                {/* {errors.buyQuantity?.type === 'required' &&
                  `Buy quantity is required`}
                {errors.buyQuantity?.type === 'min' && `Minimum 1`}
                {whitelist[0] === 'token_whitelisted' &&
                  errors.buyQuantity?.type === 'max' &&
                  `You can only buy maximum 3 cards per purchase`}
                {whitelist[0] === 'token_not_whitelisted' &&
                  errors.buyQuantity?.type === 'max' &&
                  `Must be less than available`} */}
              </div>
            </div>
            <div className="mt-4 text-center">
              <p className="text-white text-xs">Total</p>
              <div className="text-2xl text-white my-1">
                <p>
                  15
                  {/* {prettyBalance(
                    chosenSeller.marketData.amount * watch('buyQuantity' || 0),
                    24,
                    6
                  )}{' '} */}
                  Ⓝ
                </p>
              </div>
              <p className="text-sm text-white">
                ~$ 10
                {/* {prettyBalance(
                  JSBI.BigInt(
                    store.nearUsdPrice *
                      chosenSeller.marketData.amount *
                      watch('buyQuantity' || 0)
                  ),
                  24,
                  6
                )} */}
              </p>
            </div>
            <p className="text-white mt-4 text-sm text-center">
              You will be redirected to NEAR Web Wallet to confirm your
              transaction
            </p>
            <div className="mt-6">
              <Button size="md" isFullWidth>
                Buy
              </Button>
              <Button
                variant="ghost"
                size="md"
                isFullWidth
                className="mt-4"
                onClick={onClose}
              >
                Cancel
              </Button>
            </div>
          </form>
        </div>
      </div>
    </Modal>
  )
}

export default BuyTokenModal
