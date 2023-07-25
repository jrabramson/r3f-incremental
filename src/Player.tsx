import * as THREE from "three"
import { useEffect, useMemo, useRef, useState } from "react"
import { useFrame, useThree } from "@react-three/fiber"
import { useKeyboardControls } from "@react-three/drei"

import Inspector from "./components/equipment/Inspector"
import Grabber from "./components/equipment/Grabber"
import { useSnapshot } from "valtio"
import { setLockCursor, setTarget, globalState, setParent } from "./state"
import { EquipRef } from "./types"
import Cutter from "./components/equipment/Cutter"
import { useSphere } from "@react-three/cannon"

const Inventory = () => {
    // lets the Player pick up and store items
    return null
}

const SPEED = 5
const direction = new THREE.Vector3()
const frontVector = new THREE.Vector3()
const sideVector = new THREE.Vector3()
const rotation = new THREE.Vector3()
const speed = new THREE.Vector3()


type PlayerProps = {
    isFocused?: boolean
    lerp?: (v0: number, v1: number, alpha: number) => number
}

const Player = ({ isFocused, lerp = THREE.MathUtils.lerp }: PlayerProps) => {
    const equipContainerRef = useRef<THREE.Group>(null)

    const equipRefs = useRef<EquipRef[] | null[]>([])
    const velocity = useRef([0, 0, 0])

    const [ref, api] = useSphere<THREE.Mesh>(() => ({ mass: 1, type: "Dynamic", position: [-2, 0, -2], radius: 0.2 }))

    const [equippedIndex, setEquippedIndex] = useState(0)
    const [lockTarget, setLockTarget] = useState<boolean>(false)

    const { camera, scene } = useThree()
    const { grabbed, target, isInspecting } = useSnapshot(globalState)

    const [subscribeKeys, get] = useKeyboardControls()

    const swapWeapon = () => {
        setEquippedIndex(i => (i + 1) > equipRefs.current.length - 1 ? 0 : i + 1)
    }

    useEffect(() => {
        setTarget(null)
    }, [equippedIndex])

    useEffect(() => {
        const unsubscribeSwapWeapon = subscribeKeys(
            (state) => state.swap,
            (value) => {
                if (value) {
                    swapWeapon()
                }
            }
        )

        return () => {
            unsubscribeSwapWeapon()
        }
    }, [subscribeKeys, equippedIndex])

    const onMouseMove = (e: MouseEvent) => {
        equipRefs.current?.[equippedIndex]?.handlers?.onMouseMove?.(e)
    }

    const onMouseDown = (e: MouseEvent) => {
        equipRefs.current?.[equippedIndex]?.handlers?.onMouseDown?.(e)
    }

    const onMouseUp = (e: MouseEvent) => {
        equipRefs.current?.[equippedIndex]?.handlers?.onMouseUp?.(e)
    }

    useEffect(() => api.velocity.subscribe((v) => (velocity.current = v)), [])

    useEffect(() => {
        window.addEventListener('mousemove', onMouseMove)
        window.addEventListener('mousedown', onMouseDown)
        window.addEventListener('mouseup', onMouseUp)

        return () => {
            window.removeEventListener('mousemove', onMouseMove)
            window.removeEventListener('mousedown', onMouseDown)
            window.removeEventListener('mouseup', onMouseUp)
        }
    }, [equippedIndex])

    const lockCursor = () => {
        setLockCursor(true)
    }

    const unlockCursor = () => {
        setLockCursor(false)
    }

    const equips = useMemo(() => {
        return [
            <Inspector
                key={0}
                active={equippedIndex === 0}
                onLockTarget={() => lockCursor()}
                onUnlockTarget={() => unlockCursor()}
                ref={e => equipRefs.current[0] = e}
            />,
            <Cutter
                key={1}
                active={equippedIndex === 1}
                ref={e => equipRefs.current[1] = e}
            />,
            <Grabber
                key={2}
                active={equippedIndex === 2}
                ref={e => equipRefs.current[2] = e}
            />
        ]
    }, [equippedIndex])

    useFrame((state) => {
        if (!grabbed && !isInspecting) {
            const objects = state.raycaster?.intersectObjects(scene.children, true)
            // console.log(objects)
            const first = objects.find((i) => i.object.name.length > 0)
            // console.log(first?.object.name)
            if (first?.object.name) {
                setTarget(first?.object.name)
                if (first?.object?.parent?.name) {
                    setParent(first?.object?.parent?.name)
                }
            } else {
                if (!isInspecting) {
                    setTarget(null)
                }
            }
        }

        const { forward, backward, left, right, jump } = get()

        ref.current?.getWorldPosition(camera.position)
        frontVector.set(0, 0, Number(backward) - Number(forward))
        sideVector.set(Number(left) - Number(right), 0, 0)
        direction.subVectors(frontVector, sideVector).normalize().multiplyScalar(SPEED).applyEuler(camera.rotation)
        speed.fromArray(velocity.current)

        if (equipContainerRef.current) {
            equipContainerRef.current.children[0].position.z = THREE.MathUtils.lerp(
                equipContainerRef.current.children[0].rotation.x,
                Math.sin(Number(speed.length() > 1) * state.clock.elapsedTime * 10) / 6,
                0.1,
            )
            equipContainerRef.current?.rotation.copy(state.camera.rotation)
            equipContainerRef.current?.position.copy(state.camera.position).add(state.camera.getWorldDirection(rotation).multiplyScalar(1))
        }

        if (!lockTarget) {
            api.velocity.set(direction.x, velocity.current[1], direction.z)
        }

        if (jump && Math.abs(parseFloat(velocity.current[1].toFixed(2))) < 0.05) {
            api.velocity.set(velocity.current[0], 10, velocity.current[2])
        }
    })

    return (
        <>
            <mesh ref={ref} />

            <Inventory />

            <group ref={equipContainerRef}>
                {equips}
            </group>
        </>
    )
}

export default Player