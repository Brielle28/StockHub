using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace StockHub_Backend.Migrations
{
    /// <inheritdoc />
    public partial class AddStockModels : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "StockHistories",
                columns: table => new
                {
                    Symbol = table.Column<string>(type: "nvarchar(10)", maxLength: 10, nullable: false),
                    Range = table.Column<string>(type: "nvarchar(20)", maxLength: 20, nullable: false),
                    RetrievedAt = table.Column<DateTime>(type: "datetime2", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_StockHistories", x => new { x.Symbol, x.Range });
                });

            migrationBuilder.CreateTable(
                name: "StockNews",
                columns: table => new
                {
                    Url = table.Column<string>(type: "nvarchar(500)", maxLength: 500, nullable: false),
                    Title = table.Column<string>(type: "nvarchar(300)", maxLength: 300, nullable: false),
                    Summary = table.Column<string>(type: "nvarchar(1000)", maxLength: 1000, nullable: false),
                    Source = table.Column<string>(type: "nvarchar(100)", maxLength: 100, nullable: false),
                    PublishedAt = table.Column<DateTime>(type: "datetime2", nullable: false),
                    ImageUrl = table.Column<string>(type: "nvarchar(500)", maxLength: 500, nullable: false),
                    RelatedSymbols = table.Column<string>(type: "nvarchar(max)", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_StockNews", x => x.Url);
                });

            migrationBuilder.CreateTable(
                name: "StockQuotes",
                columns: table => new
                {
                    Symbol = table.Column<string>(type: "nvarchar(10)", maxLength: 10, nullable: false),
                    CompanyName = table.Column<string>(type: "nvarchar(200)", maxLength: 200, nullable: false),
                    CurrentPrice = table.Column<decimal>(type: "decimal(18,4)", precision: 18, scale: 4, nullable: false),
                    Change = table.Column<decimal>(type: "decimal(18,4)", precision: 18, scale: 4, nullable: false),
                    ChangePercent = table.Column<decimal>(type: "decimal(18,4)", precision: 18, scale: 4, nullable: false),
                    LastUpdated = table.Column<DateTime>(type: "datetime2", nullable: false),
                    Currency = table.Column<string>(type: "nvarchar(3)", maxLength: 3, nullable: false, defaultValue: "USD"),
                    Volume = table.Column<long>(type: "bigint", nullable: false),
                    DayHigh = table.Column<decimal>(type: "decimal(18,4)", precision: 18, scale: 4, nullable: false),
                    DayLow = table.Column<decimal>(type: "decimal(18,4)", precision: 18, scale: 4, nullable: false),
                    Open = table.Column<decimal>(type: "decimal(18,4)", precision: 18, scale: 4, nullable: false),
                    PreviousClose = table.Column<decimal>(type: "decimal(18,4)", precision: 18, scale: 4, nullable: false),
                    MarketCap = table.Column<decimal>(type: "decimal(18,2)", precision: 18, scale: 2, nullable: false),
                    PeRatio = table.Column<decimal>(type: "decimal(18,4)", precision: 18, scale: 4, nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_StockQuotes", x => x.Symbol);
                });

            migrationBuilder.CreateTable(
                name: "StockSearchResults",
                columns: table => new
                {
                    Symbol = table.Column<string>(type: "nvarchar(10)", maxLength: 10, nullable: false),
                    CompanyName = table.Column<string>(type: "nvarchar(200)", maxLength: 200, nullable: false),
                    Exchange = table.Column<string>(type: "nvarchar(50)", maxLength: 50, nullable: false),
                    Type = table.Column<string>(type: "nvarchar(50)", maxLength: 50, nullable: false),
                    Region = table.Column<string>(type: "nvarchar(50)", maxLength: 50, nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_StockSearchResults", x => x.Symbol);
                });

            migrationBuilder.CreateTable(
                name: "StockDataPoints",
                columns: table => new
                {
                    Date = table.Column<DateTime>(type: "datetime2", nullable: false),
                    Open = table.Column<decimal>(type: "decimal(18,4)", precision: 18, scale: 4, nullable: false),
                    High = table.Column<decimal>(type: "decimal(18,4)", precision: 18, scale: 4, nullable: false),
                    Low = table.Column<decimal>(type: "decimal(18,4)", precision: 18, scale: 4, nullable: false),
                    Close = table.Column<decimal>(type: "decimal(18,4)", precision: 18, scale: 4, nullable: false),
                    AdjustedClose = table.Column<decimal>(type: "decimal(18,4)", precision: 18, scale: 4, nullable: false),
                    Volume = table.Column<long>(type: "bigint", nullable: false),
                    StockHistoryRange = table.Column<string>(type: "nvarchar(20)", maxLength: 20, nullable: true),
                    StockHistoryRange1 = table.Column<string>(type: "nvarchar(20)", nullable: true),
                    StockHistorySymbol = table.Column<string>(type: "nvarchar(10)", maxLength: 10, nullable: true),
                    StockHistorySymbol1 = table.Column<string>(type: "nvarchar(10)", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_StockDataPoints", x => x.Date);
                    table.ForeignKey(
                        name: "FK_StockDataPoints_StockHistories_StockHistorySymbol1_StockHistoryRange1",
                        columns: x => new { x.StockHistorySymbol1, x.StockHistoryRange1 },
                        principalTable: "StockHistories",
                        principalColumns: new[] { "Symbol", "Range" });
                    table.ForeignKey(
                        name: "FK_StockDataPoints_StockHistories_StockHistorySymbol_StockHistoryRange",
                        columns: x => new { x.StockHistorySymbol, x.StockHistoryRange },
                        principalTable: "StockHistories",
                        principalColumns: new[] { "Symbol", "Range" },
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateIndex(
                name: "IX_StockDataPoints_Date",
                table: "StockDataPoints",
                column: "Date");

            migrationBuilder.CreateIndex(
                name: "IX_StockDataPoints_StockHistorySymbol_StockHistoryRange",
                table: "StockDataPoints",
                columns: new[] { "StockHistorySymbol", "StockHistoryRange" });

            migrationBuilder.CreateIndex(
                name: "IX_StockDataPoints_StockHistorySymbol1_StockHistoryRange1",
                table: "StockDataPoints",
                columns: new[] { "StockHistorySymbol1", "StockHistoryRange1" });

            migrationBuilder.CreateIndex(
                name: "IX_StockHistories_RetrievedAt",
                table: "StockHistories",
                column: "RetrievedAt");

            migrationBuilder.CreateIndex(
                name: "IX_StockHistories_Symbol",
                table: "StockHistories",
                column: "Symbol");

            migrationBuilder.CreateIndex(
                name: "IX_StockNews_PublishedAt",
                table: "StockNews",
                column: "PublishedAt");

            migrationBuilder.CreateIndex(
                name: "IX_StockNews_Source",
                table: "StockNews",
                column: "Source");

            migrationBuilder.CreateIndex(
                name: "IX_StockQuotes_LastUpdated",
                table: "StockQuotes",
                column: "LastUpdated");

            migrationBuilder.CreateIndex(
                name: "IX_StockQuotes_Symbol",
                table: "StockQuotes",
                column: "Symbol",
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_StockSearchResults_CompanyName",
                table: "StockSearchResults",
                column: "CompanyName");

            migrationBuilder.CreateIndex(
                name: "IX_StockSearchResults_Exchange",
                table: "StockSearchResults",
                column: "Exchange");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "StockDataPoints");

            migrationBuilder.DropTable(
                name: "StockNews");

            migrationBuilder.DropTable(
                name: "StockQuotes");

            migrationBuilder.DropTable(
                name: "StockSearchResults");

            migrationBuilder.DropTable(
                name: "StockHistories");
        }
    }
}
