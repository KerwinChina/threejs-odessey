import { OrbitControls } from "@react-three/drei";
import { Perf } from "r3f-perf";
import { Canvas } from "@react-three/fiber";
import { useStore } from "./store.jsx";
import PingPong from "./PingPong.jsx";

const style = (welcome) => ({
  color: "white",
  display: welcome ? "block" : "none",
  fontSize: "1.2em",
  left: 50,
  position: "absolute",
  top: 50,
});

export default function Experience() {
  const welcome = useStore((state) => state.welcome);
  const { reset } = useStore((state) => state.api);
  return (
    <>
      <Canvas
        shadows
        camera={{ fov: 50, position: [0, 5, 12] }}
        onPointerMissed={() => welcome && reset(false)}
      >
        <Perf position="top-right" />
        <OrbitControls makeDefault />
        <color attach="background" args={["#171720"]} />
        <ambientLight intensity={0.5} />
        <pointLight position={[-10, -10, -10]} />
        <spotLight
          position={[10, 10, 10]}
          angle={0.3}
          penumbra={1}
          intensity={1}
          castShadow
          shadow-mapSize-width={2048}
          shadow-mapSize-height={2048}
          shadow-bias={-0.0001}
        />
        <PingPong />
      </Canvas>
      <div style={style(welcome)}>* click anywhere to start</div>
    </>
  );
}
