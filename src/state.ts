import { RapierRigidBody } from '@react-three/rapier'
import { proxy, useSnapshot } from 'valtio'

export const state = proxy<{
    target: RapierRigidBody | null,
    targetMesh: string | null,
    isKinematic: boolean,
    cutProgress: number | undefined,
    lockCursor: boolean,
}>({
    target: null,
    targetMesh: null,
    isKinematic: false,
    cutProgress: undefined,
    lockCursor: false
})

export const setTarget = (t: RapierRigidBody | null, tm: string | null) => {
    state.target = t
    state.targetMesh = tm
}

export const setKinematic = (k: boolean) => {
    state.isKinematic = k
}

export const setCutProgress = (p: number | undefined) => {
    state.cutProgress = p
}

export const setLockCursor = (l: boolean) => {
    state.lockCursor = l
}