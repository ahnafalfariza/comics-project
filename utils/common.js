import CID from 'cids'

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
