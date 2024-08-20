import React, { useRef, useEffect } from "react";

const TestCanvas = () => {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (canvas) {
      const ctx = canvas.getContext("2d");
      if (ctx) {
        ctx.fillStyle = "blue";
        ctx.fillRect(10, 10, 150, 100);
      } else {
        console.error("Failed to get 2D context");
      }
    } else {
      console.error("Canvas reference is null");
    }
  }, []);

  return (
    <div>
      <canvas ref={canvasRef} width={200} height={200} style={{ border: "1px solid black" }} />
    </div>
  );
};

export default TestCanvas;
