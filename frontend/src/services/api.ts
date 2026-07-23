// Client-side API Service Layer with intelligent Offline Fallback and Sync support
import type { Transaction, ERPData, HRMember, MachineryItem, InsumoItem, ProductionCycle, DailyProduction, Partner, AssetLiability } from "../types";

const STORAGE_KEY = "olo_erp_database";
const PENDING_SYNC_KEY = "olo_erp_pending_sync";

// Helper to load from LocalStorage fallback
function loadLocalERP(): ERPData | null {
  const local = localStorage.getItem(STORAGE_KEY);
  if (local) {
    try {
      return JSON.parse(local);
    } catch (e) {
      console.error("Failed to parse local ERP data", e);
    }
  }
  return null;
}

// Helper to save to LocalStorage fallback
function saveLocalERP(data: ERPData) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
}

// Core API Service
export const APIService = {
  // Fetch full ERP database
  async getERPData(): Promise<ERPData> {
    try {
      const response = await fetch("/api/erp");
      if (!response.ok) {
        throw new Error("Erro ao obter dados do servidor.");
      }
      const resData = await response.json();
      if (resData.success && resData.data) {
        saveLocalERP(resData.data);
        return resData.data;
      }
      throw new Error(resData.message || "Erro desconhecido");
    } catch (error) {
      console.warn("Ambiente offline ou erro de servidor. Usando dados locais:", error);
      const cached = loadLocalERP();
      if (cached) return cached;
      
      // If absolutely no local storage yet, return empty database structure
      return {
        humanResources: [],
        machinery: [],
        insumos: [],
        cycles: [],
        production: [],
        partners: [],
        assetsLiabilities: [],
        transactions: []
      };
    }
  },

  // Save full ERP database
  async saveERPData(data: ERPData): Promise<boolean> {
    // Save to local state first for instant UX feedback
    saveLocalERP(data);

    try {
      const response = await fetch("/api/erp/save", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (response.ok) {
        // Clear any pending sync as we successfully reached the backend
        localStorage.removeItem(PENDING_SYNC_KEY);
        return true;
      }
      throw new Error("Resposta de erro do servidor");
    } catch (error) {
      console.warn("Salvando em offline. Modificação gravada localmente para posterior sincronização.", error);
      // Mark as pending synchronization
      localStorage.setItem(PENDING_SYNC_KEY, "true");
      
      // Dispatch custom offline event for UI indicators
      window.dispatchEvent(new CustomEvent("olo-offline-saved"));
      return false;
    }
  },

  // Check if there's any data pending sync
  hasPendingSync(): boolean {
    return localStorage.getItem(PENDING_SYNC_KEY) === "true";
  },

  // Try to sync pending modifications with server
  async syncPendingData(): Promise<boolean> {
    if (!this.hasPendingSync()) return true;

    const localData = loadLocalERP();
    if (!localData) return true;

    try {
      const response = await fetch("/api/erp/save", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(localData),
      });

      if (response.ok) {
        localStorage.removeItem(PENDING_SYNC_KEY);
        window.dispatchEvent(new CustomEvent("olo-online-synced"));
        return true;
      }
      return false;
    } catch (error) {
      return false;
    }
  }
};

// Set up automatic network status listeners to sync pending ERP changes
if (typeof window !== "undefined") {
  window.addEventListener("online", () => {
    console.log("Conectividade restabelecida. Sincronizando dados pendentes do ERP...");
    APIService.syncPendingData();
  });
}
