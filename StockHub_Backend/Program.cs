using Microsoft.EntityFrameworkCore;
using StockHub_Backend.Data;
using StockHub_Backend.Interfaces;
using StockHub_Backend.Repository;
using StackExchange.Redis;
using StockHub_Backend.Services;
using StockHub_Backend.Services.Kafka;
using StockHub_Backend.Models;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.IdentityModel.Tokens;
using StockHub_Backend.Services.TokenServices;
using Microsoft.OpenApi.Models;
using StockHub_Backend.Services.EmailServices;
using Microsoft.AspNetCore.DataProtection;
using StockHub_Backend.Repositories;
using StockHub_Backend.Services.redis;
using StockHub_Backend.Services.YahooFinanceApiService;
using StockHub_Backend.Services.Kafka.YahooStockData;
using System.Threading.RateLimiting;
using Microsoft.AspNetCore.RateLimiting;

var builder = WebApplication.CreateBuilder(args);

// =============================================================================
// CONFIGURATION SETUP
// =============================================================================

// Configure logging early in the pipeline
builder.Logging.ClearProviders();
builder.Logging.AddConsole();
builder.Logging.AddDebug();

// =============================================================================
// DATABASE CONFIGURATION
// =============================================================================

// Configure Entity Framework with SQL Server
builder.Services.AddDbContext<ApplicationDBContext>(options =>
{
    options.UseSqlServer(builder.Configuration.GetConnectionString("DefaultConnection"));
});

// =============================================================================
// IDENTITY AND AUTHENTICATION CONFIGURATION
// =============================================================================

// Configure ASP.NET Core Identity with custom password requirements
builder.Services.AddIdentity<AppUser, IdentityRole>(options =>
{
    // Password requirements
    options.Password.RequireDigit = true;
    options.Password.RequireLowercase = true;
    options.Password.RequireUppercase = true;
    options.Password.RequireNonAlphanumeric = true;
    options.Password.RequiredLength = 12;
    options.User.RequireUniqueEmail = true;
    options.SignIn.RequireConfirmedEmail = false;
})
.AddEntityFrameworkStores<ApplicationDBContext>()
.AddDefaultTokenProviders();

// Configure data protection for token generation
builder.Services.AddDataProtection()
    .SetApplicationName("StockHub")
    .PersistKeysToFileSystem(new DirectoryInfo(@"C:\Keys"));

// Set token lifespan to 24 hours
builder.Services.Configure<DataProtectionTokenProviderOptions>(opt =>
    opt.TokenLifespan = TimeSpan.FromHours(24));

// Configure JWT Authentication
builder.Services.AddAuthentication(options =>
{
    // Set JWT Bearer as default authentication scheme
    options.DefaultAuthenticateScheme =
    options.DefaultChallengeScheme =
    options.DefaultForbidScheme =
    options.DefaultScheme =
    options.DefaultSignInScheme =
    options.DefaultSignOutScheme = JwtBearerDefaults.AuthenticationScheme;
})
.AddJwtBearer(options =>
{
    // JWT token validation parameters
    options.TokenValidationParameters = new TokenValidationParameters
    {
        ValidateIssuer = true,
        ValidIssuer = builder.Configuration["JWT:Issuer"],
        ValidateAudience = true,
        ValidAudience = builder.Configuration["JWT:Audience"],
        ValidateIssuerSigningKey = true,
        IssuerSigningKey = new SymmetricSecurityKey(
            System.Text.Encoding.UTF8.GetBytes(builder.Configuration["JWT:SigningKey"]!)
        )
    };
});

// =============================================================================
// REDIS CACHE CONFIGURATION
// =============================================================================

// Configure Redis connection multiplexer for caching
builder.Services.AddSingleton<IConnectionMultiplexer>(sp =>
    ConnectionMultiplexer.Connect(builder.Configuration["Redis:ConnectionString"]!)
);

// Configure Stack Exchange Redis Cache
builder.Services.AddStackExchangeRedisCache(options =>
{
    options.Configuration = builder.Configuration["Redis:ConnectionString"];
    options.InstanceName = builder.Configuration["Redis:InstanceName"];
});

// =============================================================================
// EXTERNAL API CONFIGURATION
// =============================================================================

// Configure HTTP client for Yahoo Finance API with headers and timeout
builder.Services.AddHttpClient<IYahooFinanceApiService, YahooFinanceApiService>();
// =============================================================================
// EMAIL SERVICE CONFIGURATION
// =============================================================================

