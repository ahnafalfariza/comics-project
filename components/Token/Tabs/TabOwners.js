import Avatar from 'components/Common/Avatar'
import Button from 'components/Common/Button'

const TabOwners = ({ localToken }) => {
  return (
    <div className="mt-4">
      {localToken.ownerships.map((owner) => (
        <Owner key={owner.id} />
      ))}
    </div>
  )
}

const Owner = () => {
  return (
    <div className="bg-blueGray-900 border border-blueGray-700 mt-3 p-3 rounded-md shadow-md">
      <div className="flex items-center justify-between">
        <div className="flex items-center">
          <Avatar size="md" />
          <p className="ml-2 text-white font-semibold">ahnaf.near</p>
        </div>
        <div>
          <p className="text-white text-sm opacity-80">Owns 3</p>
        </div>
      </div>
      <div className="mt-2 flex items-center justify-between">
        <p className="text-white text-sm opacity-80">On sale for 5 Ⓝ</p>
        <Button size="sm" className="w-20">
          Buy
        </Button>
      </div>
    </div>
  )
}

export default TabOwners
