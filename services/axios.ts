import {
  deleteTokens,
  getBearerToken,
  UserDataFromStorage,
} from "@/utils/user-handler";
import { TokensResponse } from "@interfaces/tokens-interfaces";
import Axios, { AxiosResponse } from "axios";
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import { router } from "expo-router";

let token = getBearerToken();
dayjs.extend(utc);
const baseURL =
  process.env.EXPO_PUBLIC_BACKEND_URL || "http://bsi.cefet-rj.br:3010/api";

const api = Axios.create({
  baseURL,
  // headers: {
  //   Authorization: `Bearer ${token}`,
  // },
});
let canRedirectToLogin = true;

let isRedirectingToLogin = false;
function redirectToLogin() {
  if (!isRedirectingToLogin && canRedirectToLogin) {
    isRedirectingToLogin = true;
    router.replace("/login");
    setTimeout(() => {
      isRedirectingToLogin = false;
    }, 1000); // enough time to avoid multiple redirects
  }
}

function handleRefreshTokenError(error: any) {
  // Se for 401 ou 404, deletar tokens e redirecionar para login
  if (error?.response?.status === 401 || error?.response?.status === 404) {
    deleteTokens();
    redirectToLogin();
    return Promise.reject(error);
  }

  // Para outros erros, deletar tokens e redirecionar para login
  deleteTokens();
  router.replace("/login");
  return Promise.reject(error);
}

export function disableRedirectToLoginInHttpCommon() {
  canRedirectToLogin = false;
}

export function clearRequestToken() {
  token = null;
  api.defaults.headers.Authorization = "";
}
let isRefreshing = false;

let refreshSubscribers: ((token: string) => void)[] = [];
function onRefreshed(token: string) {
  refreshSubscribers.map((callback) => callback(token));
}

function addRefreshSubscriber(callback: (token: string) => void) {
  refreshSubscribers.push(callback);
}

async function refreshTokenRequest(
  user: UserDataFromStorage | null,
  refreshToken: string | null,
  deviceId: string | null
): Promise<AxiosResponse<TokensResponse>> {
  return await Axios.post(`${baseURL}/users/refresh-token`, {
    userId: user?.id,
    token: refreshToken,
    deviceId: deviceId,
  });
}

api.interceptors.request.use(async (req) => {
  const noAuthRoutes = [
    { method: "post", url: /\/login/ },
    { method: "post", url: /^users$/ },
  ];
  const isNoAuthRoute = noAuthRoutes.some(
    (route) => route.method === req.method && route.url.test(req.url ?? "")
  );
  if (isNoAuthRoute) return req;
  if (!token || !req.headers.Authorization) {
    token = getBearerToken();
    console.log("Attaching token to request:", token);
    // Means that the user is not logged in
    if (!token) {
      return req;
    }
    req.headers.Authorization = `Bearer ${token}`;
  }
  // const decodedToken = jwtDecode(token!);

  // const isExpired = dayjs.unix(decodedToken.exp!).utc().diff(dayjs().utc()) < 1;
  console.log("Request with token:", req.headers.Authorization);
  return req;

  // if (!isRefreshing) {
  // isRefreshing = true;

  // try {
  //   const user = await getUserFromStorage();

  //   if (!refreshToken) redirectToLogin();
  //   const response = await refreshTokenRequest(user, refreshToken, deviceId);
  //   if (response.status === 200) {
  //     token = response.data.token;
  //     updateTokens(token!, response.data.refreshToken);
  //     req.headers.Authorization = `Bearer ${token}`;
  //     onRefreshed(token!);
  //   } else {
  //     redirectToLogin();
  //   }
  // } catch (error: any) {
  //   console.log(
  //     "Error occurred during token refresh in request ineterceptor:",
  //     error
  //   );
  //   return handleRefreshTokenError(error);
  // } finally {
  //   isRefreshing = false;
  //   refreshSubscribers = [];
  // }
  // } else {
  //   return new Promise((resolve) => {
  //     addRefreshSubscriber((newToken: string) => {
  //       req.headers.Authorization = `Bearer ${newToken}`;
  //       resolve(req);
  //     });
  //   });
  // }

  // return req;
});

// api.interceptors.response.use(
//   (response) => {
//     return response;
//   },
//   async (error: AxiosError) => {
//     const originalRequest = error.config;

//     // Treating 401 error (expired token)
//     if (
//       error.response &&
//       error.response.status === 401 &&
//       originalRequest &&
//       !(originalRequest as any)._retry
//     ) {
//       (originalRequest as any)._retry = true;

//       if (!isRefreshing) {
//         isRefreshing = true;
//         try {
//           const user = await getUserFromStorage();
//           const refreshToken = getRefreshToken();
//           const deviceId = await getDeviceId();

//           if (!refreshToken) {
//             deleteTokens();
//             redirectToLogin();
//             return Promise.reject(error);
//           }

//           const response = await refreshTokenRequest(
//             user,
//             refreshToken,
//             deviceId
//           );

//           if (response.status === 200) {
//             token = response.data.token;
//             updateTokens(token!, response.data.refreshToken);
//             api.defaults.headers["Authorization"] = `Bearer ${token}`;
//             originalRequest!.headers!["Authorization"] = `Bearer ${token}`;
//             onRefreshed(token!);
//             return api(originalRequest!);
//           } else {
//             handleRefreshTokenError(response);
//           }
//         } catch (refreshError: any) {
//           console.log(
//             "Error occurred during token in response ineterceptor:",
//             error
//           );
//           return handleRefreshTokenError(refreshError);
//         } finally {
//           isRefreshing = false;
//           refreshSubscribers = [];
//         }
//       } else {
//         return new Promise((resolve, reject) => {
//           addRefreshSubscriber((newToken: string) => {
//             if (originalRequest?.headers) {
//               originalRequest.headers["Authorization"] = `Bearer ${newToken}`;
//               resolve(api(originalRequest));
//             } else {
//               reject(error);
//             }
//           });
//         });
//       }
//     }

//     return Promise.reject(error);
//   }
// );

export default api;
