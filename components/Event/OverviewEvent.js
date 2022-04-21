import { useState } from 'react'

const OverviewEvent = () => {
  const [activeTab, setActiveTab] = useState('roadmap')
  const [activeLang, setActiveLang] = useState('en')

  const contentTab = () => {
    if (activeTab === 'roadmap') {
      return (
        <img src={`https://paras-cdn.imgix.net/${data.roadmap[activeLang]}`} />
      )
    } else if (activeTab === 'guideline') {
      return (
        <div>
          {data.guideline[activeLang].map((item) => (
            <img key={item} src={`https://paras-cdn.imgix.net/${item}`} />
          ))}
          <p className="mt-4 text-center">
            Download this guidelines in PDF{' '}
            <a
              href="https://ipfs.fleek.co/ipfs/bafybeiftfcymy7hjchhq633fn7ivjnitpr5d3xow2vqylfoqtvxn62xity"
              target="_blank"
              rel="noreferrer"
              className="text-primary border-b-2 border-transparent cursor-pointer active:border-primary"
            >
              here
            </a>
          </p>
        </div>
      )
    } else if (activeTab === 'faq') {
      return (
        <div className="py-4">
          {data.faq[activeLang].map((item, index) => (
            <div key={index} className="m-4">
              <p className="ml-4 font-bold opacity-80">{`${index + 1}. ${
                item.question
              }`}</p>
              <p
                className="opacity-70"
                dangerouslySetInnerHTML={{ __html: item.answer }}
              />
            </div>
          ))}
        </div>
      )
    }
  }

  return (
    <div className="max-w-3xl -mx-4 md:m-auto">
      <div className="flex justify-center items-center gap-8 p-2 bg-primary text-sm font-medium md:mb-2">
        <p
          className={`${
            activeTab === 'roadmap' ? 'text-white' : ''
          } cursor-pointer`}
          onClick={() => setActiveTab('roadmap')}
        >
          Roadmap
        </p>
        <p
          className={`${
            activeTab === 'guideline' ? 'text-white' : ''
          } cursor-pointer`}
          onClick={() => setActiveTab('guideline')}
        >
          Guideline
        </p>
        <p
          className={`${
            activeTab === 'faq' ? 'text-white' : ''
          } cursor-pointer`}
          onClick={() => setActiveTab('faq')}
        >
          FAQ
        </p>
        <div className="flex items-center ml-4">
          <a
            href="https://discord.gg/sHGbPBp2bB"
            target="_blank"
            className="flex cursor-pointer "
            rel="noreferrer"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              x="0px"
              y="0px"
              width="30"
              height="30"
              viewBox="0 0 30 30"
              style={{ fill: '#ffffff' }}
            >
              <path d="M25.12,6.946c-2.424-1.948-6.257-2.278-6.419-2.292c-0.256-0.022-0.499,0.123-0.604,0.357 c-0.004,0.008-0.218,0.629-0.425,1.228c2.817,0.493,4.731,1.587,4.833,1.647c0.478,0.278,0.638,0.891,0.359,1.368 C22.679,9.572,22.344,9.75,22,9.75c-0.171,0-0.343-0.043-0.501-0.135C21.471,9.598,18.663,8,15.002,8 C11.34,8,8.531,9.599,8.503,9.615C8.026,9.892,7.414,9.729,7.137,9.251C6.86,8.775,7.021,8.164,7.497,7.886 c0.102-0.06,2.023-1.158,4.848-1.65c-0.218-0.606-0.438-1.217-0.442-1.225c-0.105-0.235-0.348-0.383-0.604-0.357 c-0.162,0.013-3.995,0.343-6.451,2.318C3.564,8.158,1,15.092,1,21.087c0,0.106,0.027,0.209,0.08,0.301 c1.771,3.11,6.599,3.924,7.699,3.959c0.007,0.001,0.013,0.001,0.019,0.001c0.194,0,0.377-0.093,0.492-0.25l1.19-1.612 c-2.61-0.629-3.99-1.618-4.073-1.679c-0.444-0.327-0.54-0.953-0.213-1.398c0.326-0.443,0.95-0.541,1.394-0.216 C7.625,20.217,10.172,22,15,22c4.847,0,7.387-1.79,7.412-1.808c0.444-0.322,1.07-0.225,1.395,0.221 c0.324,0.444,0.23,1.066-0.212,1.392c-0.083,0.061-1.456,1.048-4.06,1.677l1.175,1.615c0.115,0.158,0.298,0.25,0.492,0.25 c0.007,0,0.013,0,0.019-0.001c1.101-0.035,5.929-0.849,7.699-3.959c0.053-0.092,0.08-0.195,0.08-0.301 C29,15.092,26.436,8.158,25.12,6.946z M11,19c-1.105,0-2-1.119-2-2.5S9.895,14,11,14s2,1.119,2,2.5S12.105,19,11,19z M19,19 c-1.105,0-2-1.119-2-2.5s0.895-2.5,2-2.5s2,1.119,2,2.5S20.105,19,19,19z"></path>
            </svg>
          </a>
        </div>
      </div>
      <div className="mb-12 relative">
        <>{contentTab()}</>
        <div className="absolute top-0 right-0 flex items-center gap-1 font-bold text-primary p-2">
          <p
            className={`px-2 py-1 rounded-md cursor-pointer ${
              activeLang === 'en'
                ? 'bg-primary text-white'
                : 'bg-transparent text-primary'
            }`}
            onClick={() => setActiveLang('en')}
          >
            EN
          </p>
          <p>/</p>
          <p
            className={`px-2 py-1 rounded-md  cursor-pointer ${
              activeLang === 'id'
                ? 'bg-primary text-white'
                : 'bg-transparent text-primary'
            }`}
            onClick={() => setActiveLang('id')}
          >
            ID
          </p>
        </div>
      </div>
    </div>
  )
}

