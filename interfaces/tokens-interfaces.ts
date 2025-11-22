export interface TokensResponse {
  token: string;
  refreshToken: string;
}

export interface RefreshTokenOnly {
  refreshToken: string;
}
