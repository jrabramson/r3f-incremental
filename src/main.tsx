import { Canvas, useFrame, useThree } from '@react-three/fiber'
import { Leva } from 'leva'
import React, { useEffect, useRef } from 'react'
import ReactDOM from 'react-dom/client'
import { ACESFilmicToneMapping, SRGBColorSpace, Scene } from 'three'
import { Scene as Game } from './Scene'
import MainMenu from './MainMenu'
import { KeyboardControls, PerspectiveCamera } from '@react-three/drei'
import Effects from './Effects'

import './styles/main.css'
import HUD from './HUD'

function Content() {
  const scene = useRef<Scene | null>(null)
  const { camera } = useThree()

  const { size } = useThree()
  // useEffect(() => void setDefaultCamera(camera.current), [])
  useFrame(() => camera?.updateMatrixWorld())
  useFrame(({ gl }) => void ((gl.autoClear = true), gl.render(scene.current!, camera)), 100)
  return <scene ref={scene}>
    <Game />
  </scene>
}

function Main() {
  const [showMenu, setShowMenu] = React.useState(false)

  const newGame = () => {
    setShowMenu(false)
  }

  return (
    <div className='main'>
      <Leva
        collapsed={true}
        oneLineLabels={false}
        flat={true}
        theme={{
          sizes: {
            titleBarHeight: '28px',
          },
          fontSizes: {
            root: '10px',
          },
        }}
      />
      <KeyboardControls
        map={[
          { name: "forward", keys: ["ArrowUp", "w", "W"] },
          { name: "backward", keys: ["ArrowDown", "s", "S"] },
          { name: "left", keys: ["ArrowLeft", "a", "A"] },
          { name: "right", keys: ["ArrowRight", "d", "D"] },
          { name: "jump", keys: ["Space"] },
          { name: "swap", keys: ["Q", "q"] },
          { name: "weapon1", keys: ["1"] },
          { name: "weapon2", keys: ["2"] },
        ]}>
        <Canvas
          dpr={window.devicePixelRatio}
          gl={{
            antialias: true,
            toneMapping: ACESFilmicToneMapping,
            outputColorSpace: SRGBColorSpace,
          }}
          camera={{
            fov: 55,
            near: 0.1,
            far: 200,
            position: [3, 2, 9],
          }}
          shadows
          raycaster={{ params: { Line: { threshold: 0.15 } } }}
        >
          {showMenu ? <MainMenu onClickPlay={() => newGame()} /> : <>
            {/* <PerspectiveCamera
              ref={camera}
              aspect={size.width / size.height}
              // radius={(size.width + size.height) / 4}
              onUpdate={self => self.updateProjectionMatrix()}
              makeDefault={true}
            /> */}
            <Content />
            <HUD />
          </>}
          {/* <Effects /> */}
        </Canvas>
        {!showMenu ? <div className='ui'>ui</div> : null}
        {!showMenu && <div className="dot" />}
      </KeyboardControls>
    </div>
  )
}

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
    <Main />
  </React.StrictMode>
)
