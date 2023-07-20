import * as THREE from "three"
import * as RAPIER from "@dimforge/rapier3d-compat"
import { ReactElement, useEffect, useMemo, useRef, useState } from "react"
import { useFrame, useThree } from "@react-three/fiber"
import { useKeyboardControls, Hud } from "@react-three/drei"
import { CapsuleCollider, RigidBody, useRapier, RapierRigidBody, useFixedJoint } from "@react-three/rapier"

import Inspector from "./components/equipment/Inspector"
import Grabber from "./components/equipment/Grabber"
import { useSnapshot } from "valtio"
import { setLockCursor, setTarget, state } from "./state"
import Joint from "./components/Joint"
import { EquipRef } from "./types"
import Cutter from "./components/equipment/Cutter"

const coords = new THREE.Vector2(-1, -1);

const Inventory = () => {
    // lets the Player pick up and store items
    return null
}

const SPEED = 5
const direction = new THREE.Vector3()
const frontVector = new THREE.Vector3()
const sideVector = new THREE.Vector3()
const rotation = new THREE.Vector3()

type PlayerProps = {
    isFocused?: boolean
    lerp?: (v0: number, v1: number, alpha: number) => number
}

const Player = ({ isFocused, lerp = THREE.MathUtils.lerp }: PlayerProps) => {
    const ref = useRef<RapierRigidBody>(null)
    const equipContainerRef = useRef<THREE.Group>(null)

    const equipRefs = useRef<EquipRef[] | null[]>([])

    // const raycaster = useRef(new THREE.Raycaster());

    const [equippedIndex, setEquippedIndex] = useState(0)
    const [lockTarget, setLockTarget] = useState<boolean>(false)

    const snap = useSnapshot(state)

    const { camera, scene, raycaster } = useThree()

    const rapier = useRapier()
    const [subscribeKeys, get] = useKeyboardControls()

    const swapWeapon = () => {
        setEquippedIndex(i => (i + 1) > equipRefs.current.length - 1 ? 0 : i + 1)
    }

    useEffect(() => {
        setTarget(null, null)
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
        const t = state.raycaster?.intersectObjects(scene.children, true)[0].object.name
        console.log(t.length)
        t.length ? setTarget(null, state.raycaster?.intersectObjects(scene.children, true)[0].object.name) : setTarget(null, null)

        if (!ref.current) return

        const { forward, backward, left, right, jump } = get()
        const velocity = ref.current.linvel()

        // update camera
        state.camera.position.set(ref.current.translation().x, ref.current.translation().y + 2, ref.current.translation().z)

        if (lockTarget && snap.target) {
            // const firstQuaternion = new THREE.Quaternion().copy(state.camera.quaternion);
            // state.camera.lookAt(new THREE.Vector3(snap.target.translation().x, snap.target.translation().y, snap.target.translation().z))
            // const quaternion = new THREE.Quaternion().copy(state.camera.quaternion);
            // state.camera.quaternion.copy(firstQuaternion)

            // // slerp the camera to the target
            // const target = new THREE.Vector3(snap.target.translation().x, snap.target.translation().y, snap.target.translation().z)
            // const camera = state.camera.position
            // const targetDirection = new THREE.Vector3().subVectors(target, camera).normalize()
            // const cameraDirection = new THREE.Vector3().subVectors(camera, target).normalize()
            // const angle = targetDirection.angleTo(cameraDirection)
            // const slerp = lerp(0, angle, 0.1)
            // // const quaternion = new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3().crossVectors(targetDirection, cameraDirection).normalize(), slerp)

            // state.camera.quaternion.slerpQuaternions(state.camera.quaternion, quaternion, 1.0)
        }

        // update equipContainerRef
        if (equipContainerRef.current) {
            // equipContainerRef.current.children[0].rotation.x = lerp(equipContainerRef.current.children[0].rotation.x, Math.sin((velocity.length() > 1) * state.clock.elapsedTime * 10) / 6, 0.1)
            equipContainerRef.current.rotation.copy(state.camera.rotation)
            equipContainerRef.current.position.copy(state.camera.position).add(state.camera.getWorldDirection(rotation).multiplyScalar(1))
        }

        // movement
        frontVector.set(0, 0, +backward - +forward)
        sideVector.set(+left - +right, 0, 0)
        direction.subVectors(frontVector, sideVector).normalize().multiplyScalar(SPEED).applyEuler(state.camera.rotation)
        ref.current.setLinvel({ x: direction.x, y: velocity.y, z: direction.z }, true)

        // jumping
        const world = rapier.world
        const ray = world.castRay(new RAPIER.Ray(ref.current.translation(), { x: 0, y: -1, z: 0 }), 1.75, true)
        const grounded = ray && ray.collider && Math.abs(ray.toi) <= 1.75
        if (jump && grounded) ref.current.setLinvel({ x: 0, y: 7.5, z: 0 }, true)
    })

    return (
        <>
            <RigidBody scale={0.01} ref={ref} colliders={false} mass={1} type="dynamic" position={[-23, 16, 12]} enabledRotations={[false, false, false]}>
                <CapsuleCollider scale={0.2} args={[0.2, 0.2]} />
            </RigidBody>

            <Inventory />

            <group ref={equipContainerRef}>
                {equips}
            </group>
        </>
    )
}

export default Player