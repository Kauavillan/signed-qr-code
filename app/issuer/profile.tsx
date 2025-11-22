import Button from "@/components/button";
import ScreenContainer from "@/components/screen-container";
import { ThemedText } from "@/components/themed-text";
import InputsContainer from "@/components/ui/inputs-container";
import InputsFormContainer from "@/components/ui/inputs-form-container";
import { useAuth } from "@/contexts/AuthContext";
import { useUpdateUsernameMutation } from "@/hooks/api/users/mutations";
import { nameSchema } from "@/schemas/validation";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "expo-router";
import { useForm } from "react-hook-form";
import { Alert, View } from "react-native";
import { z } from "zod";

export default function Profile() {
  const router = useRouter();
  const { logout } = useAuth();

  const updateUsernameSchema = z.object({ username: nameSchema });
  type UpdateUsernameData = z.infer<typeof updateUsernameSchema>;

  const { control, handleSubmit, formState, reset } =
    useForm<UpdateUsernameData>({
      resolver: zodResolver(updateUsernameSchema),
      defaultValues: { username: "" },
    });

  const { mutateAsync: updateUsername, isPending } = useUpdateUsernameMutation({
    onError: (e) =>
      Alert.alert("Erro", e.message ?? "Falha ao atualizar username"),
    onSuccess: () => {
      Alert.alert("Sucesso", "Username atualizado com sucesso.");
      reset({ username: "" });
    },
  });

  async function onSubmit(data: UpdateUsernameData) {
    await updateUsername({ username: data.username });
  }

  async function onSignOut() {
    await logout();
    router.replace("/login");
  }

  return (
    <ScreenContainer includeSafeArea>
      <InputsFormContainer>
        <ThemedText style={{ fontWeight: "bold", fontSize: 16 }}>
          Gerenciar conta
        </ThemedText>

        <View style={{ height: 24 }} />

        <InputsContainer>
          <ThemedText style={{ marginBottom: 8 }}>Sessão</ThemedText>
          <Button text="Sair da conta" onPress={onSignOut} />
        </InputsContainer>
      </InputsFormContainer>
    </ScreenContainer>
  );
}
