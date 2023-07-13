import { Canvas } from '@react-three/fiber'
import { Leva } from 'leva'
import React from 'react'
import ReactDOM from 'react-dom/client'
import { ACESFilmicToneMapping, SRGBColorSpace } from 'three'
import { Scene } from './Scene'
import MainMenu from './MainMenu'
import { KeyboardControls } from '@react-three/drei'

import './styles/main.css'

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
        ]}>
        <Canvas
          dpr={[1, 2]}
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
        >
          {showMenu ? <MainMenu onClickPlay={() => newGame()} /> : <Scene />}
        </Canvas>
        {!showMenu ? <div className='ui'>ui</div> : null}
      </KeyboardControls>
    </div>
  )
}

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
    <Main />
  </React.StrictMode>
)
