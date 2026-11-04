'use client'

import { Check, ChevronDown } from 'lucide-react'
import { useEffect, useId, useRef, useState } from 'react'

export type SlicerOption = { value: string; label: string }

type SlicerProps = {
  label: string
  options: SlicerOption[]
  selected: string[]
  onChange: (next: string[]) => void
}

/** Segmentador desplegable de selección múltiple (equivale al slicer en modo "Dropdown" de Power BI). */
export function Slicer({ label, options, selected, onChange }: SlicerProps) {
  const [open, setOpen] = useState(false)
  const rootRef = useRef<HTMLDivElement>(null)
  const listId = useId()

  useEffect(() => {
    if (!open) return
    function onPointerDown(event: PointerEvent) {
      if (!rootRef.current?.contains(event.target as Node)) setOpen(false)
    }
    function onKeyDown(event: KeyboardEvent) {
      if (event.key === 'Escape') setOpen(false)
    }
    document.addEventListener('pointerdown', onPointerDown)
    document.addEventListener('keydown', onKeyDown)
    return () => {
      document.removeEventListener('pointerdown', onPointerDown)
      document.removeEventListener('keydown', onKeyDown)
    }
  }, [open])

  function toggle(value: string) {
    onChange(selected.includes(value) ? selected.filter((v) => v !== value) : [...selected, value])
  }

  const resumen =
    selected.length === 0
      ? 'Todas'
      : selected.length === 1
        ? (options.find((o) => o.value === selected[0])?.label ?? selected[0])
        : `${selected.length} seleccionadas`

  return (
    <div className="demo-slicer" ref={rootRef}>
      <span className="demo-slicer-label">{label}</span>
      <button
        aria-controls={listId}
        aria-expanded={open}
        aria-haspopup="listbox"
        className="demo-slicer-button"
        onClick={() => setOpen((v) => !v)}
        type="button"
      >
        <span className="demo-slicer-value">{resumen}</span>
        <ChevronDown aria-hidden="true" className={open ? 'is-open' : ''} />
      </button>

      {open && (
        <div className="demo-slicer-menu" id={listId} role="listbox" aria-multiselectable="true">
          <button
            className="demo-slicer-clear"
            disabled={selected.length === 0}
            onClick={() => onChange([])}
            type="button"
          >
            Borrar selección
          </button>
          {options.map((option) => {
            const active = selected.includes(option.value)
            return (
              <button
                aria-selected={active}
                className={`demo-slicer-option${active ? ' is-active' : ''}`}
                key={option.value}
                onClick={() => toggle(option.value)}
                role="option"
                type="button"
              >
                <span aria-hidden="true" className="demo-slicer-check">
                  {active && <Check />}
                </span>
                {option.label}
              </button>
            )
          })}
        </div>
      )}
    </div>
  )
}
