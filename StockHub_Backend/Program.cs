// using Microsoft.EntityFrameworkCore;
// using StockHub_Backend.Data;
// using StockHub_Backend.Interfaces;
// using StockHub_Backend.Repository;
// using StackExchange.Redis;
// using StockHub_Backend.Services;
// using StockHub_Backend.Services.Kafka;
// using StockHub_Backend.Models;
// using Microsoft.AspNetCore.Identity;
// using Microsoft.AspNetCore.Authentication.JwtBearer;
// using Microsoft.IdentityModel.Tokens;
// using StockHub_Backend.Services.TokenServices;
// using Microsoft.OpenApi.Models;
// using StockHub_Backend.Services.EmailServices;
// using Microsoft.AspNetCore.DataProtection;
// using StockHub_Backend.Repositories;
// using StockHub_Backend.Services.redis;
// using StockHub_Backend.Services.YahooFinanceApiService;
// using StockHub_Backend.Services.Kafka.YahooStockData;
// using System.Threading.RateLimiting;
// using Microsoft.AspNetCore.RateLimiting;
// using StockHub_Backend.Services.Kafka.PortfolioKafka;
// using StockHub_Backend.Services.PortfolioStockPriceUpdateService;
// using StockHub_Backend.Services.BackgroundTask;
// using StockHub_Backend.Services.Alert;
// using StockHub_Backend.Services.Kafka.Alert;
// using StockHub_Backend.Services.HubSignalR;
// using StockHub_Backend.Services.AlertServices;
// using StockHub_Backend.Services.Alert.AlertServices;
// using DotNetEnv;

// var builder = WebApplication.CreateBuilder(args);

// // ENVIRONMENT VARIABLES CONFIGURATION Load .env file (only in development)
// if (builder.Environment.IsDevelopment())
// {
//     // Load .env file from the project root
//     var envPath = Path.Combine(Directory.GetCurrentDirectory(), ".env");
//     if (File.Exists(envPath))
//     {
//         DotNetEnv.Env.Load(envPath);
//     }
// }

// // Configure logging early in the pipeline
// builder.Logging.ClearProviders();
// builder.Logging.AddConsole();
// builder.Logging.AddDebug();

// // DATABASE CONFIGURATION - Configure Entity Framework with SQL Server
// builder.Services.AddDbContext<ApplicationDBContext>(options =>
// {
//     var connectionString = builder.Configuration.GetConnectionString("DefaultConnection");
//     if (string.IsNullOrEmpty(connectionString))
//     {
//         throw new InvalidOperationException("Database connection string 'DefaultConnection' not found.");
//     }
//     options.UseSqlServer(connectionString);
// });

// // IDENTITY AND AUTHENTICATION CONFIGURATION - Configure ASP.NET Core Identity with custom password requirements
// builder.Services.AddIdentity<AppUser, IdentityRole>(options =>
// {
//     // Password requirements
//     options.Password.RequireDigit = true;
//     options.Password.RequireLowercase = true;
//     options.Password.RequireUppercase = true;
//     options.Password.RequireNonAlphanumeric = true;
//     options.Password.RequiredLength = 12;
//     options.User.RequireUniqueEmail = true;
//     options.SignIn.RequireConfirmedEmail = false;
// })
// .AddEntityFrameworkStores<ApplicationDBContext>()
// .AddDefaultTokenProviders();

// // Configure data protection for token generation
// builder.Services.AddDataProtection()
//     .SetApplicationName("StockHub")
//     .PersistKeysToFileSystem(new DirectoryInfo(@"C:\Keys"));

// // Set token lifespan to 24 hours
// builder.Services.Configure<DataProtectionTokenProviderOptions>(opt =>
//     opt.TokenLifespan = TimeSpan.FromHours(24));

// // Configure JWT Authentication
// builder.Services.AddAuthentication(options =>
// {
//     // Set JWT Bearer as default authentication scheme
//     options.DefaultAuthenticateScheme =
//     options.DefaultChallengeScheme =
//     options.DefaultForbidScheme =
//     options.DefaultScheme =
//     options.DefaultSignInScheme =
//     options.DefaultSignOutScheme = JwtBearerDefaults.AuthenticationScheme;
// })
// .AddJwtBearer(options =>
// {
//     // JWT token validation parameters
//     var jwtIssuer = builder.Configuration["JWT:Issuer"];
//     var jwtAudience = builder.Configuration["JWT:Audience"];
//     var jwtSigningKey = builder.Configuration["JWT:SigningKey"];
    
