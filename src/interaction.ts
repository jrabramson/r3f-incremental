import { Ref, createRef, useEffect, useMemo, useRef } from 'react'
import { useFrame, useThree } from '@react-three/fiber'
import { PublicApi, Quad, usePointToPointConstraint, useSphere } from '@react-three/cannon'
import { Mesh, Object3D, Vector3 } from 'three'
import { globalState } from './state'
import { useSnapshot } from 'valtio'


function useDragConstraint(name: string, child: Ref<Object3D>, childApi: PublicApi, active: boolean = false) {
    const rotation = useRef<Quad>([0, 0, 0, 0])
    const dragger = createRef<Object3D>()

    const { target, isInspecting, grabbed, objects } = useSnapshot(globalState)
    const obj = objects.find(o => o.id === name)
    const isGrabbed = grabbed === name

    const [, , api] = usePointToPointConstraint(dragger, child, { pivotA: [0, 0, 0], pivotB: [0, 0, 0] })

    const [, dragApi] = useSphere(() => ({ collisionFilterMask: 0, type: 'Kinematic', mass: 0, args: [0.5] }), dragger)

    const { camera } = useThree()

    useEffect(() => {
        if (obj?.clamped && !isGrabbed) {
            childApi.mass.set(0)
            childApi.velocity.set(0, 0, 0)
            childApi.angularVelocity.set(0, 0, 0)
        } else {
            childApi.mass.set(1)
        }
    }, [obj, grabbed, active, target])

    useEffect(() => childApi.quaternion.subscribe((r) => (rotation.current = r)), [])
    useEffect(() => void api.disable(), [])

    useEffect(() => {
        if (isInspecting) {
            void api.disable()
        } else if (isGrabbed) {
            void api.enable()
        } else {
            void api.disable()
        }
    }, [isInspecting, grabbed])

    const onMouseMove = (e: MouseEvent) => {
        const m = new Mesh()
        const vector = new Vector3()

        camera.getWorldDirection(vector)

        m.quaternion.set(...rotation.current)

        m?.rotateOnWorldAxis(new Vector3(0, 1, 0), e.movementX / 20)
        m?.rotateOnWorldAxis(vector.cross(new Vector3(0, 1, 0)).normalize(), e.movementY / 20)

        m?.quaternion && childApi.quaternion.set(m.quaternion.x, m.quaternion.y, m.quaternion.z, m.quaternion.w)
    }

    useEffect(() => {
        if (!active) {
            document.removeEventListener('mousemove', onMouseMove)
            return
        }

        if (isInspecting && obj?.clamped) {
            document.addEventListener('mousemove', onMouseMove)
            return () => {
                document.removeEventListener('mousemove', onMouseMove)
            }
        }
    }, [name, obj, isInspecting, rotation.current])

    useFrame((state) => {
        if (grabbed === name) {
            const dir = new Vector3()
            const direction = camera.getWorldDirection(dir);

            childApi.angularVelocity.set(0, 0, 0)

            dragApi.position.set(camera.position.x + direction.x * 3.5,
                camera.position.y + direction.y * 3.5,
                camera.position.z + direction.z * 3.5)
        }
    })

    return {}
}

export { useDragConstraint }
