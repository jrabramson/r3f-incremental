import { useEffect, useMemo, useRef, useState } from "react"
import { setCutProgress, setTarget, state } from "../../state"
import { useSnapshot } from "valtio"
import { interpolateColor } from "../../util"
import { Color, MeshStandardMaterial } from "three"
import { useSpring, animated, a } from '@react-spring/three'

const AnimatedMaterial = animated.meshStandardMaterial as any;

type CuttableProps = {
    inspecting: boolean
    isCutting: boolean,
}

const Cuttable = ({ inspecting, isCutting }: CuttableProps) => {
    const mesh = useRef<THREE.Mesh>(null);

    const [isCut, setIsCut] = useState<boolean>(false);

    const { cutProgress } = useSnapshot(state);

    const springs = useSpring({
        color: (cutProgress === 2 || cutProgress === undefined) ? '#FFFF00' : '#FF0000',
        config: {
            duration: 2000
        }
    })

    useEffect(() => {
        if (cutProgress === undefined) return;

        if (cutProgress <= 0) {
            setIsCut(true);
        }
    }, [cutProgress])

    if (isCut) return null;

    return <mesh
        name='cuttable'
        ref={mesh}
        position={[0, 0.7, 0]}
        onPointerDown={(e) => {
            // e.stopPropagation();
            setTarget(null, 'cuttable')
        }}
        onPointerLeave={(e) => {
            e.stopPropagation();
            setCutProgress(undefined);
            // setTarget(null, null)
        }}
    >
        <boxGeometry args={[0.3, 0.3, 0.3]} />
        <AnimatedMaterial color={springs.color} />
    </mesh>
}

export default Cuttable