//     if (string.IsNullOrEmpty(jwtSigningKey))
//     {
//         throw new InvalidOperationException("JWT SigningKey not found in configuration.");
//     }
    
//     options.TokenValidationParameters = new TokenValidationParameters
//     {
//         ValidateIssuer = true,
//         ValidIssuer = jwtIssuer,
//         ValidateAudience = true,
//         ValidAudience = jwtAudience,
//         ValidateIssuerSigningKey = true,
//         IssuerSigningKey = new SymmetricSecurityKey(
//             System.Text.Encoding.UTF8.GetBytes(jwtSigningKey)
//         )
//     };
// });

// //REDIS CACHE CONFIGURATION - Configure Redis connection multiplexer for caching
// builder.Services.AddSingleton<IConnectionMultiplexer>(sp =>
// {
//     var redisConnectionString = builder.Configuration["Redis:ConnectionString"];
//     if (string.IsNullOrEmpty(redisConnectionString))
//     {
//         throw new InvalidOperationException("Redis connection string not found in configuration.");
//     }
//     return ConnectionMultiplexer.Connect(redisConnectionString);
// });

// // Configure Stack Exchange Redis Cache
// builder.Services.AddStackExchangeRedisCache(options =>
// {
//     options.Configuration = builder.Configuration["Redis:ConnectionString"];
//     options.InstanceName = builder.Configuration["Redis:InstanceName"];
// });

// // EXTERNAL API CONFIGURATION - Configure HTTP client for Yahoo Finance API with headers and timeout
// builder.Services.AddHttpClient<IYahooFinanceApiService, YahooFinanceApiService>();

// // EMAIL SERVICE CONFIGURATION - Configure email settings from configuration
// builder.Services.Configure<EmailSettings>(builder.Configuration.GetSection("EmailSettings"));

// // =============================================================================
// // DEPENDENCY INJECTION - REPOSITORIES
// // =============================================================================

// // Register scoped repositories (per-request lifecycle)
// builder.Services.AddScoped<IStockRepository, StockRepository>();
// builder.Services.AddScoped<IPortfolioRepository, PortfolioRepository>();
// builder.Services.AddScoped<ICommentRepository, CommentRepository>();
// builder.Services.AddScoped<IStockDataService, StockDataServiceRepository>();
// builder.Services.AddScoped<IStockPriceHub, StockPriceHubRepository>();
// builder.Services.AddScoped<IAlertRepository, AlertRepository>();

// // =============================================================================
// // DEPENDENCY INJECTION - SERVICES
// // =============================================================================

// // Register scoped services (per-request lifecycle)
// builder.Services.AddScoped<ITokenService, TokenService>();
// builder.Services.AddScoped<IYahooFinanceApiService, YahooFinanceApiService>();
// builder.Services.AddScoped<IEmailService, EmailService>();
// builder.Services.AddScoped<IAlertService, AlertService>();
// builder.Services.AddScoped<IPricePollingService, PricePollingService>();
// builder.Services.AddScoped<INotificationService, NotificationService>();

// // Register singleton services (application-wide single instance)
// builder.Services.AddSingleton<IKafkaProducer, KafkaProducer>();
// builder.Services.AddSingleton<IKafkaProducerService, KafkaProducerService>();
// builder.Services.AddSingleton<IEventPublisher, KafkaEventPublisher>();
// builder.Services.AddSingleton<IPortfolioCacheService, RedisCacheService>();
// builder.Services.AddSingleton<IStockDataCacheService, CacheService>();
// builder.Services.AddScoped<IPortfolioStockPriceUpdateService, PortfolioStockPriceUpdateService>();
// builder.Services.AddSingleton<IKafkaAlertProducer, KafkaAlertProducer>();
// builder.Services.AddScoped<IKafkaAlertConsumer, KafkaAlertConsumer>();

// // Register HttpClient for price polling
// builder.Services.AddScoped<IPricePollingService, PricePollingService>();

// // BACKGROUND SERVICES- register background service
// builder.Services.AddHostedService<KafkaConsumerService>();
// builder.Services.AddHostedService<PortfolioStockPriceBackgroundService>();
// builder.Services.AddHostedService<AlertPricePollingBackgroundService>();
// builder.Services.AddHostedService<KafkaConsumerBackgroundService>();

