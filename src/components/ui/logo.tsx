import { cn } from "@/lib/utils";

/** The asterisk mark. Also the favicon source. */
export function Logo({ className }: { className?: string }) {
  return (
    <svg
      aria-hidden
      className={cn("size-6", className)}
      fill="none"
      viewBox="0 0 24 24"
      xmlns="http://www.w3.org/2000/svg"
    >
      <title>D.Nova</title>
      <path
        d="M12 1.5c.55 5.2 1.9 7.35 4.6 9.05-3.1.4-4.55 1.6-5.35 4.4-.8-2.8-2.25-4-5.35-4.4 2.7-1.7 4.05-3.85 4.6-9.05Z"
        fill="currentColor"
        transform="rotate(0 12 12)"
      />
      <path
        d="M12 22.5c-.55-5.2-1.9-7.35-4.6-9.05 3.1-.4 4.55-1.6 5.35-4.4.8 2.8 2.25 4 5.35 4.4-2.7 1.7-4.05 3.85-4.6 9.05Z"
        fill="currentColor"
      />
    </svg>
  );
}
