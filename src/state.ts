import { proxy } from 'valtio'

// Global

type InteratableState = {
    id: string,
    cutProgress: number | undefined,
    clamped: boolean | null,
}

export const globalState = proxy<{
    target: string | null,
    parent: string | null,
    lockCursor: boolean,
    grabbed: string | null,
    isInspecting: boolean,
    objects: InteratableState[]
}>({
    grabbed: null,
    isInspecting: false,
    target: null,
    parent: null,
    lockCursor: false,
    objects: []
})

export const setLockCursor = (l: boolean) => {
    globalState.lockCursor = l
}

export const setTarget = (m: string | null) => {
    globalState.target = m
}

export const setParent = (m: string | null) => {
    globalState.parent = m
}

export const setInspecting = (t: boolean) => {
    globalState.isInspecting = t
}

export const setGrabbing = (name: string | null) => {
    console.log('grabbed - state', name)
    globalState.grabbed = name
}

export const setCutProgress = (id: string, p: number | undefined) => {
    const object = globalState.objects.find(o => o.id === id)

    if (object) {
        object.cutProgress = p
    }
}

export const setClamped = (c: boolean | null) => {
    const object = globalState.objects.find(o => o.id === globalState.target)
    // console.log('setClamped', c, object)/
    if (object) {
        object.clamped = c
    }
}

export const addObject = (id: string) => {
    globalState.objects.push({
        id,
        cutProgress: undefined,
        clamped: null
    })
}

export const removeObject = (id: string) => {
    globalState.objects = globalState.objects.filter(o => o.id !== id)
}

export const getObject = (id: string) => {
    return globalState.objects.find(o => o.id === id)
}