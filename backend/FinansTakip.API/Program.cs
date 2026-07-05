using FinansTakip.Application.Interfaces;
using FinansTakip.Application.Services;
using FinansTakip.Infrastructure.BackgroundServices;
using FinansTakip.Infrastructure.Caching;
using FinansTakip.Infrastructure.ExternalServices;
using FinansTakip.Infrastructure.Persistence;
using FinansTakip.Infrastructure.Persistence.Repositories;
using FinansTakip.API.Hubs;
using Microsoft.EntityFrameworkCore;

var builder = WebApplication.CreateBuilder(args);

builder.Services.Configure<BinanceSettings>(builder.Configuration.GetSection("Binance"));

builder.Services.AddDbContext<AppDbContext>(options =>
    options.UseSqlite(builder.Configuration.GetConnectionString("DefaultConnection")));

builder.Services.AddScoped<IUserRepository, UserRepository>();
builder.Services.AddScoped<IWatchlistRepository, WatchlistRepository>();

builder.Services.AddSingleton<IMarketDataCache, MemoryMarketDataCache>();

builder.Services.AddSignalR();
builder.Services.AddSingleton<IPriceUpdateNotifier, SignalRPriceNotifier>();

builder.Services.AddHttpClient<IBinanceService, BinanceService>();

builder.Services.AddHostedService<BinanceStreamHostedService>();

builder.Services.AddScoped<AuthService>();

builder.Services.AddCors(options =>
{
    options.AddPolicy("Frontend", policy =>
    {
        policy.WithOrigins(
                "http://localhost:5173",
                "http://localhost:5174",
                "https://localhost:5256")
              .AllowAnyHeader()
              .AllowAnyMethod()
              .AllowCredentials();
    });
});

builder.Services.AddControllers();
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

var app = builder.Build();

if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

if (!app.Environment.IsDevelopment())
{
    app.UseHttpsRedirection();
}

app.UseCors("Frontend");
app.UseAuthorization();

app.MapControllers();
app.MapHub<MarketDataHub>("/hubs/market");

app.Run();