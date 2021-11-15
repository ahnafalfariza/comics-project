import JSBI from 'jsbi'
import near from 'lib/near'
import { parseNearAmount } from 'near-api-js/lib/utils/format'
import { prettyBalance } from 'utils/common'

const createChapterSlice = (set, get) => ({
  buyChapter: async (token_series_id, price) => {
    const params = {
      token_series_id: token_series_id,
      receiver_id: near.currentUser.accountId,
    }

    const attachedDeposit = JSBI.add(
      JSBI.BigInt(price),
      JSBI.BigInt(parseNearAmount('0.01832'))
    )

    if (
      JSBI.lessThan(
        JSBI.BigInt(near.currentUser.balance.available),
        attachedDeposit
      )
    ) {
      get().setToastConfig({
        text: (
          <div className="font-semibold text-center text-sm">
            Insufficient Balance
            <p className="mt-2">
              Available
              {prettyBalance(near.getAccount()?.balance.available, 24, 4)} Ⓝ
            </p>
          </div>
        ),
        type: 'error',
        duration: 2500,
      })
      return
    }

    try {
      await near.contract.nft_buy(
        params,
        '50000000000000',
        attachedDeposit.toString()
      )
    } catch (err) {
      console.log(err)
    }
  },
})

export default createChapterSlice
