import { ExecuteOnAction } from "@/interfaces/api-interfaces";
import ComplaintService from "@/services/complaint-service";
import { getDeviceId } from "@/utils/user-handler";
import { useMutation } from "@tanstack/react-query";

export function useCreateComplaintMutation(onAction?: ExecuteOnAction) {
  const mutation = useMutation({
    mutationFn: async ({
      qrCodeId,
      description,
    }: {
      qrCodeId: string;
      description: string | undefined;
    }) => {
      const deviceId = await getDeviceId();
      return await new ComplaintService().reportQrCode(
        qrCodeId,
        deviceId,
        description
      );
    },
    ...onAction,
    mutationKey: ["create-complaint"],
  });
  return mutation;
}
