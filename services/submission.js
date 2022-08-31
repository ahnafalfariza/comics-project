import axios from 'axios'

const ROOT_API = process.env.COMIC_API_URL

export const getGenres = async () => {
  const response = await axios.get(`${ROOT_API}/genres`)
  const results = response.data

  return results.data
}

export const getSubGenres = async () => {
  const response = await axios.get(`${ROOT_API}/subgenres`)
  const results = response.data

  return results.data
}

export const postCoverComic = async (data) => {
  const response = await axios.post(`${ROOT_API}/upload/single`, data)

  return response.data
}

export const postPagesComic = async (data) => {
  const response = await axios.post(`${ROOT_API}/upload/bulk`, data)

  return response.data
}
