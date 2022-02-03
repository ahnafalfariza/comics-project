import Head from 'components/Common/Head'
import Layout from 'components/Common/Layout'
import React from 'react'
import Link from 'next/link'
import axios from 'axios'
import { parseImgUrl } from 'utils/common'

const Submission = ({ submissions }) => {
  return (
    <Layout>
      <Head title="Submission" />
      <div className="max-w-6xl m-auto p-4 py-8">
        <p className="text-black font-bold text-4xl mb-14">Submission</p>
        <div className="md:flex gap-14">
          {submissions.map((submission) => (
            <div key={submission._id} className="px-2 mb-10">
              <Link
                href={{
                  pathname: `/submission/${submission.type_submission}`,
                  query: {
                    title: submission.title,
                    description: submission.description,
                  },
                }}
              >
                <a className="cursor-pointer">
                  <img
                    className="shadow-xl hover:shadow-md transition duration-500 ease-in-out rounded-3xl mb-3"
                    src={`${parseImgUrl(submission.cover)}`}
                    width={300}
                  />
                </a>
              </Link>
              <h4 className="font-bold">{submission.title}</h4>
            </div>
          ))}
        </div>
      </div>
    </Layout>
  )
}

export default Submission

export async function getServerSideProps() {
  const response = await axios.get(
    `${process.env.COMIC_API_URL}/submission-types`
  )
  const submissions = response.data.result || null

  return {
    props: { submissions },
  }
}
