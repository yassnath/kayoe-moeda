import Link from "next/link";

type OwnerPageHeaderProps = {
  title: string;
  description?: string;
  actions?: React.ReactNode;
  breadcrumbs?: { label: string; href?: string }[];
};

export default function OwnerPageHeader({
  title,
  description,
  actions,
  breadcrumbs,
}: OwnerPageHeaderProps) {
  return (
    <div className="rounded-3xl border border-km-line bg-white p-6 shadow-soft">
      {breadcrumbs && breadcrumbs.length > 0 && (
        <div className="text-xs text-km-ink/50">
          {breadcrumbs.map((crumb, idx) => (
            <span key={`${crumb.label}-${idx}`}>
              {crumb.href ? (
                <Link
                  href={crumb.href}
                  className="text-km-ink/60 hover:text-km-ink no-underline"
                >
                  {crumb.label}
                </Link>
              ) : (
                <span>{crumb.label}</span>
              )}
              {idx < breadcrumbs.length - 1 && " / "}
            </span>
          ))}
        </div>
      )}
      <div className="mt-2 flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold text-km-ink">{title}</h1>
          {description && (
            <p className="mt-2 text-sm text-km-ink/60">{description}</p>
          )}
        </div>
        {actions && <div>{actions}</div>}
      </div>
    </div>
  );
}
