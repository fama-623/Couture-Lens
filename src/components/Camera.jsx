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
    <div className="relative">
      <video ref={videoRef} autoPlay playsInline className="w-full h-auto"></video>
      <img src="/dress.png" alt="Dress Overlay" className="absolute top-0 left-0" />
    </div>
  );
}

export default Camera;
