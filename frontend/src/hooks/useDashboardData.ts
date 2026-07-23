import { useState, useCallback } from 'react';
import { getApiUrl } from '../lib/api';
import { useAuth } from '../contexts/AuthContext';
import type { Organization, UserContext } from '../types';
import type { DocumentRecord } from '../types';

interface DashboardData {
  organizations: Organization[];
  usersList: UserContext[];
  consultants: any[];
  operationalLogs: any[];
  documentsQueue: DocumentRecord[];
}

export function useDashboardData() {
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState<DashboardData>({
    organizations: [],
    usersList: [],
    consultants: [],
    operationalLogs: [],
    documentsQueue: [],
  });

  const fetchDashboardData = useCallback(async () => {
    setLoading(true);
    try {
      const updates: Partial<DashboardData> = {};

      if (['SUPER_ADMIN', 'ADMIN', 'ANALYST', 'CONSULTANT'].includes(user?.role || '')) {
        const orgRes = await fetch(getApiUrl('/api/admin/organizations'));
        const userRes = await fetch(getApiUrl('/api/admin/users'));
        if (orgRes.ok) updates.organizations = await orgRes.json();
        if (userRes.ok) updates.usersList = await userRes.json();

        if (user?.role === 'SUPER_ADMIN') {
          const consRes = await fetch(getApiUrl('/api/admin/consultants'));
          if (consRes.ok) updates.consultants = await consRes.json();
        }
      }

      if (user?.organizationId) {
        const opRes = await fetch(getApiUrl(`/api/operations/list/${user.organizationId}`));
        const docRes = await fetch(getApiUrl(`/api/documents/list/${user.organizationId}`));
        if (opRes.ok) updates.operationalLogs = await opRes.json();
        if (docRes.ok) updates.documentsQueue = await docRes.json();
      }

      setData((prev) => ({ ...prev, ...updates }));
    } catch (e) {
      console.error('Error fetching dashboard info', e);
    } finally {
      setLoading(false);
    }
  }, [user]);

  return { ...data, loading, fetchDashboardData, setData };
}
