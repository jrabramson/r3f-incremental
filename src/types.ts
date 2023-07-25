import { GLTF } from "three/examples/jsm/loaders/GLTFLoader"

export interface Handlers {
    onMouseDown: (e: MouseEvent) => void
    onMouseUp: (e: MouseEvent) => void
    onMouseMove: (e: MouseEvent) => void
}

export type EquipRef = {
    group: THREE.Group | null
    handlers: Handlers
}

export type GLTFResult = GLTF & {
    nodes: {
        [key: string]: THREE.Mesh
    }
    materials: {
        [key: string]: THREE.Material
    }
}