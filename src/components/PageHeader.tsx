import type { ReactNode } from "react";

interface PageHeaderProps {
  eyebrow?: string;
  title: string;
  description: string;
  actions?: ReactNode;
}

export function PageHeader({ eyebrow, title, description, actions }: PageHeaderProps) {
  return (
    <div className="mb-8 flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
      <div>
        {eyebrow ? <p className="mb-2 text-xs uppercase tracking-[0.3em] text-text-muted">{eyebrow}</p> : null}
        <h2 className="text-3xl font-bold tracking-tight text-text-primary">{title}</h2>
        <p className="mt-2 max-w-2xl text-sm text-text-secondary">{description}</p>
      </div>
      {actions ? <div className="flex items-center gap-3">{actions}</div> : null}
    </div>
  );
}
