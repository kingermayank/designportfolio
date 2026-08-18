"use client";

import { CopyButton } from "@/components/interior/copy-button";

type CopyEmailButtonProps = {
  email: string;
  label?: string;
  copiedLabel?: string;
  errorLabel?: string;
  showIcon?: boolean;
  className?: string;
};

export default function CopyEmailButton({
  email,
  label = "Copy Email",
  copiedLabel = "Copied",
  errorLabel = "Failed",
  showIcon = true,
  className = "workFitBtn workFitBtnGhost",
}: CopyEmailButtonProps) {
  return (
    <CopyButton
      value={email}
      label={label}
      copiedLabel={copiedLabel}
      errorLabel={errorLabel}
      showIcon={showIcon}
      className={className}
    />
  );
}
