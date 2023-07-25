import { globalState, setClamped } from '../../state'
import { useBox, BoxProps, CollideEvent } from '@react-three/cannon'
import { Mesh } from 'three'
import { useRef } from 'react'
import { useSnapshot } from 'valtio'

function BoxTrigger({ args, onCollide, position, onCollideEnd }: BoxProps) {
    const [ref] = useBox(() => ({ args, isTrigger: true, onCollide, position, onCollideEnd }), useRef<Mesh>(null))
    return (
        <mesh {...{ position, ref }}>
            <boxGeometry args={args} />
            <meshStandardMaterial transparent opacity={0.2} color="green" />
        </mesh>
    )
}

type ClampProps = {

}

// square mesh that uses a cannon useBox, when another cannon mesh is on top of it, dsiable gravity for that mesh
const Clamp = ({ }: ClampProps) => {
    const [ref] = useBox<Mesh>(() => ({ type: 'Static' }))
    const { target } = useSnapshot(globalState)

    const onCollide = (e: CollideEvent) => {
        // console.log('Collision event on BoxTrigger', e.target)
        setClamped(true)
        // setGrabbing(false)
    }

    return (
        <mesh ref={ref}>
            <BoxTrigger
                args={[2.0, 4.0, 2.0]}
                onCollide={() => setClamped(true)}
                onCollideEnd={() => setClamped(false)}
                position={[0, 0.3, 0]}
            />
            <boxGeometry args={[1, 0.3, 1]} />
            <meshStandardMaterial color="yellow" />
        </mesh>
    );
}

export default Clamp