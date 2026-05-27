import Link from "next/link";

interface Props {
  showCta?: boolean;
}

/** Top navigation — used on landing and generator pages */
export default function Header({ showCta = true }: Props) {
  return (
    <header className="border-b border-slate-200 bg-white/90 backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-4">
        <Link href="/" className="flex items-center gap-2">
          <span className="text-2xl" aria-hidden>
            ✈️
          </span>
          <span className="leading-tight">
            <span className="block text-xl font-bold text-pilot-800">
              TestPilot AI
            </span>
            <span className="block text-xs font-medium text-slate-500">
              by Mahesh Gandla Bachu
            </span>
          </span>
        </Link>
        <nav className="flex items-center gap-4">
          <Link
            href="/#features"
            className="hidden text-sm font-medium text-slate-600 hover:text-pilot-700 sm:inline"
          >
            Features
          </Link>
          <Link
            href="/#how-it-works"
            className="hidden text-sm font-medium text-slate-600 hover:text-pilot-700 sm:inline"
          >
            How it works
          </Link>
          {showCta && (
            <Link
              href="/generator"
              className="rounded-lg bg-pilot-600 px-4 py-2 text-sm font-semibold text-white hover:bg-pilot-700"
            >
              Start Generating
            </Link>
          )}
        </nav>
      </div>
    </header>
  );
}
