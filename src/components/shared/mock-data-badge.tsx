interface MockDataBadgeProps {
  label: string;
}

/** Marks content rendered from mock data, so it is never mistaken for real backend data. */
export function MockDataBadge({ label }: MockDataBadgeProps) {
  return (
    <span className="inline-flex items-center gap-1.5 rounded-full border border-dashed border-amber-500 bg-amber-50 px-2.5 py-0.5 text-xs font-medium text-amber-800">
      <span aria-hidden="true" className="size-1.5 rounded-full bg-amber-500" />
      {label}
    </span>
  );
}
