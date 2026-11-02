import React from "react";
import {
  AbsoluteFill,
  OffthreadVideo,
  Sequence,
  interpolate,
  spring,
  staticFile,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";

export const FPS = 30;
export const SCENE_SEC = 3;

// src: plik w public/clips. null = brak nagrania, wyświetla się plansza zastępcza.
type Scene = {
  label: string;
  caption: string;
  src: string | null;
  playbackRate?: number;
};

export const scenes: Scene[] = [
  { label: "PRZED", caption: "Czysta rękawica", src: null },
  { label: "MYCIE", caption: "Myjemy ruszt grillowy", src: null },
  {
    label: "PO",
    caption: "Cały brud zostaje na rękawicy",
    src: "clips/3-brudna.mp4",
    playbackRate: 0.45,
  },
  { label: "PŁUKANIE", caption: "Płuczemy pod wodą", src: null },
  { label: "PRANIE", caption: "Do pralki", src: null },
  { label: "I ZNOWU", caption: "Czysta jak nowa", src: null },
];

export const totalFrames = scenes.length * SCENE_SEC * FPS;

const font = "'Arial Black', 'Helvetica Neue', Arial, sans-serif";

const Caption: React.FC<{ label: string; caption: string }> = ({
  label,
  caption,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const pop = spring({ frame, fps, config: { damping: 12 } });
  return (
    <AbsoluteFill
      style={{ justifyContent: "flex-end", alignItems: "center", paddingBottom: 260 }}
    >
      <div
        style={{
          transform: `scale(${pop})`,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: 20,
        }}
      >
        <div
          style={{
            background: "#ff6b00",
            color: "white",
            fontFamily: font,
            fontWeight: 900,
            fontSize: 48,
            padding: "10px 28px",
            borderRadius: 14,
            letterSpacing: 2,
          }}
        >
          {label}
        </div>
        <div
          style={{
            color: "white",
            fontFamily: font,
            fontWeight: 900,
            fontSize: 76,
            textAlign: "center",
            maxWidth: 940,
            lineHeight: 1.1,
            WebkitTextStroke: "3px black",
            paintOrder: "stroke",
            textShadow: "0 6px 24px rgba(0,0,0,0.6)",
          }}
        >
          {caption}
        </div>
      </div>
    </AbsoluteFill>
  );
};

const Placeholder: React.FC<{ label: string }> = ({ label }) => (
  <AbsoluteFill
    style={{
      background: "linear-gradient(160deg, #2b2b2b, #111)",
      justifyContent: "center",
      alignItems: "center",
    }}
  >
    <div
      style={{
        border: "6px dashed #777",
        borderRadius: 30,
        padding: 60,
        color: "#aaa",
        fontFamily: font,
        fontSize: 54,
        textAlign: "center",
        marginBottom: 500,
      }}
    >
      Tu wstaw nagranie:
      <br />
      {label}
    </div>
  </AbsoluteFill>
);

const SceneView: React.FC<{ scene: Scene }> = ({ scene }) => {
  const frame = useCurrentFrame();
  const fade = interpolate(frame, [0, 8], [0, 1], { extrapolateRight: "clamp" });
  return (
    <AbsoluteFill style={{ opacity: fade, background: "black" }}>
      {scene.src ? (
        <OffthreadVideo
          src={staticFile(scene.src)}
          playbackRate={scene.playbackRate ?? 1}
          muted
          style={{ width: "100%", height: "100%", objectFit: "cover" }}
        />
      ) : (
        <Placeholder label={scene.label} />
      )}
      <Caption label={scene.label} caption={scene.caption} />
    </AbsoluteFill>
  );
};

export const GloveReel: React.FC = () => {
  const len = SCENE_SEC * FPS;
  return (
    <AbsoluteFill style={{ background: "black" }}>
      {scenes.map((s, i) => (
        <Sequence key={i} from={i * len} durationInFrames={len}>
          <SceneView scene={s} />
        </Sequence>
      ))}
    </AbsoluteFill>
  );
};
