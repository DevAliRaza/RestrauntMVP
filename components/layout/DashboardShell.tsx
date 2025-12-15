import Link from 'next/link';

export default function DashboardShell({
  children,
  restaurantSlug,
}: {
  children: React.ReactNode;
  restaurantSlug: string;
}) {
  const base = `/dashboard/${restaurantSlug}`;

  return (
    <div className="flex min-h-screen bg-zinc-950 text-zinc-50">
      <aside className="hidden w-60 flex-col border-r border-zinc-900 bg-zinc-950 md:flex">
        <div className="px-4 py-4 text-sm font-semibold tracking-tight">
          Lahore Menus
        </div>
        <nav className="flex-1 space-y-1 px-2 text-xs">
          <NavLink href={base}>Overview</NavLink>
          <NavLink href={`${base}/orders`}>Orders</NavLink>
          <NavLink href={`${base}/menu`}>Menu</NavLink>
          <NavLink href={`${base}/promotions`}>Promotions</NavLink>
          <NavLink href={`${base}/loyalty`}>Loyalty</NavLink>
          <NavLink href={`${base}/qr`}>QR Codes</NavLink>
          <NavLink href={`${base}/settings`}>Settings</NavLink>
        </nav>
      </aside>
      <main className="flex flex-1 flex-col">
        <header className="flex h-14 items-center justify-between border-b border-zinc-900 px-4 text-xs">
          <span className="font-semibold">{restaurantSlug}</span>
        </header>
        <div className="flex-1 px-4 py-4">{children}</div>
      </main>
    </div>
  );
}

function NavLink({
  href,
  children,
}: {
  href: string;
  children: React.ReactNode;
}) {
  return (
    <Link
      href={href}
      className="flex items-center rounded-md px-3 py-2 text-zinc-300 hover:bg-zinc-900/80 hover:text-amber-300"
    >
      {children}
    </Link>
  );
}


