import React from "react";

interface PageHeaderProps {
  title: string;
  subtitle?: string;
  action?: React.ReactNode;
}

export function PageHeader({ title, subtitle, action }: PageHeaderProps) {
  return (
    <div className="mb-8 flex flex-col items-center text-center gap-4">
      <div>
        <h1 className="text-3xl md:text-4xl font-serif mb-2">{title}</h1>
        {subtitle && <p className="text-foreground/60">{subtitle}</p>}
      </div>
      {action && <div>{action}</div>}
    </div>
  );
}
