import api from "./axios";
import QueryHandler from "./query-handler";

export default class QrCodeService {
  private endpoint = "qr-codes";
  public async generateQrCode(userId: string, content: string) {
    return await QueryHandler(
      api.post(`${this.endpoint}`, { userId, content })
    );
  }
  public async validate(userId: string, content: string) {
    return await QueryHandler(
      api.post(`${this.endpoint}`, { userId, content })
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
