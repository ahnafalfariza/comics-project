import Head from 'components/Common/Head'
import Layout from 'components/Common/Layout'
import React from 'react'
import Link from 'next/link'

const Submission = () => {
  return (
    <Layout>
      <Head title="Submission" />
      <div className="max-w-6xl m-auto p-4 py-8">
        <p className="text-black font-bold text-4xl mt-10 mb-10">Submission</p>
        <div className="flex gap-14">
          <div>
            <div className="bg-gray-100 p-40 rounded-3xl"></div>
            <Link href="/artist-submission">
              <a>
                <h4 className="mt-3 font-bold cursor-pointer hover:opacity-70">
                  Artist Submission
                </h4>
              </a>
            </Link>
          </div>
          <div>
            <div className="bg-gray-100 p-40 rounded-3xl"></div>
            <Link href="/valentine-competition-submission">
              <a>
                <h4 className="mt-3 font-bold cursor-pointer hover:opacity-70">
                  Valentine Competition Submission
                </h4>
              </a>
            </Link>
          </div>
        </div>
      </div>
    </Layout>
  )
}

export default Submission
