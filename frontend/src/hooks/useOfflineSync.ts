import { useState, useCallback } from 'react';
import { OperationalRecord } from '../types';
import { getApiUrl } from '../lib/api';

interface UseOfflineSyncParams {
  fetchDashboardData: () => Promise<void>;
  refreshUser: () => void;
}

export function useOfflineSync({ fetchDashboardData, refreshUser }: UseOfflineSyncParams) {
  const [offlineMode, setOfflineMode] = useState<boolean>(false);
  const [offlineCache, setOfflineCache] = useState<OperationalRecord[]>([]);
  const [syncingOffline, setSyncingOffline] = useState<boolean>(false);

  const handleToggleConnection = useCallback(async () => {
    if (!offlineMode) {
      setOfflineMode(true);
      alert('Modo Offline Ativado! O ERP OLO Fintel agora esta a funcionar em cache local resiliente.');
    } else {
      setSyncingOffline(true);
      setOfflineMode(false);
      if (offlineCache.length > 0) {
        try {
          for (const item of offlineCache) {
            await fetch(getApiUrl('/api/operations/add'), {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                orgId: item.orgId, type: item.type,
                title: item.title.replace(' [OFFLINE]', ''),
                quantity: item.quantity?.toString() || '', unit: item.unit,
                amount: item.amount?.toString() || '',
                notes: (item.notes || '').replace(' (Registo Offline)', '') + ' (Sincronizado Offline)',
                date: item.date
              })
            });
          }
          alert('Ligacao restabelecida e sincronizacao concluida com sucesso.');
          setOfflineCache([]);
          fetchDashboardData();
          refreshUser();
        } catch (err) {
          console.error('Erro na sincronizacao offline:', err);
          alert('Nao foi possivel sincronizar todos os dados.');
        } finally {
          setSyncingOffline(false);
        }
      } else {
        alert('Modo Online restabelecido!');
        setSyncingOffline(false);
      }
    }
  }, [offlineMode, offlineCache, fetchDashboardData, refreshUser]);

  return {
    offlineMode,
    setOfflineMode,
    offlineCache,
    setOfflineCache,
    syncingOffline,
    handleToggleConnection,
  };
}
