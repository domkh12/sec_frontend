import { memo } from 'react'
import Scene from '../../components/models3D/Model3D'

const MemoizedScene = memo(Scene)

function RackList() {
  return (
    <div style={{ padding: '20px' }}>
      <h2>Rack 3D View</h2>
      <MemoizedScene />
    </div>
  )
}

export default RackList