import { useState } from 'react';
import { cn } from '../../../lib/utils';
import { IMAGE_FALLBACK, resolveImageUrl } from '../utils/resolveImageUrl';

export function GalleryImage({
  src,
  alt = '',
  className,
  imgClassName,
  aspectClass = 'aspect-[4/3]',
  onClick,
  asButton = false
}) {
  const [loading, setLoading] = useState(Boolean(src));
  const [failed, setFailed] = useState(false);
  const imageSrc = failed || !src ? IMAGE_FALLBACK : resolveImageUrl(src);

  const inner = (
    <>
      {loading && !failed ? (
        <div className="absolute inset-0 animate-shimmer bg-gradient-to-r from-slate-100 via-slate-200/80 to-slate-100 bg-[length:200%_100%]" aria-hidden />
      ) : null}
      <img
        src={imageSrc}
        alt={alt}
        decoding="async"
        loading="lazy"
        onLoad={() => setLoading(false)}
        onError={() => {
          setFailed(true);
          setLoading(false);
        }}
        className={cn(
          'h-full w-full object-cover transition-opacity duration-500',
          loading && !failed ? 'opacity-0' : 'opacity-100',
          imgClassName
        )}
      />
    </>
  );

  const shellClass = cn('relative overflow-hidden bg-slate-100', aspectClass, className);

  if (asButton || onClick) {
    return (
      <button type="button" onClick={onClick} className={cn(shellClass, 'group block w-full text-left')}>
        {inner}
      </button>
    );
  }

  return <div className={shellClass}>{inner}</div>;
}
