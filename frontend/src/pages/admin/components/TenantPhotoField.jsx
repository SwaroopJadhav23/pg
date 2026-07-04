import { useEffect, useRef, useState } from 'react';
import { Camera, ImageUp, X } from 'lucide-react';
import { Button } from '../../../components/ui/button';

export function TenantPhotoField({ previewUrl, onPhotoChange, onClear }) {
  const [cameraOpen, setCameraOpen] = useState(false);
  const [cameraError, setCameraError] = useState('');
  const videoRef = useRef(null);
  const streamRef = useRef(null);
  const fileInputRef = useRef(null);

  useEffect(() => () => stopCamera(), []);

  useEffect(() => {
    if (!cameraOpen || !videoRef.current || !streamRef.current) return;
    videoRef.current.srcObject = streamRef.current;
  }, [cameraOpen]);

  function stopCamera() {
    streamRef.current?.getTracks().forEach((track) => track.stop());
    streamRef.current = null;
    setCameraOpen(false);
  }

  async function startCamera() {
    setCameraError('');
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: 'user' },
        audio: false
      });
      streamRef.current = stream;
      setCameraOpen(true);
    } catch {
      setCameraError('Camera access was denied or is not available.');
    }
  }

  function capturePhoto() {
    const video = videoRef.current;
    if (!video?.videoWidth) return;
    const canvas = document.createElement('canvas');
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    canvas.getContext('2d')?.drawImage(video, 0, 0);
    canvas.toBlob((blob) => {
      if (!blob) return;
      const file = new File([blob], `tenant-photo-${Date.now()}.jpg`, { type: 'image/jpeg' });
      onPhotoChange(file, URL.createObjectURL(file));
      stopCamera();
    }, 'image/jpeg', 0.9);
  }

  function handleFileSelect(event) {
    const file = event.target.files?.[0];
    if (!file) return;
    if (!file.type.startsWith('image/')) {
      setCameraError('Please choose an image file.');
      return;
    }
    setCameraError('');
    onPhotoChange(file, URL.createObjectURL(file));
    stopCamera();
    event.target.value = '';
  }

  function clearPhoto() {
    stopCamera();
    onClear();
    if (fileInputRef.current) fileInputRef.current.value = '';
  }

  return (
    <div className="space-y-3 rounded-2xl border bg-slate-50 p-4 dark:bg-slate-900/40">
      <p className="text-sm font-semibold text-foreground">Tenant Photo</p>
      {previewUrl ? (
        <div className="relative mx-auto w-fit">
          <img src={previewUrl} alt="Tenant preview" className="h-32 w-32 rounded-2xl border object-cover" />
          <button
            type="button"
            onClick={clearPhoto}
            className="absolute -right-2 -top-2 rounded-full border bg-white p-1 text-slate-600 shadow-sm dark:bg-slate-950"
            aria-label="Remove photo"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      ) : (
        <div className="flex h-32 items-center justify-center rounded-2xl border border-dashed bg-white text-sm text-muted-foreground dark:bg-slate-950">
          No photo selected
        </div>
      )}
      <div className="grid grid-cols-1 gap-2 sm:flex sm:flex-wrap">
        <Button type="button" variant="outline" className="h-11 w-full sm:w-auto" size="sm" onClick={() => fileInputRef.current?.click()}>
          <ImageUp className="h-4 w-4" /> Upload Image
        </Button>
        <Button type="button" variant="outline" className="h-11 w-full sm:w-auto" size="sm" onClick={cameraOpen ? stopCamera : startCamera}>
          <Camera className="h-4 w-4" /> {cameraOpen ? 'Close Camera' : 'Use Camera'}
        </Button>
        {cameraOpen ? (
          <Button type="button" className="h-11 w-full sm:w-auto" size="sm" onClick={capturePhoto}>Capture Photo</Button>
        ) : null}
      </div>
      <input ref={fileInputRef} type="file" accept="image/*" className="hidden" onChange={handleFileSelect} />
      {cameraOpen ? (
        <video ref={videoRef} autoPlay playsInline muted className="w-full rounded-2xl border bg-black" />
      ) : null}
      {cameraError ? <p className="text-xs text-rose-600">{cameraError}</p> : null}
      <p className="text-xs text-muted-foreground">Upload an image or capture a photo with your camera. Max size 5 MB.</p>
    </div>
  );
}
