type PartProps = {
    inspecting: boolean
}

const Part = ({ inspecting }: PartProps) => {
    return <mesh position={[0, 0.7, 0]}>
        <boxGeometry args={[0.3, 0.3, 0.3]} />
        <meshStandardMaterial color={'green'} />
    </mesh>
}

export default Part