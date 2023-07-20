import { useThree } from "@react-three/fiber"
import { useEffect, useMemo, useRef, useState, useImperativeHandle, forwardRef } from "react"
import { subscribe, useSnapshot } from "valtio"
import { setTarget, state } from "../../state"
import * as THREE from 'three'
import { EquipRef } from "../../types"

type InspectorProps = {
    onLockTarget: () => void
    onUnlockTarget: () => void
    active: boolean
}

const Inspector = forwardRef<EquipRef, InspectorProps>(({ onLockTarget, onUnlockTarget, active }, ref) => {
    const groupRef = useRef<THREE.Group>(null);
    const [isInspecting, setIsInspecting] = useState<boolean>(false)

    const { scene, camera } = useThree()

    const { target, targetMesh } = useSnapshot(state)

    const onMouseDown = (e: MouseEvent) => {
        if (!targetMesh) return;

        onLockTarget()
        setIsInspecting(true)
    }

    const onMouseUp = (e: MouseEvent) => {
        onUnlockTarget()
        setIsInspecting(false)
    }

    const onMouseMove = (e: MouseEvent) => {
        if (!targetMesh) return;

        if (!isInspecting) return;

        const m = scene.getObjectByName(targetMesh);
        if (!m) return;

        const vector = new THREE.Vector3();
        camera.getWorldDirection(vector)

        m.rotateOnWorldAxis(new THREE.Vector3(0, 1, 0), e.movementX / 100)
        // m.rotateOnWorldAxis(new THREE.Vector3(0, 1, 0), -e.movementY / 100)
        m.rotateOnWorldAxis(vector.cross(new THREE.Vector3(0, 1, 0)).normalize(), e.movementY / 100)
    }

    useImperativeHandle(ref, () => ({
        group: groupRef.current,
        handlers: {
            onMouseDown,
            onMouseUp,
            onMouseMove
        }
    }), [targetMesh, active, isInspecting]);

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