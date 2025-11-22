import { ExecuteOnAction } from "@/interfaces/api-interfaces";
import QrCodeService from "@/services/qr-code-service";
import { getUserFromStorage } from "@/utils/user-handler";
import { useMutation } from "@tanstack/react-query";

export function useCreateQrCode(onAction?: ExecuteOnAction) {
  const mutation = useMutation({
    mutationFn: async (content: string) => {
      const user = await getUserFromStorage();
      console.log("Creating QR code for user:", user);
      if (!user?.id) return null;
      return await new QrCodeService().generateQrCode(user.id, content);
    },
    ...onAction,
    mutationKey: ["create-qr-code"],
  });
  return mutation;
}
