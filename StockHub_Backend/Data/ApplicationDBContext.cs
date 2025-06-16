using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;
using StockHub_Backend.Models;

namespace StockHub_Backend.Data
{
    public class ApplicationDBContext : IdentityDbContext<AppUser>
    {
        public ApplicationDBContext(DbContextOptions dbContextOptions) : base(dbContextOptions)
        {
        }

        public DbSet<Stock> Stock { get; set; }
        public DbSet<Comment> Comments { get; set; }
        public DbSet<Portfolio> Portfolios { get; set; }
        public DbSet<PortfolioStock> PortfolioStocks { get; set; }

        // Stock-related models (separate from portfolio)
        public DbSet<StockQuote> StockQuotes { get; set; }
        public DbSet<StockHistory> StockHistories { get; set; }
        public DbSet<StockDataPoint> StockDataPoints { get; set; }
        public DbSet<StockNews> StockNews { get; set; }
        public DbSet<StockSearchResult> StockSearchResults { get; set; }
        public DbSet<RefreshToken> RefreshTokens { get; set; }

        // alert
        public DbSet<Alert> Alerts { get; set; }

        protected override void OnModelCreating(ModelBuilder builder)
        {
            base.OnModelCreating(builder);

            // Enforce unique normalized email
            builder.Entity<AppUser>()
                .HasIndex(u => u.NormalizedEmail)
                .IsUnique();

            // Configure Portfolio relationships (independent of Stock)
            builder.Entity<Portfolio>()
                .HasOne(p => p.AppUser)
                .WithMany(u => u.Portfolios)
                .HasForeignKey(p => p.AppUserId)
                .OnDelete(DeleteBehavior.Cascade);

            // Configure PortfolioStock relationships (NO foreign key to Stock table)
            builder.Entity<PortfolioStock>()
                .HasOne(ps => ps.Portfolio)
                .WithMany(p => p.PortfolioStocks)
                .HasForeignKey(ps => ps.PortfolioId)
                .OnDelete(DeleteBehavior.Cascade);

            // Configure PortfolioStock entity properties
            builder.Entity<PortfolioStock>(entity =>
            {
                entity.Property(e => e.Symbol).HasMaxLength(10).IsRequired();
                // entity.Property(e => e.CompanyName).HasMaxLength(200).IsRequired();
                entity.Property(e => e.Exchange).HasMaxLength(50);
                entity.Property(e => e.Currency).HasMaxLength(3).HasDefaultValue("USD");
                entity.Property(e => e.Quantity).HasPrecision(18, 4);
                entity.Property(e => e.PurchasePrice).HasPrecision(18, 4);
                entity.Property(e => e.CurrentPrice).HasPrecision(18, 4);

                // Add indexes for better performance
                entity.HasIndex(e => e.Symbol);
                entity.HasIndex(e => e.PortfolioId);
                entity.HasIndex(e => e.CreatedAt);
            });

            // Configure StockQuote entity
            builder.Entity<StockQuote>(entity =>
            {
                entity.HasKey(e => e.Symbol);
                entity.Property(e => e.Symbol).HasMaxLength(10).IsRequired();
                entity.Property(e => e.CompanyName).HasMaxLength(200);
                entity.Property(e => e.Currency).HasMaxLength(3).HasDefaultValue("USD");
                entity.Property(e => e.CurrentPrice).HasPrecision(18, 4);
                entity.Property(e => e.Change).HasPrecision(18, 4);
                entity.Property(e => e.ChangePercent).HasPrecision(18, 4);
                entity.Property(e => e.DayHigh).HasPrecision(18, 4);
                entity.Property(e => e.DayLow).HasPrecision(18, 4);
                entity.Property(e => e.Open).HasPrecision(18, 4);
                entity.Property(e => e.PreviousClose).HasPrecision(18, 4);
                entity.Property(e => e.MarketCap).HasPrecision(18, 2);
                entity.Property(e => e.PeRatio).HasPrecision(18, 4);

                entity.HasIndex(e => e.Symbol).IsUnique();
                entity.HasIndex(e => e.LastUpdated);
            });

            // Configure StockHistory entity
            builder.Entity<StockHistory>(entity =>
            {
                entity.HasKey(e => new { e.Symbol, e.Range });
                entity.Property(e => e.Symbol).HasMaxLength(10).IsRequired();
                entity.Property(e => e.Range).HasMaxLength(20).IsRequired();

                entity.HasMany<StockDataPoint>()
                      .WithOne()
                      .HasForeignKey("StockHistorySymbol", "StockHistoryRange")
                      .OnDelete(DeleteBehavior.Cascade);

                entity.HasIndex(e => e.Symbol);
                entity.HasIndex(e => e.RetrievedAt);
            });

            // Configure StockDataPoint entity
            builder.Entity<StockDataPoint>(entity =>
            {
                entity.HasKey(e => new { e.Date });
                entity.Property(e => e.Open).HasPrecision(18, 4);
                entity.Property(e => e.High).HasPrecision(18, 4);
                entity.Property(e => e.Low).HasPrecision(18, 4);
                entity.Property(e => e.Close).HasPrecision(18, 4);
                entity.Property(e => e.AdjustedClose).HasPrecision(18, 4);

                entity.Property<string>("StockHistorySymbol").HasMaxLength(10);
                entity.Property<string>("StockHistoryRange").HasMaxLength(20);

                entity.HasIndex(e => new { e.Date });
            });

            // Configure StockNews entity
            builder.Entity<StockNews>(entity =>
            {
                entity.HasKey(e => e.Url);
                entity.Property(e => e.Url).HasMaxLength(500).IsRequired();
                entity.Property(e => e.Title).HasMaxLength(300).IsRequired();
                entity.Property(e => e.Summary).HasMaxLength(1000);
                entity.Property(e => e.Source).HasMaxLength(100);
                entity.Property(e => e.ImageUrl).HasMaxLength(500);

                entity.Property(e => e.RelatedSymbols)
                      .HasConversion(
                          v => string.Join(',', v),
                          v => v.Split(',', StringSplitOptions.RemoveEmptyEntries).ToList()
                      );

                entity.HasIndex(e => e.PublishedAt);
                entity.HasIndex(e => e.Source);
            });

            // Configure StockSearchResult entity
            builder.Entity<StockSearchResult>(entity =>
            {
                entity.HasKey(e => e.Symbol);
                entity.Property(e => e.Symbol).HasMaxLength(10).IsRequired();
                entity.Property(e => e.CompanyName).HasMaxLength(200);
                entity.Property(e => e.Exchange).HasMaxLength(50);
                entity.Property(e => e.Type).HasMaxLength(50);
                entity.Property(e => e.Region).HasMaxLength(50);

                entity.HasIndex(e => e.CompanyName);
                entity.HasIndex(e => e.Exchange);
            });

            // Configure Alert entity
            builder.Entity<Alert>(entity =>
            {
                entity.HasKey(e => e.Id);
                entity.Property(e => e.UserId).IsRequired();
                entity.Property(e => e.Symbol).IsRequired().HasMaxLength(10);
                entity.Property(e => e.TargetPrice).HasColumnType("decimal(18,2)");
                entity.Property(e => e.Condition).HasConversion<string>();
                entity.Property(e => e.CreatedAt).HasDefaultValueSql("GETUTCDATE()");

                // Index for better performance
                entity.HasIndex(e => new { e.UserId, e.IsActive });
                entity.HasIndex(e => new { e.Symbol, e.IsActive });
            });

            // Identity roles seed data
            List<IdentityRole> roles = new List<IdentityRole>
            {
                new IdentityRole
                {
                    Id = "1",
                    Name = "Admin",
                    NormalizedName = "ADMIN",
                    ConcurrencyStamp = "1"
                },
                new IdentityRole
                {
                    Id = "2",
                    Name = "User",
                    NormalizedName = "USER",
                    ConcurrencyStamp = "2"
                }
            };
            builder.Entity<IdentityRole>().HasData(roles);
        }
    }
}