// // SIGNALR CONFIGURATION - Configure SignalR for real-time WebSocket communication
// builder.Services.AddSignalR(options =>
// {
//     options.EnableDetailedErrors = true;
//     options.ClientTimeoutInterval = TimeSpan.FromSeconds(60);
//     options.HandshakeTimeout = TimeSpan.FromSeconds(15);
// });

// // RATE LIMITING CONFIGURATION - Configure rate limiting policies
// builder.Services.AddRateLimiter(options =>
// {
//     options.RejectionStatusCode = StatusCodes.Status429TooManyRequests;

//     // API rate limiting: 100 requests per minute
//     options.AddFixedWindowLimiter("StockApiPolicy", policyOptions =>
//     {
//         policyOptions.AutoReplenishment = true;
//         policyOptions.PermitLimit = 100;
//         policyOptions.Window = TimeSpan.FromMinutes(1);
//         policyOptions.QueueProcessingOrder = QueueProcessingOrder.OldestFirst;
//         policyOptions.QueueLimit = 10;
//     });

//     // WebSocket connection limiting: 50 concurrent connections
//     options.AddConcurrencyLimiter("WebSocketPolicy", policyOptions =>
//     {
//         policyOptions.PermitLimit = 50;
//         policyOptions.QueueProcessingOrder = QueueProcessingOrder.OldestFirst;
//         policyOptions.QueueLimit = 20;
//     });
// });

// // SWAGGER/API DOCUMENTATION CONFIGURATION - Configure API documentation with Swagger
// builder.Services.AddEndpointsApiExplorer();
// builder.Services.AddSwaggerGen(option =>
// {
//     option.SwaggerDoc("v1", new OpenApiInfo { Title = "StockHub API", Version = "v1" });

//     // Configure JWT Bearer authorization in Swagger UI
//     option.AddSecurityDefinition("Bearer", new OpenApiSecurityScheme
//     {
//         In = ParameterLocation.Header,
//         Description = "Please enter a valid JWT token",
//         Name = "Authorization",
//         Type = SecuritySchemeType.Http,
//         BearerFormat = "JWT",
//         Scheme = "Bearer"
//     });

//     option.AddSecurityRequirement(new OpenApiSecurityRequirement
//     {
//         {
//             new OpenApiSecurityScheme
//             {
//                 Reference = new OpenApiReference
//                 {
//                     Type = ReferenceType.SecurityScheme,
//                     Id = "Bearer"
//                 }
//             },
//             new string[]{}
//         }
//     });
// });

// // CONTROLLERS CONFIGURATION - Configure controllers with JSON serialization settings
// builder.Services
//     .AddControllers()
//     .AddNewtonsoftJson(options =>
//         options.SerializerSettings.ReferenceLoopHandling = Newtonsoft.Json.ReferenceLoopHandling.Ignore
//     );

// // CORS CONFIGURATION -Configure Cross-Origin Resource Sharing for frontend communication
// builder.Services.AddCors(options =>
// {
//     options.AddPolicy("CorsPolicy", policy =>
//     {
//         policy.AllowAnyHeader()
//             .AllowAnyMethod()
//             .WithOrigins("http://localhost:5173", "http://172.20.10.2:5173") // Frontend URL
//             .AllowCredentials(); // Required for SignalR
//     });
// });

// // =============================================================================
// // APPLICATION PIPELINE CONFIGURATION
// // =============================================================================

// var app = builder.Build();

// // Configure Swagger UI for development environment only
// if (app.Environment.IsDevelopment())
// {
//     app.UseSwagger();
//     app.UseSwaggerUI(c =>
//     {
//         c.SwaggerEndpoint("/swagger/v1/swagger.json", "StockHub API V1");
//     });
// }

// if (app.Environment.IsDevelopment())
// {
//     app.UseDeveloperExceptionPage();
//     app.UseExceptionHandler("/error-development");
// }
// else
// {
//     app.UseExceptionHandler("/error");
// }

// // Global exception handling middleware
// app.UseExceptionHandler(errorApp =>
// {
//     errorApp.Run(async context =>
//     {
//         context.Response.StatusCode = 500;
//         context.Response.ContentType = "application/json";

//         var error = context.Features.Get<Microsoft.AspNetCore.Diagnostics.IExceptionHandlerFeature>();
//         if (error != null)
//         {
//             var logger = context.RequestServices.GetRequiredService<ILogger<Program>>();

//             // Log the full exception with inner exceptions
//             logger.LogError(error.Error, "Unhandled exception occurred: {Message}", error.Error.Message);

