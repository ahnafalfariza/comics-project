import Head from 'components/Common/Head'
import Layout from 'components/Common/Layout'
import React from 'react'
import Link from 'next/link'
import axios from 'axios'
import { parseImgUrl } from 'utils/common'
import { useEffect, useState } from 'react'

const Submission = () => {
  const [submissions, setSubmissions] = useState([])

  useEffect(() => {
    const fetchSubmssions = async () => {
      const res = await axios.get(
        `${process.env.COMIC_API_URL}/submission-types`
      )
      const resSubmission = res.data.result.filter((sub) => sub.is_active)
      setSubmissions(resSubmission)
    }
    fetchSubmssions()
  }, [])

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
                }}
              >
                <a className="cursor-pointer">
                  <img
                    className="shadow-xl hover:shadow-md transition duration-500 ease-in-out rounded-3xl mb-3 mx-auto"
                    src={`${parseImgUrl(submission.cover)}`}
                    width={300}
                  />
                </a>
              </Link>
              <div className="md:flex items-center gap-4">
                <h4 className="font-bold text-center md:text-left capitalize">
                  {submission.type_submission} submission
                </h4>
                <div className="hidden md:block w-full h-2 bg-[#F5A1DB]" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </Layout>
  )
}

export default Submission
