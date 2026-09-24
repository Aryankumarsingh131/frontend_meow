import type { ReactNode } from 'react';

interface MobileFrameProps {
  children: ReactNode;
  isFluidMode: boolean;
}

export default function MobileFrame({ children, isFluidMode }: MobileFrameProps) {
  if (isFluidMode) {
    return <div className="fluid-frame">{children}</div>;
  }

  return (
    <div className="phone-mockup-frame">
      {children}
    </div>
  );
}