// Configure email settings from appsettings.json
builder.Services.Configure<EmailSettings>(builder.Configuration.GetSection("EmailSettings"));

// =============================================================================
// DEPENDENCY INJECTION - REPOSITORIES
// =============================================================================

// Register scoped repositories (per-request lifecycle)
builder.Services.AddScoped<IStockRepository, StockRepository>();
builder.Services.AddScoped<IPortfolioRepository, PortfolioRepository>();
builder.Services.AddScoped<ICommentRepository, CommentRepository>();
builder.Services.AddScoped<IStockDataService, StockDataServiceRepository>();
builder.Services.AddScoped<IStockPriceHub, StockPriceHubRepository>();

// =============================================================================
// DEPENDENCY INJECTION - SERVICES
// =============================================================================

// Register scoped services (per-request lifecycle)
builder.Services.AddScoped<ITokenService, TokenService>();
builder.Services.AddScoped<IYahooFinanceApiService, YahooFinanceApiService>();
builder.Services.AddScoped<IEmailService, EmailService>();

// Register singleton services (application-wide single instance)
builder.Services.AddSingleton<IKafkaProducer, KafkaProducer>();
builder.Services.AddSingleton<IKafkaProducerService, KafkaProducerService>();
builder.Services.AddSingleton<IEventPublisher, KafkaEventPublisher>();
builder.Services.AddSingleton<IPortfolioCacheService, RedisCacheService>();
builder.Services.AddSingleton<IStockDataCacheService, CacheService>();

// =============================================================================
// BACKGROUND SERVICES
// =============================================================================

// Register Kafka consumer as a background service
builder.Services.AddHostedService<KafkaConsumerService>();

// =============================================================================
// SIGNALR CONFIGURATION
// =============================================================================

// Configure SignalR for real-time WebSocket communication
builder.Services.AddSignalR(options =>
{
    options.EnableDetailedErrors = true;
    options.ClientTimeoutInterval = TimeSpan.FromSeconds(60);
    options.HandshakeTimeout = TimeSpan.FromSeconds(15);
});

// =============================================================================
// RATE LIMITING CONFIGURATION
// =============================================================================

// Configure rate limiting policies
builder.Services.AddRateLimiter(options =>
{
    options.RejectionStatusCode = StatusCodes.Status429TooManyRequests;

    // API rate limiting: 100 requests per minute
    options.AddFixedWindowLimiter("StockApiPolicy", policyOptions =>
    {
        policyOptions.AutoReplenishment = true;
        policyOptions.PermitLimit = 100;
        policyOptions.Window = TimeSpan.FromMinutes(1);
        policyOptions.QueueProcessingOrder = QueueProcessingOrder.OldestFirst;
        policyOptions.QueueLimit = 10;
    });

    // WebSocket connection limiting: 50 concurrent connections
    options.AddConcurrencyLimiter("WebSocketPolicy", policyOptions =>
    {
        policyOptions.PermitLimit = 50;
        policyOptions.QueueProcessingOrder = QueueProcessingOrder.OldestFirst;
        policyOptions.QueueLimit = 20;
    });
});

// =============================================================================
// HEALTH CHECKS CONFIGURATION
// =============================================================================

// Configure health checks for monitoring application status
builder.Services.AddHealthChecks()
    .AddCheck("redis", () =>
    {
        try
        {
            var redis = builder.Services.BuildServiceProvider().GetRequiredService<IConnectionMultiplexer>();
            return redis.IsConnected ?
                Microsoft.Extensions.Diagnostics.HealthChecks.HealthCheckResult.Healthy() :
                Microsoft.Extensions.Diagnostics.HealthChecks.HealthCheckResult.Unhealthy();
        }
        catch
        {
            return Microsoft.Extensions.Diagnostics.HealthChecks.HealthCheckResult.Unhealthy();
        }
    });

// =============================================================================
// SWAGGER/API DOCUMENTATION CONFIGURATION
// =============================================================================