//             // Build a detailed error response
//             var response = new
//             {
//                 error = "An internal server error occurred",
//                 message = error.Error.Message,
//                 innerMessage = error.Error.InnerException?.Message,
//                 innerStackTrace = error.Error.InnerException?.StackTrace,
//                 timestamp = DateTime.UtcNow
//             };

//             await context.Response.WriteAsync(System.Text.Json.JsonSerializer.Serialize(response));
//         }
//     });
// });

// // Configure middleware pipeline in correct order
// app.UseRateLimiter();           // Rate limiting must come early
// // app.UseHttpsRedirection();      // Force HTTPS
// app.UseCors("CorsPolicy");      // CORS before authentication
// app.UseAuthentication();        // Authentication before authorization
// app.UseAuthorization();         // Authorization

// // Map API controllers
// app.MapControllers();

// // Map SignalR hub with rate limiting
// app.MapHub<StockPriceHub>("/stockhub")
//     .RequireRateLimiting("WebSocketPolicy");
// app.MapHub<AlertsHub>("/alertsHub");

// // Map WebSocket connection statistics endpoint (if GetConnectionStats method exists)
// app.MapGet("/ws-stats", () => StockPriceHubRepository.GetConnectionStats());

// // =============================================================================
// // DEVELOPMENT-ONLY ENDPOINTS
// // =============================================================================

// // Test endpoint for stock data retrieval (development only)
// if (app.Environment.IsDevelopment())
// {
//     app.MapGet("/test-stock/{symbol}", async (string symbol, IStockDataService stockService) =>
//     {
//         try
//         {
//             var quote = await stockService.GetStockQuoteAsync(symbol);
//             return Results.Ok(quote);
//         }
//         catch (Exception ex)
//         {
//             return Results.BadRequest(new { error = ex.Message });
//         }
//     });
// }

// // =============================================================================
// // APPLICATION STARTUP LOGGING AND VALIDATION
// // =============================================================================

// var logger = app.Services.GetRequiredService<ILogger<Program>>();
// logger.LogInformation("StockHub API starting up...");

// // Test Redis connection on startup
// try
// {
//     var redis = app.Services.GetRequiredService<IConnectionMultiplexer>();
//     if (redis.IsConnected)
//     {
//         logger.LogInformation("Redis connection established successfully");
//     }
//     else
//     {
//         logger.LogWarning("Redis connection failed - caching will be unavailable");
//     }
// }
// catch (Exception ex)
// {
//     logger.LogError(ex, "Failed to connect to Redis");
// }

// logger.LogInformation("StockHub API started successfully on {Environment}", app.Environment.EnvironmentName);

// // Start the application
// app.Run();
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
using StockHub_Backend.Services.Kafka.PortfolioKafka;
using StockHub_Backend.Services.PortfolioStockPriceUpdateService;
using StockHub_Backend.Services.BackgroundTask;
using StockHub_Backend.Services.Alert;
using StockHub_Backend.Services.Kafka.Alert;
using StockHub_Backend.Services.HubSignalR;
using StockHub_Backend.Services.AlertServices;
using StockHub_Backend.Services.Alert.AlertServices;
using DotNetEnv;

var builder = WebApplication.CreateBuilder(args);

// =============================================================================
// ENVIRONMENT VARIABLES CONFIGURATION
// =============================================================================

// Load .env file (only in development)
if (builder.Environment.IsDevelopment())
{
    var envPath = Path.Combine(Directory.GetCurrentDirectory(), ".env");
    if (File.Exists(envPath))
    {
        DotNetEnv.Env.Load(envPath);
    }
}

// Add environment variables to configuration
// This automatically maps double underscore (__) to colon (:) hierarchical keys
// e.g., JWT__SigningKey becomes JWT:SigningKey in configuration
builder.Configuration.AddEnvironmentVariables();

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
    var connectionString = builder.Configuration.GetConnectionString("DefaultConnection");
    if (string.IsNullOrEmpty(connectionString))
    {
        throw new InvalidOperationException("Database connection string 'DefaultConnection' not found.");
    }
    options.UseSqlServer(connectionString);
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
    var jwtIssuer = builder.Configuration["JWT:Issuer"];
    var jwtAudience = builder.Configuration["JWT:Audience"];
    var jwtSigningKey = builder.Configuration["JWT:SigningKey"];
    
    if (string.IsNullOrEmpty(jwtSigningKey))
    {
        throw new InvalidOperationException("JWT SigningKey not found in configuration.");
    }
    
    options.TokenValidationParameters = new TokenValidationParameters
    {
        ValidateIssuer = true,
        ValidIssuer = jwtIssuer,
        ValidateAudience = true,
        ValidAudience = jwtAudience,
        ValidateIssuerSigningKey = true,
        IssuerSigningKey = new SymmetricSecurityKey(
            System.Text.Encoding.UTF8.GetBytes(jwtSigningKey)
        )
    };
});

