// src/components/AnnotationCanvas.js
import { useEffect, useRef } from "react";
import { fabric } from "fabric";
import { Box, Button, Stack } from "@mui/material";

const AnnotationCanvas = ({ imageUrl, onSave }) => {
  const canvasRef = useRef(null);
  const fabricRef = useRef(null);

  useEffect(() => {
    if (!canvasRef.current) return;

    const canvas = new fabric.Canvas(canvasRef.current, {
      width: 300,
      height: 200,
    });
    fabricRef.current = canvas;

    let isMounted = true;

    if (imageUrl) {
      fabric.Image.fromURL(
        imageUrl,
        (img) => {
          if (!img || !isMounted || !fabricRef.current) return;
          // try to avoid tainting; request anonymous crossOrigin
          try {
            img.set({ crossOrigin: "Anonymous" });
          } catch (e) {
            // ignore
          }
          img.scaleToWidth(canvas.width);
          img.scaleToHeight(canvas.height);
          canvas.setBackgroundImage(img, canvas.renderAll.bind(canvas));
        },
        { crossOrigin: "Anonymous" }
      );
    }

    return () => {
      isMounted = false;
      canvas.dispose();
      fabricRef.current = null;
    };
  }, [imageUrl]);

  const addShape = (type) => {
    if (!fabricRef.current) return;
    if (type === "rect")
      fabricRef.current.add(new fabric.Rect({ left: 50, top: 50, fill: "rgba(255,0,0,0.3)", width: 80, height: 60 }));
    if (type === "circle")
      fabricRef.current.add(new fabric.Circle({ left: 120, top: 80, radius: 30, fill: "rgba(0,0,255,0.3)" }));
    if (type === "arrow")
      fabricRef.current.add(new fabric.Line([50, 100, 200, 150], { stroke: "green", strokeWidth: 3 }));
  };

  const toggleFreeDraw = () => {
    if (!fabricRef.current) return;
    fabricRef.current.isDrawingMode = !fabricRef.current.isDrawingMode;
  };

  const handleSave = () => {
    const canvas = fabricRef.current;
    if (!canvas) return;
    const json = canvas.toJSON();

    try {
      // Try to export image; if canvas is tainted this will throw
      const dataUrl = canvas.toDataURL({ format: "png" });
      onSave(json, dataUrl);
    } catch (err) {
      // Tainted canvas or other export error: send only JSON
      console.error("Canvas export failed (likely CORS):", err);
      onSave(json, null);
    }
  };

  return (
    <Box>
      <Stack direction="row" spacing={1} mb={1}>
        <Button size="small" variant="outlined" onClick={() => addShape("rect")}>Rectangle</Button>
        <Button size="small" variant="outlined" onClick={() => addShape("circle")}>Circle</Button>
        <Button size="small" variant="outlined" onClick={toggleFreeDraw}>Free Draw</Button>
        <Button size="small" variant="outlined" onClick={() => addShape("arrow")}>Arrow</Button>
        <Button size="small" variant="contained" onClick={handleSave}>Save</Button>
      </Stack>
      <canvas ref={canvasRef} style={{ border: "1px solid #ccc", borderRadius: "6px" }} />
    </Box>
  );
};

export default AnnotationCanvas;
