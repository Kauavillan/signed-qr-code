import ComplaintService from "@/services/complaint-service";
import { getDeviceId } from "@/utils/user-handler";
import { useQuery } from "@tanstack/react-query";

export function useCheckIfDeviceCanComplaint(qrCodeId?: string) {
  const query = useQuery({
    queryFn: async () => {
      if (!qrCodeId) return null;
      const deviceId = await getDeviceId();
      return await new ComplaintService().checkIfDeviceCanComplaint(
        qrCodeId,
        deviceId
      );
    },
    queryKey: ["can-complaint", qrCodeId],
  });

  return query;
}
