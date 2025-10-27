import { useCallback, useEffect, useState } from "react";
import { API_ENDPOINTS } from "../constants/api";
import { Account, UseAccountResult } from "../types/movie";
import tmdbAxios from "../utils/api";

const useAccount = (accountId: number | null): UseAccountResult => {
  const [account, setAccount] = useState<Account | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const fetchAccount = useCallback(async () => {
    if (!accountId) {
      setAccount(null);
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);

      const response = await tmdbAxios.get<Account>(
        `${API_ENDPOINTS.ACCOUNT}/${accountId}`
      );

      setAccount(response.data);
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "An error occurred while fetching account information"
      );
      console.error("Error fetching account:", err);
    } finally {
      setLoading(false);
    }
  }, [accountId]);

  const refreshAccount = useCallback(() => {
    fetchAccount();
  }, [fetchAccount]);

  useEffect(() => {
    fetchAccount();
  }, [fetchAccount]);

  return {
    account,
    loading,
    error,
    refreshAccount
  };
};

export default useAccount;
