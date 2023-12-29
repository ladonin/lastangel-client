/*
  import { useQueryHook } from 'hooks/useQueryHook';
  Хук для работы с url (получение query-параметров)
 */
import { useMemo } from "react";
import { useLocation } from "react-router-dom";

export const useQueryHook = () => {
  const { search } = useLocation();

  return useMemo(() => new URLSearchParams(search), [search]);
};
