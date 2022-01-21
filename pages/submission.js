import Head from 'components/Common/Head'
import Layout from 'components/Common/Layout'
import React from 'react'
import Link from 'next/link'

const Submission = () => {
  return (
    <Layout>
      <Head title="Submission" />
      <div className="max-w-6xl m-auto p-4 py-8">
        <p className="text-black font-bold text-4xl mb-14">Submission</p>
        <div className="md:flex gap-14">
          <div className="px-2 mb-10">
            <Link href="/artist-submission">
              <a className="cursor-pointer">
                <div className="bg-gray-100 hover:bg-opacity-80 p-40 rounded-3xl mb-3"></div>
              </a>
            </Link>
            <h4 className="font-bold">Artist Submission</h4>
          </div>
          <div className="px-2">
            <Link href="/valentine-competition-submission">
              <a className="cursor-pointer">
                <div className="bg-gray-100 hover:bg-opacity-80 p-40 rounded-3xl mb-3"></div>
              </a>
            </Link>
            <h4 className="font-bold">Valentine Competition Submission</h4>
          </div>
        </div>
      </div>
    </Layout>
  )
}

export default Submission
