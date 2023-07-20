export interface Handlers {
    onMouseDown: (e: MouseEvent) => void
    onMouseUp: (e: MouseEvent) => void
    onMouseMove: (e: MouseEvent) => void
}

export type EquipRef = {
    group: THREE.Group | null
    handlers: Handlers
}