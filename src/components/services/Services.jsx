import { useRef, useState, useEffect } from "react";
import "./services.scss";
import { motion, useInView } from "framer-motion";
import Webcam from "react-webcam";

const variants = {
  initial: { x: -500, y: 100, opacity: 0 },
  animate: {
    x: 0,
    opacity: 1,
    y: 0,
    transition: { duration: 1, staggerChildren: 0.1 },
  },
};

const Services = () => {
  const ref = useRef(null);
  const webcamRef = useRef(null);
  const canvasRef = useRef(null);
  const [capturedImage, setCapturedImage] = useState(null);
  const [facingMode, setFacingMode] = useState("user");

  /* const isInView = useInView(ref, { margin: "-100px" }); */

  const capture = () => {
    const imageSrc = webcamRef.current.getScreenshot();
    if (imageSrc) {
      setCapturedImage(imageSrc);
    } else {
      console.error("Failed to get screenshot from webcam");
    }
  };

  useEffect(() => {
    if (capturedImage) {
      drawFrameOnCanvas(capturedImage);
    }
  }, [capturedImage]);

  const drawFrameOnCanvas = (imageSrc) => {
    const canvas = canvasRef.current;
    if (!canvas) {
      console.error("Canvas element not found in the DOM");
      return;
    }

    const ctx = canvas.getContext("2d");
    if (!ctx) {
      console.error("Failed to get 2D context");
      return;
    }

    const loadImage = (src) => {
      return new Promise((resolve, reject) => {
        const img = new Image();
        img.crossOrigin = "anonymous";
        img.src = src;
        img.onload = () => resolve(img);
        img.onerror = () => reject(new Error(`Failed to load image at ${src}`));
      });
    };

    Promise.all([
      loadImage("/Option 1.png"),
      loadImage(imageSrc),
    ])
      .then(([frameImage, staticImage]) => {
        // Set canvas size to match the static image size
        canvas.width = staticImage.width;
        canvas.height = staticImage.height;

        // Clear canvas and draw images
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.drawImage(staticImage, 0, 0);
        ctx.drawImage(frameImage, 0, 0, canvas.width, canvas.height);
      })
      .catch((error) => {
        console.error("Error loading images: ", error);
      });
  };

  const shareImage = async () => {
    const canvas = canvasRef.current;
    if (!canvas) {
      console.error("Canvas element not found in the DOM");
      return;
    }
  
    if (navigator.share) {
      try {
        const blob = await new Promise((resolve) => canvas.toBlob(resolve, "image/jpeg"));
        const file = new File([blob], "captured-photo-with-frame.jpg", {
          type: blob.type,
        });
  
        await navigator.share({
          files: [file],
          title: "Check out this photo!",
          text: "Here is a cool photo I took!",
        });
      } catch (error) {
        console.error("Error sharing the image: ", error);
      }
    } else {
      alert(
        "Sharing not supported on this device. You can download the image."
      );
    }
  };

  const downloadImage = () => {
    const canvas = canvasRef.current;
    if (canvas) {
      const link = document.createElement("a");
      link.href = canvas.toDataURL("image/jpeg");
      link.download = "captured-photo-with-frame.jpg";
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  const toggleCamera = () => {
    setFacingMode((prevMode) => (prevMode === "user" ? "environment" : "user"));
  };

  const frameStyle = {
    position: "absolute",
    top: -100,
    bottom: 0,
    background: `url('Option 1.png') no-repeat center`,
    backgroundSize: "contain",
    backgroundPosition: "center",
    pointerEvents: "none",
    width: "100%",
    height: "100%",
    objectFit: "cover",
    marginTop: "50px",
  };

  const videoConstraints = { facingMode };


  return (
    <motion.div
      className="services"
      variants={variants}
      initial="initial"
      ref={ref}
      animate="animate"
    >
      <div style={{ position: "relative", width: "100%", height: "100%" }}>
        {!capturedImage ? (
          <>
            <Webcam
              audio={false}
              ref={webcamRef}
              screenshotFormat="image/jpeg"
              videoConstraints={videoConstraints}
              style={{
                 width: "100%", 
                 height: "75%",
                  objectFit: "cover",
                  top: "0",
                  left: "0",
                  position: "absolute",
                  marginTop: "55px",

                }}
            />
            <div style={frameStyle}></div>
            <div
              style={{
                position: "absolute",
                bottom: "0",
                width: "100%",
                display: "flex",
                justifyContent: "center",
                flexDirection: "row",
              }}
            >
              <div
                style={{
                  backgroundColor: "#fff",
                  borderRadius: "40px",
                  padding: "10px",
                  boxShadow: "0px 4px 12px rgba(0, 0, 0, 0.1)",
                  display: "flex",
                  flexDirection: "row",
                  alignItems: "center",
                  justifyContent: "center",
                  marginTop: "10px",

                }}
              >
                <motion.button
                  onClick={capture}
                  style={{
                    borderRadius: "50%",
                    marginRight: "20px",
                    border: "none",
                  }}
                >
                  <img
                    src="https://firebasestorage.googleapis.com/v0/b/quickbuy-assign.appspot.com/o/c.png?alt=media&token=2527a706-264a-4e7c-b251-0becd0695dc7"
                    style={{
                      width: "50px",
                      height: "50px",
                      borderRadius: "50%",
                    }}
                    alt="Capture"
                  />
                </motion.button>
                <button
                  onClick={toggleCamera}
                  style={{ borderRadius: "50%", border: "none" }}
                >
                  <img
                    src="https://firebasestorage.googleapis.com/v0/b/quickbuy-assign.appspot.com/o/c2.png?alt=media&token=8b93d04b-0d10-45f1-b28a-f832d123bcf8"
                    style={{
                      width: "50px",
                      height: "50px",
                      borderRadius: "50%",
                    }}
                    alt="Toggle Camera"
                  />
                </button>
              </div>
            </div>
          </>
        ) : (
          <div style={{ height:"85%"/* position: "relative", width: "100%", height: "90%" */}}>
            <canvas
              ref={canvasRef}
              width={600}
              height={600}
              style={{ display: "block", /* border: "5px solid red", */ height: "85%", width: "100%" }}
            ></canvas>

            <div
              style={{
                position: "absolute",
                bottom: "0",
                width: "100%",
                display: "flex",
                justifyContent: "center",
                flexDirection: "row",
              }}
            >
              <div
                style={{
                  padding: "5px",
                  display: "flex",
                  flexDirection: "row",
                  alignItems: "center",
                  justifyContent: "center",
                  margin: "20px",
                  gap: "25px",
                  backgroundColor: "#fff",
                  borderRadius: "40px",
                  
                }}
              >
                <button
                  onClick={shareImage}
                  style={{
                    borderRadius: "50%",
                    border: "none",
                    width: "50px",
                    height: "50px",
                    backgroundColor: "transparent",
                  }}
                >
                  <img
                    src="share.png"
                    alt="Share"
                    style={{ width: "50px", height: "50px", borderRadius: "50%" }}
                  />
                </button>
                <button onClick={downloadImage}
                  style={{
                    borderRadius: "50%",
                    border: "none",
                    width: "50px",
                    height: "50px",
                    backgroundColor: "transparent",
                  }}
                >
                  <img
                    src="download.png"
                    alt="Download"
                    style={{ width: "50px", height: "50px", borderRadius: "50%" }}
                  />
                </button>
                <button onClick={() => setCapturedImage(null)}
                  style={{
                    borderRadius: "50%",
                    border: "none",
                    width: "50px",
                    height: "50px",
                    backgroundColor: "transparent",
                  }}>
                  <img
                    src="retake.png"
                    alt="Close"
                    style={{ width: "50px", height: "50px", borderRadius: "50%" }}
                  />
                  </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </motion.div>
  );
};

export default Services;