// =============================================================================
// REDIS CACHE CONFIGURATION
// =============================================================================

// Configure Redis connection multiplexer for caching
builder.Services.AddSingleton<IConnectionMultiplexer>(sp =>
{
    var redisConnectionString = builder.Configuration["Redis:ConnectionString"];
    if (string.IsNullOrEmpty(redisConnectionString))
    {
        throw new InvalidOperationException("Redis connection string not found in configuration.");
    }
    return ConnectionMultiplexer.Connect(redisConnectionString);
});

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

// EMAIL SERVICE CONFIGURATION - Configure email settings from configuration
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
builder.Services.AddScoped<IAlertRepository, AlertRepository>();

// =============================================================================
// DEPENDENCY INJECTION - SERVICES
// =============================================================================

// Register scoped services (per-request lifecycle)
builder.Services.AddScoped<ITokenService, TokenService>();
builder.Services.AddScoped<IYahooFinanceApiService, YahooFinanceApiService>();
builder.Services.AddScoped<IEmailService, EmailService>();
builder.Services.AddScoped<IAlertService, AlertService>();
builder.Services.AddScoped<IPricePollingService, PricePollingService>();
builder.Services.AddScoped<INotificationService, NotificationService>();

// Register singleton services (application-wide single instance)
builder.Services.AddSingleton<IKafkaProducer, KafkaProducer>();
builder.Services.AddSingleton<IKafkaProducerService, KafkaProducerService>();
builder.Services.AddSingleton<IEventPublisher, KafkaEventPublisher>();
builder.Services.AddSingleton<IPortfolioCacheService, RedisCacheService>();
builder.Services.AddSingleton<IStockDataCacheService, CacheService>();
builder.Services.AddScoped<IPortfolioStockPriceUpdateService, PortfolioStockPriceUpdateService>();
builder.Services.AddSingleton<IKafkaAlertProducer, KafkaAlertProducer>();
builder.Services.AddScoped<IKafkaAlertConsumer, KafkaAlertConsumer>();

// Register HttpClient for price polling
builder.Services.AddScoped<IPricePollingService, PricePollingService>();

// BACKGROUND SERVICES- register background service
builder.Services.AddHostedService<KafkaConsumerService>();
builder.Services.AddHostedService<PortfolioStockPriceBackgroundService>();
builder.Services.AddHostedService<AlertPricePollingBackgroundService>();
builder.Services.AddHostedService<KafkaConsumerBackgroundService>();

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

//Configure Cross-Origin Resource Sharing for frontend communication
builder.Services.AddCors(options =>
{
    options.AddPolicy("CorsPolicy", policy =>
    {
        policy.AllowAnyHeader()
            .AllowAnyMethod()
            .WithOrigins("http://localhost:5173", "http://172.20.10.2:5173") // Frontend URL
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

if (app.Environment.IsDevelopment())
{
    app.UseDeveloperExceptionPage();
    app.UseExceptionHandler("/error-development");
}
else
{
    app.UseExceptionHandler("/error");
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

            // Log the full exception with inner exceptions
            logger.LogError(error.Error, "Unhandled exception occurred: {Message}", error.Error.Message);

            // Build a detailed error response
            var response = new
            {
                error = "An internal server error occurred",
                message = error.Error.Message,
                innerMessage = error.Error.InnerException?.Message,
                innerStackTrace = error.Error.InnerException?.StackTrace,
                timestamp = DateTime.UtcNow
            };

            await context.Response.WriteAsync(System.Text.Json.JsonSerializer.Serialize(response));
        }
    });
});

// Configure middleware pipeline in correct order
app.UseRateLimiter();           // Rate limiting must come early
// app.UseHttpsRedirection();      // Force HTTPS
app.UseCors("CorsPolicy");      // CORS before authentication
app.UseAuthentication();        // Authentication before authorization
app.UseAuthorization();         // Authorization

// Map API controllers
app.MapControllers();

// Map SignalR hub with rate limiting
app.MapHub<StockPriceHub>("/stockhub")
    .RequireRateLimiting("WebSocketPolicy");
app.MapHub<AlertsHub>("/alertsHub");

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