export default OverviewEvent

const data = {
  roadmap: {
    en: 'bafybeih3dhszjjvsyq2erghlmezdq5i7jfpz2h6den55iwn4odin4mrenu',
    id: 'bafybeig2rqxazbgnvsrgexxy3bsexfjv65xp76wsw4hl4i2gvlwqrfrtvy',
  },
  guideline: {
    en: [
      'bafybeih7q4t3yn3wnoooefvho36ljsd773umyuw5ysvtagaawcvbegyn3m',
      'bafybeif2vsua4ana7eq2p2c23g3aqvo5in7wkmxkskzgkh2odvgm2biahi',
      'bafybeicqmgtzz37yfsosr6olbshtljjh5txj5bpujkgew2f6lngo5t5cg4',
      'bafybeicvm22shbfqfdlhml4nz3m6bf5cc46i3shfapsk6av7jeweuv7kme',
      'bafybeicezvktyr776k73e4p5gdgcarphp7low3qt2a7xlaeuqcjgoqswsm',
    ],
    id: [
      'bafybeihhowbpl5llans77sdecdnxoo5llco65zxqhsbagss6zbbezutofy',
      'bafybeihdhvfgz7olxn7oymsrpw3rbtdhsqnh4ppgnwvzgqfcdmdjjyclo4',
      'bafybeicc42hlu5xzzkl2zv4z64ijszxmlmsb3ya6t3kar4h6v6ddwucm6y',
      'bafybeid33axgp37d37pbz6hrs6mgjwca5ihhob2puqnxwcyyrppsoulxnq',
      'bafybeidlbi6fgw5lxfph2skducgqf57ptcuimo7yvr2hwekvmrp5gkuwfi',
    ],
  },
  faq: {
    en: [
      {
        question: 'What is the Paras Comic Championship 2022?',
        answer:
          'Paras Comic Championship 2022 is the second competition held by Paras Comic. The whole event will be held from April 2022 to July 2022. With the theme of <b>Fantasy into Reality</b>, contestants are asked to choose between 2 genres, those are: Action-Fantasy and Romance-Fantasy. ',
      },
      {
        question: 'How does the competition work?',
        answer:
          'Paras Comic Championship 2022 will have 2 rounds: <b>Elimination</b> and <b>Final Round</b>. In the Elimination Round, contestants must submit the comic’s concept and chapter 1. In this round, all submitted comics will be reviewed and evaluated by Paras Comic’s Editor team. Only 15 best submitted comics from all genres will be chosen into the Final Round. In the Final round, the 15 contestants must submit the comic’s chapter 2. In this round, the winner will be decided purely by reader’s voting.',
      },
      {
        question:
          'How can I submit the comic? Do I have to make NEAR account in Paras Comic?',
        answer:
          'Paras Comic provides the submission form on the website. Click on the submission page, then follow the directions. The submission form is open to all contestants without the need to create a NEAR account or Paras Comic Account.',
      },
      {
        question: 'Can I  submit more than one title or genre?',
        answer:
          'Of course! Each contestant can submit their work for more than one comic! Whether you want to submit more than 1 within the same genre, or in a different genre.',
      },
      {
        question:
          'How many chapters do we need to submit in total? Will it be a comic series or a one-chapter comic?',
        answer:
          'Contestants are expected to submit a concept for a comic series, not a one-shot comic. Also, if passing the final round, contestants must submit the first 2 chapters in total.',
      },
      {
        question:
          "I've already made two short chapters instead of making a comic series? Is it okay to be submitted?",
        answer:
          "If you've already created it, you could try submitting it first. However, if it is still possible, it is preferable if the synopsis concept can be revised, as if there is still a continuation of the story.",
      },

      {
        question:
          'Is it possible to increase my chances of being a finalist by sending two or more chapters directly at the beginning?',
        answer:
          'In reality, the only way to become a finalist is to submit a good serial story concept that fits the theme, as well as a good first chapter picture. You can save the next chapter for submission when your work reaches the final round.',
      },
      {
        question: 'What if I don’t submit my chapter 2 in the final round?',
        answer:
          'The Top 15 finalists who don’t submit their chapter 2, will be automatically disqualified. Thus, they cannot qualify to win the competition even though they win the voting ranks. Make sure to submit your chapter 2 from July 1st - July 18th 2022.',
      },
      {
        question:
          'Is there any concept format that contestants need to follow?',
        answer:
          'Yes. Since the concept must be for a comic series. Try to make a story series that lasts for more than 10 episodes.',
      },
      {
        question:
          'How do you evaluate the comic submission on elimination round? Any specific criteria or important rules to follow?',
        answer:
          'All submitted comics in Paras Comic Championship 2022 will be reviewed and judged by Paras Comic’s editor team in terms of its story, art, and harmony to the theme. Paras Comic team can reject the submission if the comic contains sensitivity in a matter of racism, discrimination, bullying, and religion offense.',
      },
      {
        question: 'How does the voting work?',
        answer:
          'The voting will take place in Paras Comic Discord server. The voting will begin on July 1st and end on July 19th, 2022, at 6 pm (UTC +7). The voters are not restricted to Indonesian, but to all discord members and visitors. All members and visitors can vote for their favorite comic, through the channel provided.',
      },
      {
        question: 'What are the steps for voting on Discord?',
        answer:
          'Each contestant is encouraged to join Paras Comic Discord server and promote their comics on the platform. Contestants can interact with other contestants or with readers. After the Top 15 has been announced, there will be a specified channel that can be used only for voting. Discord members or visitors can vote for their favorite comic on that channel. The voting period is July 1st-July 19th, 2022.',
      },
      {
        question: 'Is this competition using a User Generated Content?',
        answer:
          'This competition does not use the UGC system where contestants can directly upload the comic right away. After contestants submit their comics, Paras Comic’s editor team will curate and review the comics regarding the sensitivity of racism, bullying, discrimination, or religion offense. In the review stage, Paras Comic concentrates on this matter to prevent any issues in the future. ',
      },
      {
        question:
          'Will there be any announcement once my comic gets approved and published?',
        answer:
          'Yes! We will send you an email notification whether your comic gets approved or rejected. ',
      },
      {
        question: 'Must I include ‘Fantasy’ in the sub-theme?',
        answer:
          "Of Course! Because Paras Comic wants to imagine and dream about Prince Charming in unknown land building his kingdom and meeting his soulmate. Because this is the competition's theme this time, you must include a Fantasy sub-theme. Even if you have an action story, such as gangster brawls, you must include fantasy elements such as leveling up, being reborn, and so on. For the Romance category, you must be able to include fantasy ideas such as different races (zombies vs humans), being reborn in someone else's body, or possessing magic that can captivate the main character's crush.",
      },
      {
        question:
          'What if I don’t include the fantasy element? Do I get disqualified?',
        answer:
          'Sadly, yes. However, Paras Comic will consider whether your story includes the fantasy element or not.',
      },
      {
        question:
          'After my comic is published in Paras Comic, how will the license and ownership system work?',
        answer:
          'Your comic will forever be published in Paras Comic’s website. However, the IP is solely the ownership of each author and does not have any binding with Paras Comic. Author can ask the published comic to be taken down if needed (to be published on other platforms or other reasons).',
      },
      {
        question: 'Is the Top 15 for each genre or top 15 from all genres?',
        answer:
          'The Top 15 will be chosen from all genres. Paras Comic does not limit half the slot for each genre. For example, there will be a chance that the Top 15  are 9 comics from Action-Fantasy and 6 comics from Romance-Fantasy and vice versa.',
      },
      {
        question:
          'What if I submit more than 1 title, and all of them get chosen into the Top 15?',
        answer:
          'In this case, the author can choose whether you want to continue the final round with just one comic or all of them. As for the exclusive contract, you can also choose which comic you want to proceed with.',
      },
      {
        question:
          'Is there any mandatory for the Top 15 to deal the exclusive contract?',
        answer:
          'The contract is exclusive for the Top 15. However, if the finalist has a clear and important reason not to comply with the exclusive contract, please contact Paras Comic team for further discussion.',
      },
      {
        question:
          'Can I still be a comic artist in Paras Comic if I don’t get into the Top 15?',
        answer:
          'Of course! Make your best comic and try another shot through our Submission and choose Artists Submission button. You can submit your best comic and get contacted by Paras Comic’s team.',
      },
      {
        question: 'How much will I get if I join the competition?',
        answer:
          'Once you get into the Top 15, you will automatically get IDR 3.5 million and e-certificate for each contestant. In the final round, there will be 2 winners from each genre, so 4 winners in total! You will get IDR 40 million for 1st winner and IDR 30 million for 2nd winner. After that, once you sign the exclusive contract, you will also get offered a production fee, so that means another additional money in your pocket!',
      },
      {
        question: 'I am not from Indonesia, can I still join the competition?',
        answer:
          'Everyone can join the competition. However, one of the requirements is using Bahasa Indonesia only.',
      },
    ],
    id: [
      {
        question: 'Apa itu Paras Comic Championship 2022?',
        answer:
          'Paras Comic Championship 2022 adalah ajang kompetisi kedua yang diadakan oleh Paras Comic. Keseluruhan kompetisi ini akan berlangsung dari April sampai Juli 2022. Dengan mengusung tema <b>Fantasy into Reality</b>, para kontestan dapat memilih antara 2 genre pilihan, yaitu: Action-Fantasy dan Romance-Fantasy.',
      },

      {
        question: 'Bagaimana sistem kompetisi ini?',
        answer:
          'Paras Comic Championship 2022 terbagi menjadi 2 ronde: <b>Babak Penyisihan</b> dan <b>Babak Final</b>. Dalam babak penyisihan, kontestan diharuskan mengirim beberapa paragraf konsep cerita (dari awal cerita sampai selesai), sinopsis (2-3  kalimat yang menggambarkan keseluruhan cerita), serta 1 chapter pertama komik tersebut. Dalam babak ini, seluruh komik yang diterima akan dievaluasi dan dinilai oleh tim editor dari Paras Comic. Hanya 15 komik terbaik yang akan dipilih untuk lanjut ke babak final. Dalam babak final, 15 komik terbaik harus mengirimkan lanjutan chapter (chapter 2) selama tenggat waktu yang telah ditentukan. Pemenang dari babak final akan menggunakan sistem 100% voting melalui server Discord Paras Comic.',
      },

      {
        question:
          'Bagaimanakah cara untuk submit? Apakah harus membuat akun NEAR di Paras Comic?',
        answer:
          'Paras Comic menyediakan form khusus di dalam menu bar Submission. Silahkan klik menu bar Submission dan ikuti perintah ataupun hal-hal yang dibutuhkan. Form khusus dan pendaftaran lomba dapat diakses secara publik tanpa harus membuat akun NEAR atau akun Paras Comic. ',
      },

      {
        question:
          'Apakah diperbolehkan untuk submit lebih dari satu judul atau genre?',
        answer:
          'Boleh dong! Setiap kontestan diperbolehkan mengirim lebih dari satu judul komik, baik dengan genre yang sama (contoh: mengirimkan dua judul dengan tema romance-fantasy atau mengirim lebih dari satu judul dengan genre yang berbeda).',
      },

      {
        question:
          'Berapa total chapter yang harus di submit? Apakah komiknya akan menjadi komik seri atau komik one-chapter?',
        answer:
          'Kontestan diharuskan untuk mengirimkan konsep cerita sebuah komik seri, bukan one-shot komik. Selain itu, apabila kontestan lolos ke babak final, maka jumlah chapter yang perlu dibuat adalah 2 chapter pertama.',
      },

      {
        question:
          'Bagaimana apabila saya sudah terlanjur membuat 2 chapter pendek langsung tamat?',
        answer:
          'Bila sudah terlanjur, mungkin bisa dicoba submit dulu. Tapi apabila masih bisa, ada baiknya konsep sinopsisnya bisa direvisi terlebih dahulu. Kamu bisa menambahkan seolah-olah masih ada kelanjutan dari cerita tersebut. Bila tidak, masih bisa dicoba untuk submit terlebih dahulu.',
      },

      {
        question:
          'Apakah dengan langsung kirim 2 atau lebih chapter di awal bisa membuat kesempatan saya untuk masuk finalis jadi lebih besar?',
        answer:
          'Sebetulnya, kesempatan untuk menjadi finalis adalah dengan memberikan konsep cerita berseri yang bagus dan sesuai dengan tema, dan gambar chapter pertama yang baik. Kamu bisa menyimpan chapter berikutnya untuk dikirimkan saat karyamu masuk babak final.',
      },
      {
        question: 'Bagaimana jika saya tidak submit chapter 2 di babak final?',
        answer:
          'Finalis 15 besar yang tidak mengirimkan chapter 2 akan otomatis didiskualifikasi. Maka dari itu, kamu tidak dapat melanjutkan kompetisi dan memenangkan hadiah (walaupun hasil voting juara 1). Setelah lolos babak final, pastikan kamu submit chapter 2 antara tanggal 1 Juli sampai 18 Juli 2022.',
      },
      {
        question: 'Apakah ada format konsep yang harus diperhatikan kontestan?',
        answer:
          'Ya. Berhubung kontestan diharuskan untuk membuat konsep komik seri, maka buatlah konsep cerita yang dapat bertahan lebih dari 10 episode.',
      },

      {
        question:
          'Bagaimana cara Tim Paras Comic mengevaluasi setiap submisi komik yang masuk di Babak Eliminasi? Apakah ada kriteria khusus atau peraturan penting yang harus dipatuhi?',
        answer:
          'Setiap submisi yang masuk pada babak eliminasi akan dinilai oleh Tim Paras Comic berdasarkan cerita, gambar, dan kesesuaian tema. Tim Paras Comic berhak untuk tidak melanjutkan penilaian apabila komik yang diterima mengandung unsur SARA.',
      },

      {
        question: 'Bagaimanakah sistem voting?',
        answer:
          'Voting akan diadakan di server Discord Paras Comic. Periode Voting dimulai dari 1 Juli dan berakhir pada 19 Juli 2022, jam 6 sore (WIB). Tidak hanya orang Indonesia, seluruh member dan pengunjung Discord Paras Comic mendapatkan akses untuk memilih dan vote komik favorit mereka melalui channel yang disediakan.',
      },

      {
        question: 'Apa sajakah tata cara untuk voting di Discord?',
        answer:
          'Kontestan sangat dianjurkan untuk join Discord Paras Comic dan mempromosikan komik mereka masing-masing. Kontestan dapat  berinteraksi dengan sesama rekan kontestan maupun pembaca melalui Discord Paras Comic. Setelah pengumuman 15 besar, akan muncul channel yang dibuat khusus agar para member Discord maupun pengunjung dapat memilih komik favorit mereka melalui voting. Periode voting adalah 1 Juli sampai 19 Juli 2022.',
      },

      {
        question: 'Apakah kompetisi ini menggunakan User Generated Content?',
        answer:
          'Kompetisi ini tidak memakai sistem UGC, dimana para kontestan bebas upload komik mereka dan langsung tayang di website Paras Comic. Paras Comic memiliki beberapa konsentrasi mengenai peraturan pelanggaran terkait SARA yang harus disortir dari setiap kontestan  yang akan mengikuti lomba ini agar seluruh komik aman dibaca tanpa menimbulkan masalah di kemudian hari.',
      },

      {
        question: 'Apakah ketika komik tayang akan ada pengumuman?',
        answer:
          'Pastinya dong! Kami akan mengirimkan email notifikasi apakah komik kamu berhasil ditayangkan atau tidak.',
      },

      {
        question: "Apakah sub-tema harus menyertakan unsur 'Fantasy'?",
        answer:
          'Wajib memiliki sub-tema fantasy, karena Paras Comic ingin memicu daya khayal dan imajinasi para author dan pembaca yang ingin membaca cerita aksi dan romansa yang berbeda. Jadi wajib dong memasukkan sub-tema Fantasy. Karena ini adalah tema kompetisi kali ini. Walaupun misalnya kamu memiliki cerita action macam gangster yang pukul-pukulan, minimal harus ditambahkan elemen fantasi semacam leveling up, atau lahir kembali, dan sebagainya. Atau untuk kategori Romance, kamu harus bisa menyertakan ide fantasi nya semacam beda ras (zombie vs manusia), atau lahir kembali di tubuh orang lain, atau memiliki sihir yang bisa bikin si karakter utama bisa memikat gebetannya.',
      },

      {
        question: ' Apabila tidak bertemakan fantasy akan didiskualifikasi?',
        answer:
          'Ya, tapi akan tetap akan melihat konsiderasi dari tim Paras Comic apakah tema komik kamu tetap bisa lolos karena mengandung "fantasy" atau tidak.',
      },

      {
        question:
          'Setelah komik saya terbit di Paras Comic, bagaimanakah sistem kepemilikan dan lisensi untuk author?',
        answer:
          'Komik kamu akan selamanya ditayangkan di website Paras Comic. Namun, IP sepenuhnya adalah milik masing-masing kontestan dan tidak ada keterikatan dengan Paras Comic. Judul komik yang ditayangkan boleh diminta untuk diturunkan sewaktu-waktu apabila kontestan membutuhkannya untuk tayang di media lain.',
      },

      {
        question:
          'Apakah Top 15 untuk setiap genre atau top 15 dari semua genre?',
        answer:
          '15 komik terbaik akan dipilih dari seluruh genre. Paras Comic tidak memberikan slot berapa banyak Action-Fantasy yang akan masuk ke 15 besar, ataupun berapa banyak Romance-Fantasy yang akan masuk ke 15 besar. Contoh, terdapat kemungkinan 15 komik terbaik terdiri dari 9 komik Action-Fantasy dan 6 komik Romance-Fantasy atau sebaliknya.',
      },

      {
        question:
          'Bagaimana jika saya mengirimkan lebih dari 1 judul, dan semuanya terpilih menjadi 15 Besar?',
        answer:
          'Dalam kasus ini, kontestan dipersilahkan untuk memilih apakah akan lanjut ke babak final dengan 1 judul komik saja atau melanjutkan semua judul komik. Kontestan juga dipersilahkan memilih akan melanjutkan kontrak eksklusif menggunakan judul komik yang mana. ',
      },

      {
        question:
          'Apakah ada kewajiban bagi 15 Besar untuk menangani kontrak eksklusif?',
        answer:
          'Penawaran kontrak eksklusif hanya berlaku untuk peserta yang berhasil tembus 15 besar. Namun, apabila peserta memiliki alasan yang jelas dan penting untuk tidak memenuhi kontrak eksklusif, harap menghubungi tim Paras Comic untuk diskusi lebih lanjut. ',
      },

      {
        question:
          'Apakah saya masih bisa menjadi komikus di Paras Comic jika tidak masuk 15 Besar?',
        answer:
          'Tentu bisa!  Buatlah karyamu sebagus mungkin dan coba kesempatan lainnya dengan mengirimkan karyamu pada menu bar Submission dan pilih Artists Submission. Kirimkan komikmu sesuai format dan siapa tahu kamu akan di kontak langsung oleh tim Paras Comic untuk menjadi komikus official di Paras Comic.',
      },

      {
        question:
          'Berapa banyak yang akan saya dapatkan jika saya mengikuti kompetisi?',
        answer:
          'Setelah kamu terpilih menjadi finalis 15 komik terbaik, kamu akan langsung mendapatkan IDR 3.5 juta dan e-sertifikat untuk setiap kontestan. Di babak final, akan ada 2 pemenang utama dari masing-masing genre yang akan memenangkan grand prize, jadi akan ada total 4 pemenang. Kamu akan mendapatkan IDR 40 juta untuk Juara 1 dan IDR 30 juta untuk Juara 2. Setelah kompetisi berakhir, saat proses menandatangani kontrak eksklusif, kamu juga akan ditawarkan biaya produksi untuk komikmu. Artinya, tambahan uang akan masuk ke dalam kantong kamu!',
      },

      {
        question:
          'Saya bukan dari Indonesia, apakah saya masih bisa mengikuti kompetisi ini?',
        answer:
          'Semua orang berhak untuk mengikuti kompetisi ini. Namun, perlu diingat bahwa salah satu persyaratannya adalah menggunakan Bahasa Indonesia.',
      },
    ],
  },
}
