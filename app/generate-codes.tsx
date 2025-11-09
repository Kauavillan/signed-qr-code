import sizes from "@/constants/sizes";
import Pako from "pako";
import { useMemo } from "react";
import { Text, View } from "react-native";
import QRCode from "react-native-qrcode-svg";

export default function GenerateCodes() {
  // Gera uma assinatura RSA-4096 simulada (base64) - 684 caracteres
  const generateLargeSignature = () => {
    const chars =
      "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/";
    let signature = "";
    for (let i = 0; i < 684; i++) {
      signature += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return signature;
  };

  // Gera conteúdo complexo e variado
  const generateLargeContent = () => {
    const metadata = {
      version: "2.0.1",
      protocol: "TrueQR-Signature-Verification",
      encryption: "RSA-4096-SHA256",
      timestamp_generated: new Date().toISOString(),
      validity: {
        start: "2025-01-01T00:00:00Z",
        end: "2026-12-31T23:59:59Z",
        timezone: "UTC",
      },
      issuer_details: {
        organization: "Certificadora Digital Brasil LTDA",
        cnpj: "12.345.678/0001-90",
        address: "Av. Paulista, 1578 - Bela Vista, São Paulo - SP, 01310-200",
        contact: {
          email: "certificacao@digitalcert.com.br",
          phone: "+55 11 3456-7890",
          website: "https://www.digitalcert.com.br",
        },
        certificate_authority: "ICP-Brasil Tier 1",
        registration_number: "CA-BR-2024-001234",
      },
      document_info: {
        type: "invoice",
        number: "NF-2025-0000123456",
        series: "A1",
        total_value: "R$ 15.847,92",
        currency: "BRL",
        items_count: 47,
        tax_id: "35250112345678000190550010000123456123456789",
      },
      verification_url:
        "https://api.trueqr.verify.com.br/v2/check?id=ec13720d-aaf7-4881-aba9-7d047b6ab688&hash=sha256:8f3b9c1d2e4a5f6b7c8d9e0f1a2b3c4d5e6f7a8b9c0d1e2f3a4b5c6d7e8f9a0b",
      additional_data: {
        customer: {
          name: "João da Silva Santos",
          cpf: "123.456.789-00",
          email: "joao.santos@email.com.br",
        },
        seller: {
          name: "Maria Oliveira Costa",
          employee_id: "EMP-2024-5678",
        },
        payment: {
          method: "credit_card",
          installments: 3,
          authorization_code: "AUTH-2025-XYZ-789456123",
        },
      },
    };

    return JSON.stringify(metadata, null, 2);
  };

  const originalValue = JSON.stringify(
    {
      issuer:
        "Certificadora Digital Brasil LTDA - Autoridade Certificadora Credenciada ICP-Brasil",
      content: generateLargeContent(),
      id: "ec13720d-aaf7-4881-aba9-7d047b6ab688",
      timestamp: Math.floor(Date.now() / 1000).toString(),
      signature: generateLargeSignature(),
      metadata: {
        algorithm: "RSA-4096",
        hash: "SHA-256",
        encoding: "base64",
        key_id: "KEY-2025-BR-CERT-4096-001",
        chain: ["ROOT-CA-BR-2024", "INTERMEDIATE-CA-BR-2025", "LEAF-CERT-2025"],
      },
    },
    null,
    2
  );

  const compressedValue = useMemo(() => {
    try {
      console.log(originalValue);
      console.log("Tamanho original:", originalValue.length, "bytes");

      // Comprime o conteúdo usando pako
      const compressed = Pako.deflate(originalValue.repeat(4));

      // Converte para base64
      const base64 = btoa(
        String.fromCharCode.apply(null, Array.from(compressed))
      );

      console.log("Tamanho comprimido:", base64.length, "bytes");
      console.log(
        "Taxa de compressão:",
        ((1 - base64.length / originalValue.length) * 100).toFixed(2) + "%"
      );

      return base64;
    } catch (error) {
      console.error("Erro ao comprimir o conteúdo:", error);
      return originalValue;
    }
  }, [originalValue]);

  return (
    <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
      <Text style={{ marginBottom: 20, fontSize: 16, fontWeight: "bold" }}>
        Gerador de código
      </Text>
      <Text style={{ marginBottom: 10 }}>
        Original: {originalValue.length} bytes
      </Text>
      <Text style={{ marginBottom: 20 }}>
        Comprimido: {compressedValue.length} bytes
      </Text>
      <QRCode value={compressedValue} size={sizes.vw[100]} ecl="M" />
    </View>
  );
}
