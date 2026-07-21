import Link from "next/link";

function KoFiIcon() {
  return (
    <svg className="kt-kofi-icon" viewBox="0 0 32 32" aria-hidden>
      <path
        className="kt-kofi-cup"
        d="M4.5 7.5h19v10.2a7.3 7.3 0 0 1-7.3 7.3h-4.4a7.3 7.3 0 0 1-7.3-7.3V7.5Z"
      />
      <path className="kt-kofi-handle" d="M23.5 10.4h2a3.9 3.9 0 0 1 0 7.8h-2" />
      <path
        className="kt-kofi-heart"
        d="M14 19.5c-.45-.42-3.8-2.83-3.8-5.23 0-1.58 1.18-2.72 2.68-2.72.85 0 1.63.4 2.12 1.05a2.66 2.66 0 0 1 2.12-1.05c1.5 0 2.68 1.14 2.68 2.72 0 2.4-3.35 4.81-3.8 5.23l-1 .82-1-.82Z"
      />
    </svg>
  );
}

export default function KotobaSupportFooter() {
  return (
    <footer className="kt-support-footer">
      <p>易の作品づくりを応援する</p>
      <a
        className="kt-kofi-link"
        href="https://ko-fi.com/awaicommons"
        target="_blank"
        rel="noopener noreferrer"
      >
        <KoFiIcon />
        <span>Ko-fiで応援する</span>
      </a>
      <Link href="/" className="kt-copyright">© 2026 AWAI Commons</Link>
    </footer>
  );
}
