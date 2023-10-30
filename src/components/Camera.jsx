import { useEffect, useRef } from 'react';

function Camera() {
  const videoRef = useRef(null);

  useEffect(() => {
    async function enableStream() {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ video: true });
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

  return (
<div className="relative bg-white">
  <div className="aspect-w-4 aspect-h-3 max-w-lg mx-auto">
    <video ref={videoRef} autoPlay playsInline className="w-full h-full object-cover"></video>
    <img src="/dress-2.png" alt="Dress Overlay" className="absolute top-0 left-0 w-full h-full object-cover" />
  </div>
</div>
  );
}

export default Camera;
