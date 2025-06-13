"use client";

import { Modal } from "@/components/ui/modal";
import { UsernameForm } from "@/components/forms/username";

export function UsernameModal({ userId }: { userId: string }) {
  return (
    <Modal isOpen={true} onClose={() => {}}>
      <UsernameForm userId={userId} />
    </Modal>
  );
}