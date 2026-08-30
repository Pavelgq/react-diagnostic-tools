'use client';

import { useState } from 'react';

export function InstallCommand({ command }: { command: string }) {
  const [copied, setCopied] = useState(false);

  const onCopy = async () => {
    try {
      await navigator.clipboard.writeText(command);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {
      // Clipboard API unavailable (e.g. insecure context) - nothing to fall back to.
    }
  };

  return (
    <code className="rdt-install">
      <span>{command}</span>
      <button
        type="button"
        onClick={onCopy}
        aria-label="Copy to clipboard"
        className="rdt-copy-btn"
      >
        {copied ? '✓' : '⧉'}
      </button>
    </code>
  );
}
