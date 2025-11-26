import Button from "@/components/button";
import ControlledTextInput from "@/components/controlled-text-input";
import ErrorBanner from "@/components/error-banner";
import ScreenContainer from "@/components/screen-container";
import { ThemedText } from "@/components/themed-text";
import InputsContainer from "@/components/ui/inputs-container";
import { useCreateComplaintMutation } from "@/hooks/api/complaints/mutations";
import {
  ComplaintReportFormData,
  complaintReportSchema,
} from "@/schemas/validation";
import { zodResolver } from "@hookform/resolvers/zod";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useState } from "react";
import { useForm } from "react-hook-form";

export default function ReportQrCodePage() {
  const { qrCodeId }: { qrCodeId: string } = useLocalSearchParams();
  const router = useRouter();
  const { control, handleSubmit, formState } = useForm<ComplaintReportFormData>(
    {
      resolver: zodResolver(complaintReportSchema),
      defaultValues: { details: "" },
    }
  );
  const { mutateAsync, isPending, error } = useCreateComplaintMutation({
    onSuccess: () => router.push(`/${qrCodeId}/report-completed`),
  });
  const [submittedValue, setSubmittedValue] = useState<string | undefined>(
    undefined
  );

  function onSubmit(data: ComplaintReportFormData) {
    mutateAsync({
      qrCodeId,
      description: data.details,
    });
    setSubmittedValue(data.details);
  }
  return (
    <ScreenContainer>
      <InputsContainer>
        <ThemedText>
          Identificou algum problema no QR code? Faça uma denúncia
        </ThemedText>
        <ErrorBanner error={error} />
        <ControlledTextInput
          control={control}
          name="details"
          placeholder="Descrição (opcional)"
          errors={formState.errors}
        />
        <Button
          text="Denunciar código"
          onPress={handleSubmit(onSubmit)}
          icon={{ name: "report", provider: "MaterialIcons" }}
          colorScheme="red"
          isLoading={isPending}
        />
      </InputsContainer>
      {submittedValue !== undefined && (
        <ThemedText style={{ marginTop: 12 }}>
          Descrição enviada: {submittedValue}
        </ThemedText>
      )}
    </ScreenContainer>
  );
}
