interface SEOULUXELogoProps {
  className?: string;
  size?: number;
}

export function SEOULUXELogo({ className = '', size = 18 }: SEOULUXELogoProps) {
  // A beautiful luxury 8-pointed star / sparkle representing radiant skin
  return (
    <svg
      width={size}
      height={size}
      viewBox="-50 -50 100 100"
      fill="currentColor"
      className={className}
    >
      <g>
        {/* Main 4-point sparkle */}
        <path d="M 0,-48 Q 0,0 48,0 Q 0,0 0,48 Q 0,0 -48,0 Q 0,0 0,-48 Z" />
        {/* Secondary diagonal 4-point sparkle */}
        <path d="M 0,-32 Q 0,0 32,0 Q 0,0 0,32 Q 0,0 -32,0 Q 0,0 0,-32 Z" transform="rotate(45)" opacity="0.7" />
        {/* Center glowing circle */}
        <circle cx="0" cy="0" r="8" fill="white" />
      </g>
    </svg>
  );
}
