"use client";

import { Suspense, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { createPortal } from "react-dom";

export function Modal({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const dialogRef = useRef<HTMLDialogElement>(null);

  useEffect(() => {
    if (!dialogRef.current?.open) {
      dialogRef.current?.showModal();
    }
  }, []);

  function onDismiss() {
    router.back();
  }

  return createPortal(
    <dialog
      ref={dialogRef}
      className="z-10 flex h-screen w-screen items-center justify-center bg-zinc-900/15"
      onClose={onDismiss}
      onClick={(e) => e.target === dialogRef.current && onDismiss()}
    >
      <Suspense fallback={<p className="bg-foreground">Loading...</p>}>
        {children}
      </Suspense>
    </dialog>,
    document.getElementById("modal-root")!,
  );
}
