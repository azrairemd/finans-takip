using System;
using System.Collections.Generic;

namespace FinansTakip.Infrastructure.ExternalServices
{
    public class BinanceSettings
    {
        public string RestBaseUrl { get; set; } = "https://api.binance.com";
        public string WebSocketBaseUrl { get; set; } = "wss://stream.binance.com:9443";

        public List<string> DefaultSymbols { get; set; } = new()
        {
            "btcusdt", "ethusdt", "bnbusdt", "solusdt", "xrpusdt"
        };

    }
}