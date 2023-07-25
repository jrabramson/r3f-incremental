import { animated, useSpring } from "@react-spring/three";
import { setTarget } from "../../state";
import { useEffect, useRef, useState } from "react";
import { Mesh } from "three";
import { useThree } from "@react-three/fiber";

type ValuableProps = {
    parentName: string
}

const Valuable = ({ parentName }: ValuableProps) => {
    const mesh = useRef<Mesh>(null);

    const { scene } = useThree();

    const [isGrabbed, setIsGrabbed] = useState<boolean>(false);

    const { position } = useSpring({
        position: [0, 0.7, 0],
        config: {
            duration: 2000
        }
    })

    useEffect(() => {
        if (isGrabbed) {
            const obj = scene.getObjectByName(mesh.current?.name!);
            obj?.getWorldPosition(obj.position);
            scene.add(obj!)
        }
    }, [isGrabbed])

    return <animated.mesh
        ref={mesh}
        position={[0, 0.7, 0]}
        name='valuable'
        castShadow
        receiveShadow
    >
        <boxGeometry args={[0.2, 0.2, 0.2]} />
        <meshStandardMaterial color={'gold'} />
    </animated.mesh>
}

export default Valuable