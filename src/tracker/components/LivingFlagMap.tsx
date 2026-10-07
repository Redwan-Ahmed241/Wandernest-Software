import { memo, useCallback, useEffect, useMemo, useRef, useState } from 'react';
import type { Lang } from '../domain/types';
import { t } from '../i18n';

export interface MapDistrict {
  id: string;
  d: string;
  c: [number, number];
}

interface Props {
  districts: MapDistrict[];
  viewBox: [number, number];
  visited: ReadonlySet<string>;
  want: ReadonlySet<string>;
  selected: string | null;
  justChanged: string | null;
  labels: Record<string, string>;
  lang: Lang;
  onSelect: (id: string | null) => void;
}

const MAX_ZOOM = 6;

/** The 64 <path>s only re-render when their own state changes. */
const DistrictPath = memo(function DistrictPath({
  id,
  d,
  cls,
  label,
}: {
  id: string;
  d: string;
  cls: string;
  label: string;
}) {
  return <path id={`p-${id}`} data-id={id} d={d} className={cls} aria-label={label} />;
});

export default function LivingFlagMap(props: Props) {
  const { districts, viewBox, visited, want, selected, justChanged, labels, lang, onSelect } = props;
  const [W, H] = viewBox;
  const [view, setView] = useState({ x: 0, y: 0, w: W, h: H });
  const wrapRef = useRef<HTMLDivElement>(null);
  const svgRef = useRef<SVGSVGElement>(null);
  const drag = useRef<{ x: number; y: number; vx: number; vy: number; moved: boolean } | null>(null);
  const suppressClick = useRef(false);
  const zoomed = view.w < W - 0.5;

  // Pause the sun when the tab is hidden or the map is off-screen (battery).
  useEffect(() => {
    const wrap = wrapRef.current;
    if (!wrap) return;
    let hidden = document.hidden;
    let offscreen = false;
    const apply = () => wrap.classList.toggle('paused', hidden || offscreen);
    const onVis = () => {
      hidden = document.hidden;
      apply();
    };
    document.addEventListener('visibilitychange', onVis);
    const io = new IntersectionObserver(([e]) => {
      offscreen = !e.isIntersecting;
      apply();
    });
    io.observe(wrap);
    return () => {
      document.removeEventListener('visibilitychange', onVis);
      io.disconnect();
    };
  }, []);

  const clamp = useCallback(
    (v: { x: number; y: number; w: number; h: number }) => {
      const w = Math.min(W, Math.max(W / MAX_ZOOM, v.w));
      const h = (w / W) * H;
      return {
        w,
        h,
        x: Math.min(W - w, Math.max(0, v.x)),
        y: Math.min(H - h, Math.max(0, v.y)),
      };
    },
    [W, H],
  );

  const zoomBy = useCallback(
    (factor: number) => {
      setView((v) => {
        const nw = v.w / factor;
        const cx = v.x + v.w / 2;
        const cy = v.y + v.h / 2;
        const nh = (nw / W) * H;
        return clamp({ x: cx - nw / 2, y: cy - nh / 2, w: nw, h: nh });
      });
    },
    [W, H, clamp],
  );

  // One click handler for the whole map (event delegation).
  const onClick = (e: React.MouseEvent<SVGSVGElement>) => {
    if (suppressClick.current) {
      suppressClick.current = false;
      return;
    }
    const el = (e.target as Element).closest?.('path[data-id]');
    const id = el?.getAttribute('data-id') ?? null;
    onSelect(id === selected ? null : id);
  };

  const onPointerDown = (e: React.PointerEvent<SVGSVGElement>) => {
    if (!zoomed) return;
    drag.current = { x: e.clientX, y: e.clientY, vx: view.x, vy: view.y, moved: false };
  };
  const onPointerMove = (e: React.PointerEvent<SVGSVGElement>) => {
    const dr = drag.current;
    const svg = svgRef.current;
    if (!dr || !svg || e.buttons === 0) return;
    const dx = e.clientX - dr.x;
    const dy = e.clientY - dr.y;
    if (!dr.moved && Math.hypot(dx, dy) < 6) return;
    dr.moved = true;
    const rect = svg.getBoundingClientRect();
    const k = view.w / rect.width;
    setView((v) => clamp({ ...v, x: dr.vx - dx * k, y: dr.vy - dy * k }));
  };
  const endDrag = () => {
    if (drag.current?.moved) suppressClick.current = true;
    drag.current = null;
  };

  const classes = useMemo(() => {
    const m = new Map<string, string>();
    for (const d of districts) {
      let c = 'dist';
      if (visited.has(d.id)) c += ' visited';
      else if (want.has(d.id)) c += ' want';
      if (justChanged === d.id) c += ' pop';
      m.set(d.id, c);
    }
    return m;
  }, [districts, visited, want, justChanged]);

  return (
    <div className="map-wrap" ref={wrapRef}>
      <div className="sun" aria-hidden="true" />
      <svg
        ref={svgRef}
        className={`map ${zoomed ? 'zoomed' : ''}`}
        viewBox={`${view.x} ${view.y} ${view.w} ${view.h}`}
        role="group"
        aria-label="Map of Bangladesh districts"
        onClick={onClick}
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={endDrag}
        onPointerLeave={endDrag}
        onPointerCancel={endDrag}
      >
        {districts.map((d) => (
          <DistrictPath key={d.id} id={d.id} d={d.d} cls={classes.get(d.id) ?? 'dist'} label={labels[d.id] ?? d.id} />
        ))}
        {selected && <use href={`#p-${selected}`} className="sel" />}
      </svg>
      <div className="zoom-ctl">
        <button type="button" onClick={() => zoomBy(1.6)} aria-label={t(lang, 'zoomIn')}>
          +
        </button>
        <button type="button" onClick={() => zoomBy(1 / 1.6)} aria-label={t(lang, 'zoomOut')}>
          −
        </button>
        {zoomed && (
          <button type="button" onClick={() => setView({ x: 0, y: 0, w: W, h: H })} aria-label={t(lang, 'reset')}>
            ⤺
          </button>
        )}
      </div>
      <ul className="legend" aria-hidden="true">
        <li>
          <i className="sw s-visited" />
          {t(lang, 'visited')}
        </li>
        <li>
          <i className="sw s-want" />
          {t(lang, 'want')}
        </li>
        <li>
          <i className="sw s-none" />
          {t(lang, 'unvisited')}
        </li>
      </ul>
    </div>
  );
}
