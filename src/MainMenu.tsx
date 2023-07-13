import { useRef } from 'react'
import { Text, Center, PerspectiveCamera } from '@react-three/drei'
import { useThree } from '@react-three/fiber'

type MainMenuProps = {
    onClickPlay: () => void
}

const MainMenu = ({ onClickPlay }: MainMenuProps) => {
    const viewport = useThree((state) => state.viewport)
    return (
        <>
            <ambientLight intensity={1.0} />
            <PerspectiveCamera makeDefault position={[0, 0, 10]} />
            <Center top right onCentered={({ container, width, height }) => {
                container.scale.setScalar(1)
            }}>
                <Text position={[0, 4, 0]} textAlign='center' fontSize={1.0}>Doomsday</Text>
                <Text
                    onPointerEnter={(e) => document.body.style.cursor = 'pointer'}
                    onPointerLeave={(e) => document.body.style.cursor = 'default'}
                    textAlign='center' position={[0, 2, 0]} fontSize={0.5} onClick={onClickPlay}>
                    new game
                </Text>
            </Center>
        </>
    )
}

export default MainMenu
