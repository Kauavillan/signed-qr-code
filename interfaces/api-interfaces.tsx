import { UseMutationOptions } from "@tanstack/react-query";

export type onErrorFn = (error: Error) => void;

export interface ExecuteOnAction {
  onSuccess?: (data?: any) => void;
  onError?: onErrorFn;
  onSettled?: UseMutationOptions<any, Error, any>["onSettled"];
}
