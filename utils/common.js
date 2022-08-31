import CID from 'cids'
import Compressor from 'compressorjs'

const monthNames = [
  'January',
  'February',
  'March',
  'April',
  'May',
  'June',
  'July',
  'August',
  'September',
  'October',
  'November',
  'December',
]

export const parseDate = (ts) => {
  let dateObj = new Date(ts)
  let month = monthNames[dateObj.getMonth()].slice(0, 3)
  let day = String(dateObj.getDate()).padStart(2, '0')
  let year = dateObj.getFullYear()
  return `${day} ${month} ${year}`
}

export const readFileAsUrl = (file) => {
  const temporaryFileReader = new FileReader()

  return new Promise((resolve, reject) => {
    temporaryFileReader.onload = () => {
      resolve(temporaryFileReader.result)
    }
    temporaryFileReader.readAsDataURL(file)
  })
}

export const prettyBalance = (balance, decimals = 18, len = 8) => {
  if (!balance) {
    return '0'
  }
  const diff = balance.toString().length - decimals
  const fixedPoint = Math.max(2, len - Math.max(diff, 0))
  const fixedBalance = (balance / 10 ** decimals).toFixed(fixedPoint)
  const finalBalance = parseFloat(fixedBalance).toString()
  const [head, tail] = finalBalance.split('.')
  if (head == 0) {
    if (tail) {
      return `${head}.${tail.substring(0, len - 1)}`
    }
    return `${head}`
  }
  const formattedHead = head.replace(/\B(?=(\d{3})+(?!\d))/g, ',')
  return tail ? `${formattedHead}.${tail}` : formattedHead
}

export const parseImgUrl = (url, defaultValue = '', opts = {}) => {
  if (!url) {
    return defaultValue
  }
  if (url.includes('://')) {
    const [protocol, path] = url.split('://')
    if (protocol === 'ipfs') {
      const cid = new CID(path)
      if (opts.useOriginal || process.env.APP_ENV !== 'mainnet') {
        if (cid.version === 0) {
          return `https://ipfs-gateway.paras.id/ipfs/${path}`
        } else {
          return `https://ipfs.fleek.co/ipfs/${path}`
        }
      }

      let transformationList = []
      if (opts.width) {
        transformationList.push(`w=${opts.width}`)
      } else {
        transformationList.push('w=800')
      }
      return `https://paras-cdn.imgix.net/${cid}?${transformationList.join(
        '&'
      )}`
    }
    return url
  } else {
    try {
      const cid = new CID(url)
      if (opts.useOriginal || process.env.APP_ENV !== 'mainnet') {
        if (cid.version === 0) {
          return `https://ipfs-gateway.paras.id/ipfs/${cid}`
        } else if (cid.version === 1) {
          return `https://ipfs.fleek.co/ipfs/${cid}`
        }
      }

      let transformationList = []
      if (opts.width) {
        transformationList.push(`w=${opts.width}`)
      } else {
        transformationList.push('w=800')
      }
      return `https://paras-cdn.imgix.net/${cid}?${transformationList.join(
        '&'
      )}`
    } catch (err) {
      return url
    }
  }
}

export const nFormatter = (num) => {
  if (Math.abs(num) > 999999) {
    return Math.sign(num) * (Math.abs(num) / 1000000).toFixed(1) + 'm'
  } else if (Math.abs(num) > 999) {
    return Math.sign(num) * (Math.abs(num) / 1000).toFixed(1) + 'k'
  } else return Math.sign(num) * Math.abs(num)
}

export const compressImg = (file) => {
  return new Promise((resolve, reject) => {
    let _file = file
    const quality = 0.8
    new Compressor(_file, {
      quality: quality,
      maxWidth: 1080,
      maxHeight: 1080,
      convertSize: Infinity,
      success: resolve,
      error: reject,
    })
  })
}

export const dataURLtoFile = (dataurl, filename) => {
  let arr = dataurl.split(','),
    mime = arr[0].match(/:(.*?);/)[1],
    bstr = atob(arr[1]),
    n = bstr.length,
    u8arr = new Uint8Array(n)

  while (n--) {
    u8arr[n] = bstr.charCodeAt(n)
  }

  return new File([u8arr], filename, { type: mime })
}

export const checkUrl = (str) => {
  var pattern = new RegExp(
    '^(https?:\\/\\/)?' +
      '((([a-z\\d]([a-z\\d-]*[a-z\\d])*)\\.)+[a-z]{2,}|' +
      '((\\d{1,3}\\.){3}\\d{1,3}))' +
      '(\\:\\d+)?(\\/[-a-z\\d%_.~+]*)*' +
      '(\\?[;&a-z\\d%_.~+=-]*)?' +
      '(\\#[-a-z\\d_]*)?$',
    'i'
  )
  return !!pattern.test(str)
}

export const parseGetTokenIdfromUrl = (url) => {
  const pathname = new URL(url).pathname.split('/')
  return {
    token_series_id: pathname[2],
    token_id: pathname[3],
  }
}

export const parseGetComicIdfromUrl = (url) => {
  const pathname = new URL(url).pathname.split('/')
  return {
    comic_id: pathname[2],
  }
}
