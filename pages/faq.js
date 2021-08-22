import Head from 'components/Common/Head'
import Layout from 'components/Layout'

const Faq = () => {
  return (
    <Layout>
      <Head title="Frequently Asked Question - Comics by Paras" />
      <div className="max-w-4xl m-auto py-12 px-4">
        <div className="text-center text-white font-bold text-4xl mb-8">
          Frequently Asked Question
        </div>
        <p className="text-white opacity-80 text-center md:w-1/2 m-auto text-sm">
          "Until I feared I would lose it, I never loved to read. One does not
          love breathing.” ~ To Kill A Mockingbird
        </p>
        <p className="text-white mt-8 mb-16 text-lg">
          Introducing Paras Comic, an NFT project that integrates NFTs to enrich
          comic reading experience. Before we start, let’s answer some of the
          questions you might have! Below we have lists of important and
          frequently asked questions when you want to read Paras Comic.
        </p>
        {data.map((item, idx) => (
          <div key={idx} className="text-white mb-8">
            <p className="text-lg font-bold mb-2 -ml">{item.question}</p>
            {item.answer.map((answer, idx) => (
              <p key={idx} className="ml-4 mb-2 opacity-80">
                {answer}
              </p>
            ))}
            {item.answerList &&
              item.answerList.map((answer, idx) => (
                <p key={idx} className="ml-8 opacity-80">
                  - {answer}
                </p>
              ))}
          </div>
        ))}
        <p className="text-white mt-8">
          If your questions are not listed on the above, please hit us up on our
          Discord channel.
        </p>
      </div>
    </Layout>
  )
}

export default Faq

const data = [
  {
    question: 'What is Paras Comic?',
    answer: [
      'Paras Comic is an NFT project built upon Paras marketplace. Paras Comic is a one stop platform for readers, collectors, authors to communicate within one another, hence improving comic reading experience.',
      'All comics in Paras Comic are published with NFTs technology and smart contract capabilities. We enable open interaction between collectors and authors.',
    ],
  },
  {
    question: 'Why NFTs?',
    answer: [
      'We believe that digitized comics are our effort to preserve comic books for collectors and introduce titles to bigger audiences. We think by integrating digital comics into Web 3.0 space, we can improve the experience massively.',
    ],
    answerList: [
      'All owners are validated',
      'Zero maintenance cost',
      'Forever lasting',
      'Exclusive community and open interaction',
      'Unique experience through NFTs collectibles',
    ],
  },
  {
    question: 'Can I resell my Paras Comic?',
    answer: [
      'Absolutely! Every chapter of NFT can be resold in the Paras marketplace. To recreate our childhood experience, you can lend your chapter NFT to your friend by transferring it; enabling them to read the comic.',
    ],
  },
  {
    question: 'What is so special about the Paras Comic NFT collection?',
    answer: [
      'Paras Comic is a new vertical and our method to enhance collecting NFTs experience through Web 3.0. All comics in Paras Comic are exclusive to the platform. Meet your fellow comic buff!',
      'You can gain access to the heads and the world of the author through the collectibles NFTs. We provide the gateway to the crypto-native comic IP for you!',
    ],
  },
  {
    question:
      'What are you doing about the environmental impact of your NFT collection?',
    answer: [
      'We are building our platform on top of the NEAR Protocol. The NEAR Protocol awarded the climate neutral product label.',
    ],
  },
  {
    question: 'How do I purchase a Paras Comic NFT?',
    answer: [
      'In order to read the comic, you need a NEAR wallet and $NEAR. To create a new wallet, you can visit wallet.near.org.',
      'To buy $NEAR, you can purchase it through OkCoin and Binance. For some countries, you might need a local exchange beforehand.',
      'To gain access to the comic chapter, you can buy the chapter NFT on our platform. The collectibles NFT will be accessible for purchase on our marketplace.',
    ],
  },
  {
    question: 'Where can I interact with other Paras Comic NFT collectors?',
    answer: [
      'Come join us to our big community of artists and collectors on our Discord channel!',
      '“Paradigm” is a fantasy, action, and sci-fi comic inspired by the lore of “Pillars of Paras”. It is a tale of an adventure, discovery, and risky endeavour.',
      '“Paradigm” is our first comic on Paras Comic platform. “Paradigm” is an original IP created by Paras. It represents our goal to create and support crypto-native IP. The comic and its integration to NFTs will be the early standard for any project to come.',
      'There are two important aspects for every comic title on Paras Comic: Chapter NFTs and Collectibles NFTs',
    ],
  },
  {
    question: 'What’s Chapter NFTs and Collectibles NFTs?',
    answer: [
      'Chapter NFTs: It represents the access to read the chapter of the comic. Each chapter ownership is validated through blockchain. All collectors and transaction history will be recorded. These NFTs are transferable and resellable.',
      'Collectibles NFTs: These NFTs are the key to enter the exclusive community of the comic title. Inside the exclusive community, there are several benefits awaiting: (*The experience will be tailored to the author, features may vary)',
    ],
    answerList: [
      'Q&A sessions with the author. Collectors can ask questions regarding the creation or lore inside the story except for spoilers. Unique questions can be included to the next weeks chapter.',
      'Direct Commentary. Unlike the regular comment section, collectors now can directly comment on the panel they like.',
      'Live drawing sessions with the author.',
      'Behind the scenes.',
      'NEAR account badge.',
      'Part of the credits of each chapter.',
      'Possible cameo or special page collector’s idea.',
      'Special commission from the author.',
    ],
    answerFooter:
      '*These are our early features, we will design the exclusive community based on the author’s needs.',
  },
  {
    question: 'How do we buy Paras Comic NFTs?',
    answer: [
      'Each chapter can be purchased individually through each Paras Comic’s title. Under the “Collectibles” tab, collectors can buy the collectibles they want.',
    ],
  },
  {
    question: 'Can I buy more than one Paras Comic NFTs?',
    answer: ['Yes'],
  },
]
