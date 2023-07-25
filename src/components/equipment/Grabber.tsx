import { forwardRef, useEffect, useImperativeHandle, useRef, useState } from "react"
import { useSnapshot } from "valtio"
import { setGrabbing, globalState } from "../../state"
import * as THREE from "three"
import { EquipRef } from "../../types"

type GrabberProps = {
    active: boolean
}

const Grabber = forwardRef<EquipRef, GrabberProps>(({ active }, ref) => {
    const groupRef = useRef<THREE.Group>(null)

    const [dragging, setDragging] = useState(false);
    const [s] = useState<{ mouse: { x: number; y: number } | null }>({
        mouse: null
    });

    const { target } = useSnapshot(globalState)


    const onMouseDown = (e: MouseEvent) => {
        if (!target) return;

        setDragging(true)
    }

    const onMouseUp = (e: MouseEvent) => {
        setDragging(false)
    }

    const onMouseMove = () => {

    }

    useEffect(() => {
        if (active && dragging) {
            setGrabbing(target)
        } else {
            setGrabbing(null)
        }
    }, [active, dragging, target])

    useImperativeHandle(ref, () => ({
        group: groupRef.current,
        handlers: {
            onMouseDown,
            onMouseUp,
            onMouseMove
        }
    }), [target, active, dragging]);

    return active ? (
        <group ref={groupRef}>
            <mesh position={[0.3, -0.35, 0.5]}>
                <boxGeometry args={[0.1, 0.1, 0.5]} />
                <meshStandardMaterial color="yellow" />
            </mesh>
        </group>
    ) : <></>
})

export default Grabber