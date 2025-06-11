using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace StockHub_Backend.Migrations
{
    /// <inheritdoc />
    public partial class StockPriceUpdate : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<decimal>(
                name: "Change",
                table: "PortfolioStocks",
                type: "decimal(18,2)",
                nullable: true);

            migrationBuilder.AddColumn<decimal>(
                name: "ChangePercent",
                table: "PortfolioStocks",
                type: "decimal(18,2)",
                nullable: true);

            migrationBuilder.AddColumn<DateTime>(
                name: "LastUpdated",
                table: "PortfolioStocks",
                type: "datetime2",
                nullable: true);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "Change",
                table: "PortfolioStocks");

            migrationBuilder.DropColumn(
                name: "ChangePercent",
                table: "PortfolioStocks");

            migrationBuilder.DropColumn(
                name: "LastUpdated",
                table: "PortfolioStocks");
        }
    }
}
