import { Canvas, useFrame } from '@react-three/fiber'
import { useGLTF, OrbitControls, Environment, Center, Html } from '@react-three/drei'
import { Suspense, memo } from 'react'

function Model({ url }) {
  const { scene } = useGLTF(url)
  return <primitive object={scene} />
}

// Preload the model
useGLTF.preload('/models/ssss.glb')

// Keeps the render loop alive
function KeepAlive() {
  useFrame(() => {})
  return null
}

const SceneContent = memo(function SceneContent() {
  return (
    <>
      <ambientLight intensity={0.7} />
      <directionalLight position={[5, 8, 5]} intensity={1.2} />
      <directionalLight position={[-5, 5, -5]} intensity={0.4} />

      <Suspense
        fallback={
          <Html center>
            <div style={{ color: 'white', background: 'rgba(0,0,0,0.6)', padding: '8px 16px', borderRadius: 6 }}>
              Loading model…
            </div>
          </Html>
        }
      >
        <Center>
          <Model url="/models/ssss.glb" />
        </Center>
      </Suspense>

      <OrbitControls
        makeDefault
        maxPolarAngle={Math.PI / 2}
        minDistance={2}
        maxDistance={15}
      />

      <Environment preset="warehouse" />
      <KeepAlive />
    </>
  )
})

function Scene() {
  return (
    <div style={{ width: '100%', height: '500px', background: '#111' }}>
      <Canvas
        dpr={[1, 1.5]}
        camera={{ position: [3, 2, 5], fov: 45 }}
        gl={{
          antialias: true,
          powerPreference: 'high-performance',
          preserveDrawingBuffer: true,
        }}
        onCreated={({ gl }) => {
          gl.setClearColor('#1a1a1a')

          const canvas = gl.domElement
          canvas.addEventListener('webglcontextlost', (e) => {
            e.preventDefault()
            console.error('WebGL context lost')
          })
          canvas.addEventListener('webglcontextrestored', () => {
            console.log('WebGL context restored')
          })
        }}
      >
        <SceneContent />
      </Canvas>
    </div>
  )
}

export default memo(Scene)