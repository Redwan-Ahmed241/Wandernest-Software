import { useEffect, useRef, useState } from 'react';
import type { Lang } from '../domain/types';
import { renderCard, type CardFormat, type CardInput } from '../shareCard';
import { t } from '../i18n';

interface Props {
  lang: Lang;
  link: string;
  card: Omit<CardInput, 'format'>;
  onClose: () => void;
}

export default function ShareModal({ lang, link, card, onClose }: Props) {
  const [format, setFormat] = useState<CardFormat>('story');
  const [blob, setBlob] = useState<Blob | null>(null);
  const [url, setUrl] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  const [error, setError] = useState(false);
  const closeRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    let cancelled = false;
    let made: string | null = null;
    setBlob(null);
    setUrl(null);
    setError(false);
    renderCard({ ...card, format })
      .then((b) => {
        if (cancelled) return;
        made = URL.createObjectURL(b);
        setBlob(b);
        setUrl(made);
      })
      .catch(() => !cancelled && setError(true));
    return () => {
      cancelled = true;
      if (made) URL.revokeObjectURL(made);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [format]);

  useEffect(() => {
    closeRef.current?.focus();
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && onClose();
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [onClose]);

  const file = blob ? new File([blob], 'wandernest-bd-map.png', { type: 'image/png' }) : null;
  const canNativeShare = !!file && typeof navigator.canShare === 'function' && navigator.canShare({ files: [file] });

  const nativeShare = async () => {
    if (!file) return;
    try {
      await navigator.share({ files: [file], text: card.heading, url: link });
    } catch {
      /* user cancelled */
    }
  };

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(link);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1800);
    } catch {
      window.prompt(t(lang, 'copyLink'), link);
    }
  };

  return (
    <div className="modal-back" role="dialog" aria-modal="true" onClick={onClose}>
      <div className="modal" onClick={(e) => e.stopPropagation()}>
        <button ref={closeRef} type="button" className="x" onClick={onClose} aria-label={t(lang, 'close')}>
          ×
        </button>
        <div className="seg" role="tablist">
          {(['story', 'post'] as const).map((f) => (
            <button
              key={f}
              type="button"
              role="tab"
              aria-selected={format === f}
              className={format === f ? 'on' : ''}
              onClick={() => setFormat(f)}
            >
              {t(lang, f)}
            </button>
          ))}
        </div>
        <div className={`preview ${format}`}>
          {url ? <img src={url} alt="" /> : <p>{error ? '⚠️' : t(lang, 'makingCard')}</p>}
        </div>
        <p className="hint">{t(lang, 'holdSave')}</p>
        <div className="row">
          {canNativeShare && (
            <button type="button" className="btn red" onClick={nativeShare}>
              {t(lang, 'shareBtn')}
            </button>
          )}
          {url && (
            <a className="btn" href={url} download="wandernest-bd-map.png">
              {t(lang, 'download')}
            </a>
          )}
          <button type="button" className="btn" onClick={copy}>
            {copied ? t(lang, 'copied') : t(lang, 'copyLink')}
          </button>
        </div>
        <p className="hint">{t(lang, 'backupNote')}</p>
      </div>
    </div>
  );
}
