import QrCodeService from "@/services/qr-code-service";
import { useInfiniteQuery } from "@tanstack/react-query";

export type QrCodeItem = {
  id: string;
  content: string;
  signature: string;
  userId: string;
  createdAt: string;
  qrCodeText: string;
  issuerName: string;
};

type UseInfiniteUserQrCodesParams = {
  userId?: string | null;
  limit?: number;
  enabled?: boolean;
};

export function useInfiniteUserQrCodes({
  userId,
  limit = 8,
  enabled = true,
}: UseInfiniteUserQrCodesParams) {
  const query = useInfiniteQuery<QrCodeItem[]>({
    queryKey: ["qr-codes", "by-user", userId, limit],
    enabled: !!userId && enabled,
    initialPageParam: 1,
    queryFn: async ({ pageParam }) => {
      const page =
        typeof pageParam === "number" ? pageParam : Number(pageParam) || 1;
      return await new QrCodeService().listByUser(String(userId), page, limit);
    },
    getNextPageParam: (lastPage, allPages) => {
      // Se a última página retornou menos que o limite, não há próxima página
      if (!lastPage || lastPage.length < limit) return undefined;
      return allPages.length + 1; // próxima página
    },
  });

  return query;
}
