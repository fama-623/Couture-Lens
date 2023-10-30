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
  
      // Load the overlay image
      const overlayImage = new Image();
      overlayImage.src = "/dress-2.png"; // Replace with the path to your overlay image
      overlayImage.onload = () => {
        // Set canvas size to overlay image size
        canvasElement.width = overlayImage.width;
        canvasElement.height = overlayImage.height;
  
        // Draw a white background
        context.fillStyle = 'white';
        context.fillRect(0, 0, canvasElement.width, canvasElement.height);
  
        // Calculate the aspect ratio of the video
        const videoAspectRatio = videoElement.videoWidth / videoElement.videoHeight;
  
        // Calculate dimensions to fit video within the overlay image
        let videoWidth = canvasElement.width;
        let videoHeight = videoWidth / videoAspectRatio;
        if (videoHeight > canvasElement.height) {
          videoHeight = canvasElement.height;
          videoWidth = videoHeight * videoAspectRatio;
        }
        const videoX = (canvasElement.width - videoWidth) / 2;
        const videoY = (canvasElement.height - videoHeight) / 2;
  
        // Draw the video on the canvas
        context.drawImage(videoElement, videoX, videoY, videoWidth, videoHeight);
  
        // Draw the overlay image on top
        context.drawImage(overlayImage, 0, 0, canvasElement.width, canvasElement.height);
  
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
        <h1 className='text-center mb-16 h1-font text-3xl	
        '> Couture Lens </h1>
      <div className="aspect-w-4 aspect-h-3 max-w-lg mx-auto relative">
        <video ref={videoRef} autoPlay playsInline className="w-full h-full object-cover"></video>
        <img src="/dress-2.png" alt="Dress Overlay" className="absolute top-0 left-0 w-full h-full object-cover" />
        <canvas  ref={canvasRef} style={{ display: 'none' }}></canvas>
      </div>
      <div className="flex justify-center mt-16">
        <button onClick={handleSave} className="save-button bg-blue-500 text-white py-2 px-4 rounded h1-font">Save Image</button>
      </div>
    </div>
  );
}

export default Camera;