import { useEffect, useMemo, useRef, useState } from "react"
import { getObject, globalState } from "../../state"
import { useSnapshot } from "valtio"
import { Color, MeshStandardMaterial } from "three"
import { useSpring, animated, a } from '@react-spring/three'

const AnimatedMaterial = animated.meshStandardMaterial as any;

type CuttableProps = {
    parentName: string
}

const Cuttable = ({ parentName }: CuttableProps) => {
    const mesh = useRef<THREE.Mesh>(null);

    const [isCut, setIsCut] = useState<boolean>(false);

    const { objects } = useSnapshot(globalState)
    const object = useMemo(() => objects.find(o => o?.id === parentName), [objects, parentName])
    const springs = useSpring({
        color: (object?.cutProgress === 2 || object?.cutProgress === undefined) ? '#FFFF00' : '#FF0000',
        config: {
            duration: 2000
        }
    })

    useEffect(() => {
        if (object?.cutProgress === undefined) return;

        if (object?.cutProgress <= 0) {
            setIsCut(true);
        }
    }, [object?.cutProgress])

    if (isCut) return null;

    return <mesh
        name='cuttable'
        ref={mesh}
        position={[0, 0.7, 0]}
        castShadow
        receiveShadow
    >
        <boxGeometry args={[0.3, 0.3, 0.3]} />
        <AnimatedMaterial color={springs.color} />
    </mesh>
}

export default Cuttable