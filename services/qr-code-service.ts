import { QrCodeItem } from "@/hooks/api/qr-codes/queries";
import api from "./axios";
import QueryHandler from "./query-handler";

export default class QrCodeService {
  private endpoint = "qr-codes";
  public async generateQrCode(userId: string, content: string) {
    return await QueryHandler(
      api.post(`${this.endpoint}`, { userId, content })
    );
  }
  public async validate(content: string): Promise<QrCodeItem> {
    return await QueryHandler(
      api.post(`${this.endpoint}/verify`, { qrCodeText: content })
    );
  }

  public async listByUser(userId: string, page = 1, limit = 8) {
    return await QueryHandler(
      api.get(`${this.endpoint}/users/${userId}`, {
        params: { page, limit },
      })
    );
  }
}
