"use client";

import { CopyButton } from "@/components/interior/copy-button";

type CopyEmailButtonProps = {
  email: string;
  label?: string;
  copiedLabel?: string;
  errorLabel?: string;
  showIcon?: boolean;
  className?: string;
  /** Fires only after the email actually reached the clipboard. */
  onCopy?: (value: string) => void;
};

export default function CopyEmailButton({
  email,
  label = "Copy Email",
  copiedLabel = "Copied",
  errorLabel = "Failed",
  showIcon = true,
  className = "workFitBtn workFitBtnGhost",
  onCopy,
}: CopyEmailButtonProps) {
  return (
    <CopyButton
      value={email}
      label={label}
      copiedLabel={copiedLabel}
      errorLabel={errorLabel}
      showIcon={showIcon}
      idleIcon="email"
      className={className}
      onCopy={onCopy}
    />
  );
}
