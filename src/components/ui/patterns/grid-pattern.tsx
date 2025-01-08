export function GridPatternSvg() {
  return (
    <svg
      width="100"
      height="100"
      viewBox="0 0 100 100"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className="absolute inset-0 h-full w-full opacity-[0.02] dark:opacity-[0.04]"
      style={{
        maskImage: 'radial-gradient(circle at center, white, transparent)',
        WebkitMaskImage: 'radial-gradient(circle at center, white, transparent)'
      }}
    >
      <pattern id="grid" width="20" height="20" patternUnits="userSpaceOnUse">
        <path d="M 20 0 L 0 0 0 20" fill="none" stroke="currentColor" strokeWidth="0.5" strokeDasharray="0" />
      </pattern>
      <rect width="100%" height="100%" fill="url(#grid)" />
    </svg>
  )
}
