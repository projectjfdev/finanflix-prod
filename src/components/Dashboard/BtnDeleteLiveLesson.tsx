"use client";

import { deleteLiveLessonById } from "@/utils/Endpoints/liveLessonEndpoint";
import { AlertDialogAction } from "../ui/alert-dialog";
import { useState } from "react";
import { SuccessModal } from "../SuccessModal/SuccesModal";

interface Props {
  message: string;
  success: boolean;
}

export const BtnDeleteLiveLesson = ({
  liveLessonId,
}: {
  liveLessonId: string;
}) => {
  const [isApproved, setIsApproved] = useState<Props>();
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const deleteLiveLesson = async (id: string) => {
    try {
      const res = await deleteLiveLessonById(id);
      setShowSuccessModal(true);
      setIsApproved(res);
    } catch (error) {
      console.error("Error deleting live lesson:", error);
    }
  };
  return (
    <div>
      <AlertDialogAction onClick={() => deleteLiveLesson(liveLessonId)}>
        Eliminar
      </AlertDialogAction>
      {isApproved && showSuccessModal && (
        <SuccessModal
          success={isApproved.success}
          text={isApproved.message}
          onClose={() => setShowSuccessModal(false)}
        />
      )}
    </div>
  );
};
