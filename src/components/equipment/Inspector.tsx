import { useThree } from "@react-three/fiber"
import { useRef, useImperativeHandle, forwardRef } from "react"
import { useSnapshot } from "valtio"
import { setInspecting, globalState } from "../../state"
import * as THREE from 'three'
import { EquipRef } from "../../types"

type InspectorProps = {
    onLockTarget: () => void
    onUnlockTarget: () => void
    active: boolean
}

const Inspector = forwardRef<EquipRef, InspectorProps>(({ onLockTarget, onUnlockTarget, active }, ref) => {
    const groupRef = useRef<THREE.Group>(null);

    const { target } = useSnapshot(globalState)

    const onMouseDown = (e: MouseEvent) => {
        if (!target) return;

        onLockTarget()
        setInspecting(true)
    }

    const onMouseUp = (e: MouseEvent) => {
        onUnlockTarget()
        setInspecting(false)
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
    }), [target, active]);

    return active ? (
        <group ref={groupRef}>
            <mesh position={[0.3, -0.35, 0.5]}>
                <boxGeometry args={[0.1, 0.1, 0.5]} />
                <meshStandardMaterial color="green" />
            </mesh>
        </group>
    ) : <></>
})

export default Inspector