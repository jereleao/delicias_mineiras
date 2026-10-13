"use client";

import { useCallback, useEffect, useRef } from "react";
import { toast } from "sonner";
import { api } from "~/libs/trpc/react";

export interface UseUserConfigOptions {
  skipToastError?: boolean;
}

export interface UserConfigResult<T, TData> {
  data: TData;
  isPending: boolean;
  mutate: (value: T) => void;
  mutateAsync: (value: T) => Promise<{ value: unknown }>;
  variables: T | undefined;
  fetchStatus: "fetching" | "paused" | "idle";
}

export function useUserConfig<T>(
  key: string,
  initialStateConstructor: T | (() => T),
  options?: UseUserConfigOptions,
): UserConfigResult<T, T>;
export function useUserConfig<T>(
  key: string,
  initialStateConstructor?: undefined,
  options?: UseUserConfigOptions,
): UserConfigResult<T, T | null>;
export function useUserConfig<T>(
  key: string,
  initialStateConstructor?: T | (() => T),
  options: UseUserConfigOptions = {},
): UserConfigResult<T, T | null> {
  const utils = api.useUtils();
  const queryKey = { key };
  const query = api.userObject.getByKey.useQuery(queryKey, {
    staleTime: 10 * 60 * 1000,
  });

  const {
    mutate: saveConfig,
    mutateAsync: saveConfigAsync,
    isPending,
    variables,
  } = api.userObject.createOrUpdate.useMutation({
    onSuccess: async (result) => {
      utils.userObject.getByKey.setData(queryKey, result);
      await utils.userObject.getByKey.invalidate(queryKey);
    },
    onError: (error) => {
      if (!options.skipToastError) toast.error(error.message);
    },
  });

  const mutate = useCallback(
    (value: T) => saveConfig({ key, value }),
    [key, saveConfig],
  );
  const mutateAsync = useCallback(
    (value: T) => saveConfigAsync({ key, value }),
    [key, saveConfigAsync],
  );
  const initializedKey = useRef<string | null>(null);

  useEffect(() => {
    if (
      query.isPending ||
      query.isError ||
      query.data !== null ||
      typeof initialStateConstructor === "undefined" ||
      initializedKey.current === key
    ) {
      return;
    }

    initializedKey.current = key;
    const initialState =
      typeof initialStateConstructor === "function"
        ? (initialStateConstructor as () => T)()
        : initialStateConstructor;

    mutate(initialState);
  }, [
    initialStateConstructor,
    key,
    mutate,
    query.data,
    query.isError,
    query.isPending,
  ]);

  return {
    data: query.isError ? null : (query.data?.value as T | null),
    isPending: query.isPending || isPending,
    mutate,
    mutateAsync,
    variables: variables?.value as T | undefined,
    fetchStatus: query.fetchStatus,
  };
}

export default useUserConfig;
