import Button from "@/components/button";
import ControlledTextInput from "@/components/controlled-text-input";
import ScreenContainer from "@/components/screen-container";
import { ThemedText } from "@/components/themed-text";
import InputsContainer from "@/components/ui/inputs-container";
import { useCreateQrCode } from "@/hooks/api/qr-codes/mutations";
import { QrCodeContentData, qrCodeContentSchema } from "@/schemas/validation";
import { zodResolver } from "@hookform/resolvers/zod";
import { useQueryClient } from "@tanstack/react-query";
import { useRouter } from "expo-router";
import { useForm } from "react-hook-form";
import { ActivityIndicator } from "react-native";

export default function GenerateCodes() {
  const { control, handleSubmit, formState } = useForm<QrCodeContentData>({
    resolver: zodResolver(qrCodeContentSchema),
  });
  const queryClient = useQueryClient();
  const router = useRouter();
  const {
    mutateAsync,
    isPending,
    data: qrCodeData,
  } = useCreateQrCode({
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["qr-codes", "by-user"],
        exact: false,
      });
      router.back();
    },
  });

  function onSubmit(data: QrCodeContentData) {
    mutateAsync(data.content);
  }

  return (
    <ScreenContainer>
      <ThemedText
        style={{ marginBottom: 20, fontSize: 16, fontWeight: "bold" }}
      >
        Gerador de qr codes seguros
      </ThemedText>
      <InputsContainer>
        <ControlledTextInput
          control={control}
          name="content"
          placeholder="Conteúdo do QR Code"
          errors={formState.errors}
          multiline
        />
        <Button
          text="Gerar QR code"
          onPress={handleSubmit(onSubmit)}
          isLoading={isPending}
        />
        {isPending && <ActivityIndicator size="large" />}
      </InputsContainer>
    </ScreenContainer>
  );
}
