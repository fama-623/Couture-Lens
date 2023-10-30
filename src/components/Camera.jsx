import { useRef, useEffect } from 'react';

function Camera() {
  const videoRef = useRef(null);
  const canvasRef = useRef(null);

  useEffect(() => {
    async function enableStream() {
      try {
        const constraints = {
          video: {
            facingMode: { ideal: 'environment' } // Prefer rear-facing camera, but allow fallback
          }
        };
        const stream = await navigator.mediaDevices.getUserMedia(constraints);
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
        }
      } catch (err) {
        console.error('Error accessing the camera: ', err);
      }
    }

    enableStream();

    // Clean up
    return () => {
      if (videoRef.current && videoRef.current.srcObject) {
        videoRef.current.srcObject.getTracks().forEach(track => track.stop());
      }
    };
  }, []);

  const handleSave = () => {
    const videoElement = videoRef.current;
    const canvasElement = canvasRef.current;
    if (videoElement && canvasElement) {
      const context = canvasElement.getContext('2d');
  
      // You can adjust this value for a different maximum resolution
      const maxResolution = 1920;
  
      // Calculate the scaling factor based on maximum resolution
      const scale = Math.min(maxResolution / videoElement.videoWidth, 1);
      
      // Set the canvas size based on video resolution and scaling factor
      canvasElement.width = videoElement.videoWidth * scale;
      canvasElement.height = videoElement.videoHeight * scale;
  
      // Draw a white rectangle to cover the entire canvas
      context.fillStyle = 'white';
      context.fillRect(0, 0, canvasElement.width, canvasElement.height);
  
      // Draw the video frame to the canvas while maintaining its aspect ratio
      const videoAspectRatio = videoElement.videoWidth / videoElement.videoHeight;
      let videoWidth = canvasElement.width;
      let videoHeight = videoWidth / videoAspectRatio;
      if (videoHeight > canvasElement.height) {
        videoHeight = canvasElement.height;
        videoWidth = videoHeight * videoAspectRatio;
      }
      const videoX = (canvasElement.width - videoWidth) / 2;
      const videoY = (canvasElement.height - videoHeight) / 2;
      context.drawImage(videoElement, videoX, videoY, videoWidth, videoHeight);
  
      // Draw the overlay image while maintaining its aspect ratio
      const overlayImage = new Image();
      overlayImage.src = "/dress-2.png"; // Replace with the path to your overlay image
      overlayImage.onload = () => {
        const overlayAspectRatio = overlayImage.width / overlayImage.height;
        let overlayWidth = canvasElement.width;
        let overlayHeight = overlayWidth / overlayAspectRatio;
        if (overlayHeight > canvasElement.height) {
          overlayHeight = canvasElement.height;
          overlayWidth = overlayHeight * overlayAspectRatio;
        }
        const overlayX = (canvasElement.width - overlayWidth) / 2;
        const overlayY = (canvasElement.height - overlayHeight) / 2;
        context.drawImage(overlayImage, overlayX, overlayY, overlayWidth, overlayHeight);
  
        // Create a data URL and trigger download
        const dataURL = canvasElement.toDataURL('image/png');
        const link = document.createElement('a');
        link.href = dataURL;
        link.download = 'couture-lens-design.png'; // Name the file
        link.click();
      };
    }
  };

  return (
    <div className="relative bg-white">
      <div className="aspect-w-4 aspect-h-3 max-w-lg mx-auto relative">
        <video ref={videoRef} autoPlay playsInline className="w-full h-full object-cover"></video>
        <img src="/dress-2.png" alt="Dress Overlay" className="absolute top-0 left-0 w-full h-full object-cover" />
        <canvas ref={canvasRef} style={{ display: 'none' }}></canvas>
      </div>
      <div className="flex justify-center mt-24">
        <button onClick={handleSave} className="save-button bg-blue-500 text-white py-2 px-4 rounded">Save Image</button>
      </div>
    </div>
  );
}

export default Camera;
