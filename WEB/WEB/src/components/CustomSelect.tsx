/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useRef, useEffect } from 'react';
import { ChevronDown, Check } from 'lucide-react';

// 앱 디자인에 맞춘 커스텀 드롭다운 (native select 대체)
export function CustomSelect({
  value, options, onChange, withDot = false,
}: {
  value: string;
  options: { value: string; label: string; dotColor?: string }[];
  onChange: (v: string) => void;
  withDot?: boolean;
}) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (!open) return;
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, [open]);

  const current = options.find(o => o.value === value);
  return (
    <div className="relative w-full" ref={ref}>
      <button
        type="button"
        onClick={() => setOpen(o => !o)}
        className="w-full flex items-center gap-2 bg-[#f7f6f2] hover:bg-[#edecea] border border-[#e0ddd8] text-[#1c1c14] text-xs font-semibold rounded-lg px-3 py-2.5 cursor-pointer focus:outline-none focus:ring-1 focus:ring-[#5a6e38] transition-colors"
      >
        {withDot && current?.dotColor && (
          <span className="w-2 h-2 rounded-full shrink-0" style={{ backgroundColor: current.dotColor }} />
        )}
        <span className="flex-grow text-left truncate">{current?.label ?? '선택'}</span>
        <ChevronDown className={`w-3.5 h-3.5 text-[#9a9a86] shrink-0 transition-transform ${open ? 'rotate-180' : ''}`} />
      </button>

      {open && (
        <div className="absolute left-0 top-full mt-1 w-full min-w-[110px] bg-white border border-[#e0ddd8] rounded-lg shadow-level-2 py-1 z-30 max-h-[210px] overflow-y-auto animate-pop">
          {options.map(o => {
            const active = o.value === value;
            return (
              <button
                key={o.value}
                type="button"
                onClick={() => { onChange(o.value); setOpen(false); }}
                className={`w-full flex items-center gap-2 px-3 py-1.5 text-xs font-semibold text-left transition-colors ${
                  active ? 'bg-[#ecf0e4] text-[#1c1c14]' : 'text-[#6b6b58] hover:bg-[#f7f6f2]'
                }`}
              >
                {withDot && o.dotColor && (
                  <span className="w-2 h-2 rounded-full shrink-0" style={{ backgroundColor: o.dotColor }} />
                )}
                <span className="flex-grow truncate">{o.label}</span>
                {active && <Check className="w-3.5 h-3.5 text-[#5a6e38] shrink-0" />}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}
