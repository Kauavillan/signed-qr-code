import { ExecuteOnAction } from "@/interfaces/api-interfaces";
import { TokensResponse } from "@/interfaces/tokens-interfaces";
import { CreateUserInterface } from "@/interfaces/user/create-user";
import { LoginInterface } from "@/interfaces/user/login";
import { UpdateUsernameInterface } from "@/interfaces/user/update-username";
import UserService from "@/services/user-service";
import { updateTokens } from "@/utils/user-handler";
import { useMutation } from "@tanstack/react-query";

export function useCreateUserMutation(onAction?: ExecuteOnAction) {
  const mutation = useMutation({
    mutationFn: async (data: CreateUserInterface) => {
      return await new UserService().createUser(data);
    },
    ...onAction,
    mutationKey: ["create-user"],
  });
  return mutation;
}

export function useUserLoginMutation(onAction?: ExecuteOnAction) {
  const mutation = useMutation({
    mutationFn: async (data: LoginInterface) => {
      return await new UserService().login(data);
    },
    ...onAction,

    onSuccess: (data: TokensResponse) => {
      updateTokens(data.token);
    },
    mutationKey: ["login"],
  });
  return mutation;
}

export function useUpdateUsernameMutation(onAction?: ExecuteOnAction) {
  const mutation = useMutation({
    mutationFn: async (data: UpdateUsernameInterface) => {
      return await new UserService().updateUsername(data);
    },
    ...onAction,
    mutationKey: ["update-username"],
  });
  return mutation;
}
