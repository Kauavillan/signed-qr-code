import type QRCode from "react-native-qrcode-svg";

export async function qrToDataURL(qrRef: QRCode): Promise<string> {
  return new Promise((resolve, reject) => {
    try {
      const refAny = qrRef as unknown as {
        toDataURL: (cb: (data: string) => void) => void;
      };
      refAny.toDataURL((data: string) => {
        resolve(`data:image/png;base64,${data}`);
      });
    } catch (e) {
      reject(e);
    }
  });
}
