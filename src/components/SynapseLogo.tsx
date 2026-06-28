interface SynapseLogoProps {
  className?: string;
  size?: number;
}

export function SynapseLogo({ className = '', size = 18 }: SynapseLogoProps) {
  // A beautiful logo blending the Korean Hangeul character 'ㅅ' (Seoul / Speak) with a premium luxury sparkle
  return (
    <svg
      width={size}
      height={size}
      viewBox="-50 -50 100 100"
      fill="none"
      stroke="currentColor"
      strokeWidth="6"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      {/* Hangeul 'ㅅ' styled premium lines */}
      <path d="M 0,-30 L -25,25" stroke="currentColor" strokeWidth="7" />
      <path d="M -5,-5 L 25,25" stroke="currentColor" strokeWidth="7" />
      
      {/* Top glowing luxury star/sparkle representing excellence */}
      <path
        d="M 0,-40 Q 0,-25 15,-25 Q 0,-25 0,-10 Q 0,-25 -15,-25 Q 0,-25 0,-40 Z"
        fill="currentColor"
        stroke="none"
      />
      
      {/* Subtle center dot */}
      <circle cx="0" cy="-25" r="2.5" fill="white" />
    </svg>
  );
}
