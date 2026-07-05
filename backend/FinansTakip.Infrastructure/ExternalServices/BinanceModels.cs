using System.Text.Json.Serialization;

namespace FinansTakip.Infrastructure.ExternalServices
{
    internal class BinanceRestTicker
    {
        [JsonPropertyName("symbol")]
        public string Symbol { get; set; } = string.Empty;

        [JsonPropertyName("lastPrice")]
        public string LastPrice { get; set; } = "0";

        [JsonPropertyName("priceChangePercent")]
        public string PriceChangePercent { get; set; } = "0";

        [JsonPropertyName("highPrice")]
        public string HighPrice { get; set; } = "0";

        [JsonPropertyName("lowPrice")]
        public string LowPrice { get; set; } = "0";

        [JsonPropertyName("volume")]
        public string Volume { get; set; } = "0";
    }

    internal class BinanceStreamEnvelope
    {
        [JsonPropertyName("stream")]
        public string Stream { get; set; } = string.Empty;

        [JsonPropertyName("data")]
        public BinanceWsTickerData? Data { get; set; }
    }

    internal class BinanceWsTickerData
    {
        [JsonPropertyName("s")]
        public string Symbol { get; set; } = string.Empty;   

        [JsonPropertyName("c")]
        public string LastPrice { get; set; } = "0";    

        [JsonPropertyName("P")]
        public string PriceChangePercent { get; set; } = "0";

        [JsonPropertyName("h")]
        public string HighPrice { get; set; } = "0";

        [JsonPropertyName("l")]
        public string LowPrice { get; set; } = "0";

        [JsonPropertyName("v")]
        public string Volume { get; set; } = "0";
    }
}