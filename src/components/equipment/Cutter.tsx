import { useEffect, useRef, useState, useImperativeHandle, forwardRef } from "react"
import { useSnapshot } from "valtio"
import * as THREE from 'three'

import { setCutProgress, globalState } from "../../state"
import { EquipRef } from "../../types"
import { Cylinder } from "@react-three/drei"

type CutterProps = {
    active: boolean
}

const Cutter = forwardRef<EquipRef, CutterProps>(({ active }, ref) => {
    const groupRef = useRef<THREE.Group>(null);
    let intervalRef = useRef<number | undefined>();

    const [isCutting, setIsCutting] = useState<boolean>(false)
    const [num, setNum] = useState<number>(2);

    const { target, parent } = useSnapshot(globalState)

    const cut = () => {
        if (num === 0) {
            clearInterval(intervalRef.current);
            return;
        }
        setNum(num - 0.1);
    }

    useEffect(() => {
        if (!isCutting || !target?.includes('cuttable')) return;
        intervalRef.current = setInterval(cut, 100);

        return () => clearInterval(intervalRef.current);
    }, [isCutting, num, target]);

    useEffect(() => {
        parent && setCutProgress(parent, num);
    }, [num, parent]);

    const onMouseDown = (e: MouseEvent) => {
        setIsCutting(true)
    }

    const onMouseUp = (e: MouseEvent) => {
        setIsCutting(false)
        setNum(2.0)
    }

    const onMouseMove = (e: MouseEvent) => {

    }

    useImperativeHandle(ref, () => ({
        group: groupRef.current,
        handlers: {
            onMouseDown,
            onMouseUp,
            onMouseMove
        }
    }), [target, active, isCutting]);

    return active ? (
        <group ref={groupRef}>
            <mesh position={[0.3, -0.35, 0.5]} rotation={[0.07, 0.06, 0]} renderOrder={2}>
                <boxGeometry args={[0.1, 0.1, 0.5]} />
                <meshStandardMaterial color="red" depthTest={false} />
                {isCutting && <Cylinder args={[0.01, 0.01, 10]} position={[0, 0, 0]} rotation={[Math.PI / 2, 0, 0]} renderOrder={1}>
                    <meshStandardMaterial color="red" depthTest={false} emissive={0xff0000} emissiveIntensity={5.0} />
                </Cylinder>}
            </mesh>
        </group>
    ) : <></>
})

export default Cutter