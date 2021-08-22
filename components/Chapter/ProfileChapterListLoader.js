import ProfileChapterLoader from 'components/Chapter/ProfileChapterLoader'

const ProfileChapterListLoader = () => (
  <div>
    {[1, 2, 3, 4, 5, 6].map((k) => {
      return (
        <div key={k} className="w-full mt-8">
          <ProfileChapterLoader uniqueKey={k} />
        </div>
      )
    })}
  </div>
)

export default ProfileChapterListLoader
