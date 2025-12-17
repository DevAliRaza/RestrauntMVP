import Link from 'next/link';

type SiteHeaderProps = {
  isAuthenticated: boolean;
};

export function SiteHeader({ isAuthenticated }: SiteHeaderProps) {
  return (
    <header className="border-b border-zinc-900 bg-zinc-950/80 backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3 text-xs text-zinc-200">
        <Link href="/" className="font-semibold tracking-tight">
          Lahore Menus
        </Link>
        <nav className="flex items-center gap-3">
          {isAuthenticated ? (
            <>
              <Link
                href="/dashboard"
                className="rounded-full border border-zinc-700 bg-zinc-900/60 px-3 py-1 text-[11px] hover:border-amber-300 hover:text-amber-100"
              >
                Dashboard
              </Link>
            </>
          ) : (
            <>
              <Link
                href="/auth/login"
                className="rounded-full border border-zinc-700 bg-zinc-900/60 px-3 py-1 text-[11px] hover:border-amber-300 hover:text-amber-100"
              >
                Login
              </Link>
              <Link
                href="/auth/register"
                className="rounded-full bg-amber-400 px-3 py-1 text-[11px] font-semibold text-zinc-950 hover:bg-amber-300"
              >
                Register  
              </Link>
            </> 
          )}
        </nav>
      </div>
    </header>
  );
}

