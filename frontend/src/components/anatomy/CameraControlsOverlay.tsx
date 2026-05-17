import { ZoomIn, ZoomOut, Maximize2, RotateCcw } from 'lucide-react'
import { useViewer3D, type CameraActions } from '@/stores/viewer3d'
import { cn } from '@/lib/cn'

/**
 * Discrete DOM overlay of camera controls for the 3D viewer.
 *
 * Lives in the regular DOM (not inside <Canvas>) and drives the camera
 * through the imperative actions the in-Canvas ``CameraRig`` registers
 * in the viewer3d store. Works with mouse, trackpad and touch — these
 * are plain buttons, so taps / clicks behave identically everywhere.
 */

interface ControlButton {
  key: string
  label: string
  icon: typeof ZoomIn
  run: (a: CameraActions) => void
}

const BUTTONS: ControlButton[] = [
  {
    key: 'zoom-in',
    label: 'Zoom avant',
    icon: ZoomIn,
    run: (a) => a.zoomBy(0.72),
  },
  {
    key: 'zoom-out',
    label: 'Zoom arrière',
    icon: ZoomOut,
    run: (a) => a.zoomBy(1.38),
  },
  {
    key: 'fit',
    label: 'Ajuster à la vue',
    icon: Maximize2,
    run: (a) => a.fit(),
  },
  {
    key: 'reset',
    label: 'Recentrer la caméra',
    icon: RotateCcw,
    run: (a) => a.reset(),
  },
]

interface Props {
  /** Tailwind position classes; defaults to bottom-right. */
  className?: string
}

export function CameraControlsOverlay({ className }: Props) {
  const actions = useViewer3D((s) => s.actions)
  const ready = actions !== null

  return (
    <div
      className={cn(
        'absolute z-10 flex flex-col gap-1 p-1 rounded-xl',
        'bg-bg-panel/80 backdrop-blur border border-line/70 shadow-panel',
        className ?? 'bottom-4 right-4',
      )}
      role="group"
      aria-label="Contrôles de la caméra 3D"
    >
      {BUTTONS.map((b) => {
        const Icon = b.icon
        return (
          <button
            key={b.key}
            type="button"
            aria-label={b.label}
            title={b.label}
            disabled={!ready}
            onClick={() => {
              const a = actions
              if (a) b.run(a)
            }}
            className={cn(
              // 44px touch target on mobile, compact 36px from sm up.
              'grid place-items-center w-11 h-11 sm:w-9 sm:h-9 rounded-lg transition-colors',
              'text-ink-mute hover:text-ink hover:bg-bg-elev active:scale-95',
              'disabled:opacity-40 disabled:cursor-not-allowed',
              'focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-accent/60',
            )}
          >
            <Icon className="w-4 h-4" />
          </button>
        )
      })}
    </div>
  )
}
