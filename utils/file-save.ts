import * as FileSystem from "expo-file-system";
import * as Sharing from "expo-sharing";
import { Platform } from "react-native";

type SaveResult = {
  status: "saved" | "shared" | "copied" | "error";
  uri?: string;
  error?: unknown;
};

export async function saveOrSharePdf(
  printUri: string,
  filename: string
): Promise<SaveResult> {
  const safeName = filename.replace(/[^a-zA-Z0-9._-]/g, "_");
  const FS: any = FileSystem;
  try {
    if (Platform.OS === "android" && FS.StorageAccessFramework) {
      const permissions =
        await FS.StorageAccessFramework.requestDirectoryPermissionsAsync();
      if (permissions.granted) {
        const base64 = await FS.readAsStringAsync(printUri, {
          encoding: FS.EncodingType?.Base64 ?? "base64",
        });
        const destUri = await FS.StorageAccessFramework.createFileAsync(
          permissions.directoryUri,
          safeName,
          "application/pdf"
        );
        await FS.writeAsStringAsync(destUri, base64, {
          encoding: FS.EncodingType?.Base64 ?? "base64",
        });
        return { status: "saved", uri: destUri };
      }
    }

    if (await Sharing.isAvailableAsync()) {
      await Sharing.shareAsync(printUri, {
        mimeType: "application/pdf",
        dialogTitle: safeName,
        UTI: "com.adobe.pdf",
      });
      return { status: "shared" };
    }

    const docs = FS.documentDirectory;
    if (docs) {
      const dest = `${docs}${safeName}`;
      await FileSystem.copyAsync({ from: printUri, to: dest });
      return { status: "copied", uri: dest };
    }
    return { status: "error" };
  } catch (error) {
    return { status: "error", error };
  }
}
