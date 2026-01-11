"use client";
import { Container } from "@mui/material";
import { useParams } from "next/navigation";
import { useEffect } from "react";
import "../../assets/game/whale/TemplateData/style.css";

declare global {
  interface Window {
    whaleInit: any; // Use a more specific type if known, e.g., Function or object type
  }
}

export default function Slot() {
  const { id } = useParams();

  const rawHtml = `<div id="unity-container" class="unity-desktop">
      <canvas id="unity-canvas" width=730 height=1020 tabindex="-1"></canvas>
      <div id="unity-loading-bar">
        <div id="unity-logo" style="display:none;"></div>
        <div id="unity-progress-bar-empty">
          <div id="unity-progress-bar-full"></div>
        </div>
      </div>
      <div id="unity-warning"> </div>
      <div id="unity-footer">
        <div id="unity-webgl-logo" style="display:none;"></div>
        <div id="unity-fullscreen-button"></div>
        <div id="unity-build-title" style="display:none;">slots</div>
      </div>
    </div>
    `;

  useEffect(() => {
    window.whaleInit(id);
  }, []);

  return (
    <Container
      style={{
        margin: 0,
        padding: 0,
        position: "absolute",
        height: "100vh",
        width: "100vw",
      }}
    >
      {
        <div
          dangerouslySetInnerHTML={{
            __html: rawHtml,
          }}
        />
      }
    </Container>
  );
}
