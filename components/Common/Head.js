import NextHead from 'next/head'

const Head = ({
  title = 'Paras Comic',
  description = 'New way to collect digital comics. Read and truly own your digital comics. Engage and support the creators like never before.',
  image = 'http://cdn.paras.id/bafybeib4qnakufuktntyagioruvcjbyyvggjn4mfemy4gxk37nrjytrtw4',
  url = 'https://comics.paras.com',
  keywords = 'comics, blockchain, near',
}) => {
  let _title =
    title === 'Paras Comic' ? 'Paras Comic' : `${title} - Paras Comic`

  return (
    <NextHead>
      <title>{_title}</title>
      <meta name="title" content={_title} />
      <meta name="description" content={description} />
      <meta property="og:type" content="website" />
      <meta property="og:url" content={url} />
      <meta property="og:title" content={_title} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={image} />
      <meta name="keywords" content={keywords} />
      <meta name="robots" content="index, follow" />
      <meta property="twitter:card" content="summary_large_image" />
      <meta property="twitter:url" content={url} />
      <meta property="twitter:title" content={_title} />
      <meta property="twitter:description" content={description} />
      <meta property="twitter:image" content={image} />
    </NextHead>
  )
}

export default Head
