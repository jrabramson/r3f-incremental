import { RapierRigidBody, useFixedJoint } from "@react-three/rapier"

type JointProps = {
    ref: React.RefObject<RapierRigidBody>
    target: React.RefObject<RapierRigidBody>
}

const Joint = ({ ref, target }: JointProps) => {
    // @ts-ignore
    const joint = target ? useFixedJoint(ref, target, [
        // Position of the joint in bodyA's local space
        [0, 0, 0],
        // Orientation of the joint in bodyA's local space
        [0, 0, 0, 1],
        // Position of the joint in bodyB's local space
        [0, 0, 0],
        // Orientation of the joint in bodyB's local space
        [0, 0, 0, 1]
    ]) : null

    return <></>
}

export default Joint