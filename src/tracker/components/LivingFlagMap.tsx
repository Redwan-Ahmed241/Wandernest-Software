import { memo, useCallback, useEffect, useMemo, useRef, useState } from 'react';
import type { Lang } from '../domain/types';
import { t } from '../i18n';

export interface MapDistrict {
  id: string;
  d: string;
  c: [number, number];
}

export interface DistrictInfo {
  /** Short name in the current language, used for on-map labels. */
  name: string;
  /** "Sylhet | সিলেট" */
  both: string;
  division: string;
}

interface Props {
  districts: MapDistrict[];
  viewBox: [number, number];
  visited: ReadonlySet<string>;
  want: ReadonlySet<string>;
  selected: string | null;
  justChanged: string | null;
  info: Record<string, DistrictInfo>;
  lang: Lang;
  onSelect: (id: string | null) => void;
}

const MAX_ZOOM = 6;
/** On-map labels appear once a district name can be drawn at this size without overlapping much. */
const LABEL_PX = 9.5;
const MIN_PX_PER_UNIT = 0.62;

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
  const { districts, viewBox, visited, want, selected, justChanged, info, lang, onSelect } = props;
  const [W, H] = viewBox;
  const [view, setView] = useState({ x: 0, y: 0, w: W, h: H });
  const [svgPx, setSvgPx] = useState({ w: 0, h: 0 });
  const [hover, setHover] = useState<string | null>(null);
  const wrapRef = useRef<HTMLDivElement>(null);
  const svgRef = useRef<SVGSVGElement>(null);
  const tipRef = useRef<HTMLDivElement>(null);
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

  useEffect(() => {
    const svg = svgRef.current;
    if (!svg) return;
    const ro = new ResizeObserver(([e]) => setSvgPx({ w: e.contentRect.width, h: e.contentRect.height }));
    ro.observe(svg);
    return () => ro.disconnect();
  }, []);

  // Screen pixels per SVG unit (viewBox is letterboxed with "meet").
  const pxPerUnit = svgPx.w && svgPx.h ? Math.min(svgPx.w / view.w, svgPx.h / view.h) : 0;
  const showLabels = pxPerUnit >= MIN_PX_PER_UNIT;
  const fontSize = pxPerUnit ? LABEL_PX / pxPerUnit : 0;

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
    (factor: number, cx?: number, cy?: number) => {
      setView((v) => {
        const nw = v.w / factor;
        const nh = (nw / W) * H;
        const px = cx ?? v.x + v.w / 2;
        const py = cy ?? v.y + v.h / 2;
        return clamp({ x: px - nw / 2, y: py - nh / 2, w: nw, h: nh });
      });
    },
    [W, H, clamp],
  );

  // Zoom towards a newly selected district (e.g. from search) if we are zoomed in.
  useEffect(() => {
    if (!selected || !zoomed) return;
    const d = districts.find((x) => x.id === selected);
    if (d) setView((v) => clamp({ ...v, x: d.c[0] - v.w / 2, y: d.c[1] - v.h / 2 }));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selected]);

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
    if (e.pointerType === 'mouse') {
      const id = (e.target as Element).closest?.('path[data-id]')?.getAttribute('data-id') ?? null;
      if (id !== hover) setHover(id);
      const tip = tipRef.current;
      const wrap = wrapRef.current;
      if (tip && wrap && id) {
        const r = wrap.getBoundingClientRect();
        tip.style.transform = `translate3d(${e.clientX - r.left + 14}px, ${e.clientY - r.top + 14}px, 0)`;
      }
    }
    const dr = drag.current;
    if (!dr || !pxPerUnit || e.buttons === 0) return;
    const dx = e.clientX - dr.x;
    const dy = e.clientY - dr.y;
    if (!dr.moved && Math.hypot(dx, dy) < 6) return;
    dr.moved = true;
    setView((v) => clamp({ ...v, x: dr.vx - dx / pxPerUnit, y: dr.vy - dy / pxPerUnit }));
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

  const labels = useMemo(() => {
    if (!showLabels) return null;
    const pad = fontSize * 4;
    return districts
      .filter((d) => d.c[0] > view.x - pad && d.c[0] < view.x + view.w + pad && d.c[1] > view.y && d.c[1] < view.y + view.h)
      .map((d) => (
        <text key={d.id} x={d.c[0]} y={d.c[1]} fontSize={fontSize} className={visited.has(d.id) ? 'lbl on' : 'lbl'}>
          {info[d.id]?.name ?? ''}
        </text>
      ));
  }, [showLabels, districts, view, fontSize, info, visited]);

  const tip = hover ? info[hover] : undefined;
  const selD = selected ? districts.find((d) => d.id === selected)?.d : undefined;

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
        onPointerLeave={() => {
          endDrag();
          setHover(null);
        }}
        onPointerCancel={endDrag}
      >
        {districts.map((d) => (
          <DistrictPath key={d.id} id={d.id} d={d.d} cls={classes.get(d.id) ?? 'dist'} label={info[d.id]?.both ?? d.id} />
        ))}
        {selD && <path d={selD} className="sel" />}
        {labels && <g aria-hidden="true">{labels}</g>}
      </svg>
      <div ref={tipRef} className={`tip ${tip ? 'show' : ''}`} aria-hidden="true">
        {tip && (
          <>
            <strong>{tip.both}</strong>
            <small>{tip.division}</small>
          </>
        )}
      </div>
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
