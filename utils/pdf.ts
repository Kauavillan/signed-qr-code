import { Colors } from "@/constants/theme";
import type { QrCodeItem } from "@/hooks/api/qr-codes/queries";
import { Asset } from "expo-asset";
import * as FileSystem from "expo-file-system";

const escapeHtml = (v?: string) =>
  String(v ?? "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");

export async function getLogoAsBase64(): Promise<string | undefined> {
  try {
    const asset = Asset.fromModule(require("@assets/images/logo.png"));
    await asset.downloadAsync();
    if (!asset.localUri) return undefined;
    const base64 = await new FileSystem.File(asset.localUri).base64();
    console.log("Base64 logo length:", base64);
    return `data:image/png;base64,${base64}`;
  } catch (error) {
    console.error("Error loading logo:", error);
    return undefined;
  }
}

export function buildQrPdfHtml(
  item: QrCodeItem,
  qrDataUrl: string,
  logoDataUrl?: string
): string {
  const createdAt = new Date(item.createdAt).toLocaleString();
  return `<!DOCTYPE html>
<html lang="pt-BR">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>QRCode ${escapeHtml(item.id)}</title>
    <style>
      @page { size: A4; margin: 2cm; }
      body { font-family: -apple-system, BlinkMacSystemFont, Segoe UI, Roboto, Helvetica, Arial, sans-serif; color: #111; }
      .wrap { display: flex; flex-direction: column; align-items: center; justify-content: flex-start; text-align: center; }
      .logo { margin: 16px 0 12px; }
      .logo img { width: 80px; height: 80px; object-fit: contain; }
      .app-name { font-size: 22px; color: #555; margin: 0 0 24px; }
      .app-name strong { color: ${Colors.primary}; font-weight: 700; }
      .qr { margin: 16px 0 24px; }
      .qr img { width: 300px; height: 300px; object-fit: contain; }
      .title { font-size: 20px; font-weight: 700; margin: 0 0 8px; }
      .meta { font-size: 12px; color: #444; margin: 0 0 16px; }
      .section { width: 100%; max-width: 640px; text-align: left; }
      .row { margin: 6px 0; }
      .label { font-weight: 600; }
      .value { word-break: break-word; }
      hr { border: none; height: 1px; background: #e5e5e5; margin: 16px 0; }
    </style>
  </head>
  <body>
    <div class="wrap">
      ${
        logoDataUrl
          ? `<div class="logo">
        <img src="${logoDataUrl}" alt="Logo QRypt" />
      </div>
      <div class="app-name">Gerado pelo <strong>QRypt</strong></div>`
          : ""
      }
      <div class="title">${escapeHtml(item.username)}</div>
      <div class="meta">Gerado em ${escapeHtml(createdAt)}</div>
      <div class="qr">
        <img src="${qrDataUrl}" alt="QR Code" />
      </div>
      <div class="section">
      <span class="label">Antes de usar o QR Code, verifique se as informações após a leitura são as mesmas das abaixo:</span>
        <div class="row"><span class="label">Conteúdo:</span> <span class="value">${escapeHtml(
          item.content
        )}</span></div>
        <div class="row"><span class="label">Emissor:</span> <span class="value">${escapeHtml(
          item.issuerName
        )}</span></div>
      </div>
    </div>
  </body>
</html>`;
}
