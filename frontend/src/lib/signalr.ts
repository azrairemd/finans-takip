import * as signalR from "@microsoft/signalr";
import { API_BASE_URL } from "./api";
import type { PriceDto } from "@/types/market";

let connection: signalR.HubConnection | null = null;

export function getMarketHubConnection(): signalR.HubConnection {
  if (connection) return connection;

  connection = new signalR.HubConnectionBuilder()
    .withUrl(`${API_BASE_URL}/hubs/market`, {
      withCredentials: true,
    })
    .withAutomaticReconnect()
    .configureLogging(signalR.LogLevel.Warning)
    .build();

  return connection;
}

export async function startMarketHub(
  onPriceUpdated: (price: PriceDto) => void
): Promise<() => void> {
  const conn = getMarketHubConnection();

  conn.on("PriceUpdated", onPriceUpdated);

  if (conn.state === signalR.HubConnectionState.Disconnected) {
    try {
      await conn.start();
    } catch (err) {
      console.warn("SignalR bağlantısı kurulamadı, demo veriyle devam ediliyor.", err);
    }
  }

  return () => {
    conn.off("PriceUpdated", onPriceUpdated);
  };
}