// Configure API documentation with Swagger
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen(option =>
{
    option.SwaggerDoc("v1", new OpenApiInfo { Title = "StockHub API", Version = "v1" });

    // Configure JWT Bearer authorization in Swagger UI
    option.AddSecurityDefinition("Bearer", new OpenApiSecurityScheme
    {
        In = ParameterLocation.Header,
        Description = "Please enter a valid JWT token",
        Name = "Authorization",
        Type = SecuritySchemeType.Http,
        BearerFormat = "JWT",
        Scheme = "Bearer"
    });

    option.AddSecurityRequirement(new OpenApiSecurityRequirement
    {
        {
            new OpenApiSecurityScheme
            {
                Reference = new OpenApiReference
                {
                    Type = ReferenceType.SecurityScheme,
                    Id = "Bearer"
                }
            },
            new string[]{}
        }
    });
});

// =============================================================================
// CONTROLLERS CONFIGURATION
// =============================================================================

// Configure controllers with JSON serialization settings
builder.Services
    .AddControllers()
    .AddNewtonsoftJson(options =>
        options.SerializerSettings.ReferenceLoopHandling = Newtonsoft.Json.ReferenceLoopHandling.Ignore
    );

// =============================================================================
// CORS CONFIGURATION
// =============================================================================

// Configure Cross-Origin Resource Sharing for frontend communication
builder.Services.AddCors(options =>
{
    options.AddPolicy("CorsPolicy", policy =>
    {
        policy.AllowAnyHeader()
            .AllowAnyMethod()
            .WithOrigins("http://localhost:3000") // Frontend URL
            .AllowCredentials(); // Required for SignalR
    });
});

// =============================================================================
// APPLICATION PIPELINE CONFIGURATION
// =============================================================================

var app = builder.Build();

// Configure Swagger UI for development environment only
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI(c =>
    {
        c.SwaggerEndpoint("/swagger/v1/swagger.json", "StockHub API V1");
    });
}

// Global exception handling middleware
app.UseExceptionHandler(errorApp =>
{
    errorApp.Run(async context =>
    {
        context.Response.StatusCode = 500;
        context.Response.ContentType = "application/json";

        var error = context.Features.Get<Microsoft.AspNetCore.Diagnostics.IExceptionHandlerFeature>();
        if (error != null)
        {
            var logger = context.RequestServices.GetRequiredService<ILogger<Program>>();
            logger.LogError(error.Error, "Unhandled exception occurred");

            await context.Response.WriteAsync(System.Text.Json.JsonSerializer.Serialize(new
            {
                error = "An internal server error occurred",
                timestamp = DateTime.UtcNow
            }));
        }
    });
});

// Configure middleware pipeline in correct order
app.UseRateLimiter();           // Rate limiting must come early
app.UseHttpsRedirection();      // Force HTTPS
app.UseCors("CorsPolicy");      // CORS before authentication
app.UseAuthentication();        // Authentication before authorization
app.UseAuthorization();         // Authorization

// Map API controllers
app.MapControllers();

// Map SignalR hub with rate limiting
app.MapHub<StockPriceHub>("/stockhub")
    .RequireRateLimiting("WebSocketPolicy");

// Map health check endpoint for monitoring
app.MapHealthChecks("/health");

// Map WebSocket connection statistics endpoint (if GetConnectionStats method exists)
app.MapGet("/ws-stats", () => StockPriceHubRepository.GetConnectionStats());

// =============================================================================
// DEVELOPMENT-ONLY ENDPOINTS
// =============================================================================

// Test endpoint for stock data retrieval (development only)
if (app.Environment.IsDevelopment())
{
    app.MapGet("/test-stock/{symbol}", async (string symbol, IStockDataService stockService) =>
    {
        try
        {
            var quote = await stockService.GetStockQuoteAsync(symbol);
            return Results.Ok(quote);
        }
        catch (Exception ex)
        {
            return Results.BadRequest(new { error = ex.Message });
        }
    });
}

// =============================================================================
// APPLICATION STARTUP LOGGING AND VALIDATION
// =============================================================================

var logger = app.Services.GetRequiredService<ILogger<Program>>();
logger.LogInformation("StockHub API starting up...");

// Test Redis connection on startup
try
{
    var redis = app.Services.GetRequiredService<IConnectionMultiplexer>();
    if (redis.IsConnected)
    {
        logger.LogInformation("Redis connection established successfully");
    }
    else
    {
        logger.LogWarning("Redis connection failed - caching will be unavailable");
    }
}
catch (Exception ex)
{
    logger.LogError(ex, "Failed to connect to Redis");
}

logger.LogInformation("StockHub API started successfully on {Environment}", app.Environment.EnvironmentName);

// Start the application
app.Run();