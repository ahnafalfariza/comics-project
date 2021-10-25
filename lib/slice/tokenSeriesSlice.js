import axios from 'axios'
import near from 'lib/near'

const createTokenSeriesSlice = (set, get) => ({
  isOwned: undefined,
  fetchOwned: async (tokenSeriesId) => {
    if (near.currentUser?.accountId) {
      const resp = await axios.get(`${process.env.COMIC_API_URL}/tokens`, {
        params: {
          token_series_id: tokenSeriesId,
          owner_id: near.currentUser.accountId,
        },
      })
      set(() => ({
        isOwned: resp.data.data.results.length > 0 ? 'owned' : 'not_owned',
      }))
    } else {
      set(() => ({ isOwned: 'not_owned' }))
    }
  },
})

export default createTokenSeriesSlice
