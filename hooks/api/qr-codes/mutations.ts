import { ExecuteOnAction } from "@/interfaces/api-interfaces";
import QrCodeService from "@/services/qr-code-service";
import { getUserFromStorage } from "@/utils/user-handler";
import { useMutation } from "@tanstack/react-query";

export function useCreateQrCode(onAction?: ExecuteOnAction) {
  const mutation = useMutation({
    mutationFn: async (content: string) => {
      const user = await getUserFromStorage();
      if (!user?.id) return null;
      return await new QrCodeService().generateQrCode(user.id, content);
    },
    ...onAction,
    mutationKey: ["create-qr-code"],
  });
  return mutation;
}

export function useValidateQrCode(onAction?: ExecuteOnAction) {
  const mutation = useMutation({
    mutationFn: async (content: string) => {
      return await new QrCodeService().validate(content);
    },
    ...onAction,
    mutationKey: ["validate-qr-code"],
  });
  return mutation;
}
