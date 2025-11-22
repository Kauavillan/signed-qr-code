import axios, { AxiosResponse } from "axios";

export class QueryError extends Error {
  public status?: number;
  public statusText?: string;
  public data?: any;
  public url?: string;
  public method?: string;

  constructor(
    message: string,
    status?: number,
    statusText?: string,
    data?: any,
    url?: string,
    method?: string
  ) {
    super(message);
    this.name = "QueryError";
    this.status = status;
    this.statusText = statusText;
    this.data = data;
    this.url = url;
    this.method = method;
  }

  // Method to get complete error information
  getErrorInfo() {
    return {
      message: this.message,
      status: this.status,
      statusText: this.statusText,
      data: this.data,
      url: this.url,
      method: this.method,
    };
  }

  // Method to check if it is a specific error
  isStatus(status: number): boolean {
    return this.status === status;
  }

  // Method to check if it is a client error (4xx)
  isClientError(): boolean {
    return this.status ? this.status >= 400 && this.status < 500 : false;
  }

  // Method to check if it is a server error (5xx)
  isServerError(): boolean {
    return this.status ? this.status >= 500 && this.status < 600 : false;
  }
}

export default async function QueryHandler(
  fetchFunction: Promise<AxiosResponse<any, any>>,
  dataHandler?: (data: any) => any
) {
  try {
    let response = await fetchFunction;
    if (response.data && dataHandler) {
      return dataHandler(response.data);
    }
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error) && error.response) {
      const errorMessage = error.response.data?.message || "error-occurred";
      console.log(
        "QueryHandler Error:",
        JSON.stringify(error.response, null, 2)
      );
      throw new QueryError(
        errorMessage,
        error.response.status,
        error.response.statusText,
        error.response.data,
        error.config?.url,
        error.config?.method?.toUpperCase()
      );
    } else if (axios.isAxiosError(error) && error.request) {
      console.log("Network Error: No response received", error.request);
      throw new QueryError(
        "network-error",
        undefined,
        "Network Error",
        undefined,
        error.config?.url,
        error.config?.method?.toUpperCase()
      );
    } else {
      // Other types of errors
      console.log("Unknown Error: ", error);
      throw error;
    }
  }
}
