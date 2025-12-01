import api from "./axios";
import QueryHandler from "./query-handler";

export default class ComplaintService {
  private endpoint = "complaints";

  async reportQrCode(
    qrCodeId: string,
    deviceId: string,
    description?: string,
    userId?: string | null
  ) {
    return await QueryHandler(
      api.post(`${this.endpoint}`, {
        description,
        deviceId,
        qrCodeId,
        userId,
      })
    );
  }

  async checkIfDeviceCanComplaint(
    qrCodeId: string,
    deviceId: string
  ): Promise<{ canSubmit: boolean }> {
    const searchParams = new URLSearchParams({
      deviceId: String(deviceId),
      qrCodeId: String(qrCodeId),
    });
    return await QueryHandler(
      api.get(`${this.endpoint}/can-submit?${searchParams.toString()}`)
    );
  }
}
