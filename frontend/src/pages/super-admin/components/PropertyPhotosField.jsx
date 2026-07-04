import { useRef } from 'react';
import { ImageUp, X } from 'lucide-react';
import { Button } from '../../../components/ui/button';
import { resolveImageUrl } from '../../landing/utils/resolveImageUrl';

export function PropertyPhotosField({ photos, onChange, maxPhotos = 10 }) {
  const fileInputRef = useRef(null);
  const canAddMore = photos.length < maxPhotos;

  function handleFileSelect(event) {
    const files = Array.from(event.target.files || []);
    if (!files.length) return;

    const remaining = maxPhotos - photos.length;
    const selected = files.slice(0, remaining).map((file) => ({
      id: `${file.name}-${file.lastModified}`,
      preview: URL.createObjectURL(file),
      file,
      url: ''
    }));

    onChange([...photos, ...selected]);
    event.target.value = '';
  }

  function removePhoto(photoId) {
    const photo = photos.find((item) => item.id === photoId);
    if (photo?.preview?.startsWith('blob:')) URL.revokeObjectURL(photo.preview);
    onChange(photos.filter((item) => item.id !== photoId));
  }

  return (
    <div className="space-y-3 rounded-2xl border bg-slate-50 p-4 dark:bg-slate-900/40">
      <p className="text-sm font-semibold text-foreground">Property Photos</p>
      {photos.length ? (
        <div className="grid grid-cols-2 gap-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
          {photos.map((photo) => (
            <div key={photo.id} className="relative">
              <img
                src={photo.preview || resolveImageUrl(photo.url)}
                alt="Property"
                className="h-24 w-full rounded-xl border object-cover"
              />
              <button
                type="button"
                onClick={() => removePhoto(photo.id)}
                className="absolute -right-1 -top-1 rounded-full border bg-white p-1 text-slate-600 shadow-sm dark:bg-slate-950"
                aria-label="Remove photo"
              >
                <X className="h-3.5 w-3.5" />
              </button>
            </div>
          ))}
        </div>
      ) : (
        <div className="flex h-24 items-center justify-center rounded-2xl border border-dashed bg-white text-sm text-muted-foreground dark:bg-slate-950">
          No photos added yet
        </div>
      )}
      <Button
        type="button"
        variant="outline"
        size="sm"
        disabled={!canAddMore}
        onClick={() => fileInputRef.current?.click()}
      >
        <ImageUp className="h-4 w-4" /> Upload Photos
      </Button>
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        multiple
        className="hidden"
        onChange={handleFileSelect}
      />
      <p className="text-xs text-muted-foreground">
        Upload up to {maxPhotos} property images. Max size 5 MB each.
      </p>
    </div>
  );
}
