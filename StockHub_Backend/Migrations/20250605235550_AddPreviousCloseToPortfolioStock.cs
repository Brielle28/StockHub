using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace StockHub_Backend.Migrations
{
    /// <inheritdoc />
    public partial class AddPreviousCloseToPortfolioStock : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_PortfolioStocks_Stock_StockId",
                table: "PortfolioStocks");

            migrationBuilder.AlterColumn<int>(
                name: "StockId",
                table: "PortfolioStocks",
                type: "int",
                nullable: true,
                oldClrType: typeof(int),
                oldType: "int");

            migrationBuilder.AlterColumn<decimal>(
                name: "Quantity",
                table: "PortfolioStocks",
                type: "decimal(18,4)",
                precision: 18,
                scale: 4,
                nullable: false,
                oldClrType: typeof(decimal),
                oldType: "decimal(18,2)");

            migrationBuilder.AlterColumn<decimal>(
                name: "PurchasePrice",
                table: "PortfolioStocks",
                type: "decimal(18,4)",
                precision: 18,
                scale: 4,
                nullable: false,
                oldClrType: typeof(decimal),
                oldType: "decimal(18,2)");

            migrationBuilder.AddColumn<string>(
                name: "CompanyName",
                table: "PortfolioStocks",
                type: "nvarchar(200)",
                maxLength: 200,
                nullable: false,
                defaultValue: "");

            migrationBuilder.AddColumn<string>(
                name: "Currency",
                table: "PortfolioStocks",
                type: "nvarchar(3)",
                maxLength: 3,
                nullable: false,
                defaultValue: "USD");

            migrationBuilder.AddColumn<decimal>(
                name: "CurrentPrice",
                table: "PortfolioStocks",
                type: "decimal(18,4)",
                precision: 18,
                scale: 4,
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "Exchange",
                table: "PortfolioStocks",
                type: "nvarchar(50)",
                maxLength: 50,
                nullable: false,
                defaultValue: "");

            migrationBuilder.AddColumn<decimal>(
                name: "PreviousClose",
                table: "PortfolioStocks",
                type: "decimal(18,2)",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "Symbol",
                table: "PortfolioStocks",
                type: "nvarchar(10)",
                maxLength: 10,
                nullable: false,
                defaultValue: "");

            migrationBuilder.AddColumn<DateTime>(
                name: "UpdatedAt",
                table: "PortfolioStocks",
                type: "datetime2",
                nullable: false,
                defaultValue: new DateTime(1, 1, 1, 0, 0, 0, 0, DateTimeKind.Unspecified));

            migrationBuilder.CreateIndex(
                name: "IX_PortfolioStocks_CreatedAt",
                table: "PortfolioStocks",
                column: "CreatedAt");

            migrationBuilder.CreateIndex(
                name: "IX_PortfolioStocks_Symbol",
                table: "PortfolioStocks",
                column: "Symbol");

            migrationBuilder.AddForeignKey(
                name: "FK_PortfolioStocks_Stock_StockId",
                table: "PortfolioStocks",
                column: "StockId",
                principalTable: "Stock",
                principalColumn: "Id");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_PortfolioStocks_Stock_StockId",
                table: "PortfolioStocks");

            migrationBuilder.DropIndex(
                name: "IX_PortfolioStocks_CreatedAt",
                table: "PortfolioStocks");

            migrationBuilder.DropIndex(
                name: "IX_PortfolioStocks_Symbol",
                table: "PortfolioStocks");

            migrationBuilder.DropColumn(
                name: "CompanyName",
                table: "PortfolioStocks");

            migrationBuilder.DropColumn(
                name: "Currency",
                table: "PortfolioStocks");

            migrationBuilder.DropColumn(
                name: "CurrentPrice",
                table: "PortfolioStocks");

            migrationBuilder.DropColumn(
                name: "Exchange",
                table: "PortfolioStocks");

            migrationBuilder.DropColumn(
                name: "PreviousClose",
                table: "PortfolioStocks");

            migrationBuilder.DropColumn(
                name: "Symbol",
                table: "PortfolioStocks");

            migrationBuilder.DropColumn(
                name: "UpdatedAt",
                table: "PortfolioStocks");

            migrationBuilder.AlterColumn<int>(
                name: "StockId",
                table: "PortfolioStocks",
                type: "int",
                nullable: false,
                defaultValue: 0,
                oldClrType: typeof(int),
                oldType: "int",
                oldNullable: true);

            migrationBuilder.AlterColumn<decimal>(
                name: "Quantity",
                table: "PortfolioStocks",
                type: "decimal(18,2)",
                nullable: false,
                oldClrType: typeof(decimal),
                oldType: "decimal(18,4)",
                oldPrecision: 18,
                oldScale: 4);

            migrationBuilder.AlterColumn<decimal>(
                name: "PurchasePrice",
                table: "PortfolioStocks",
                type: "decimal(18,2)",
                nullable: false,
                oldClrType: typeof(decimal),
                oldType: "decimal(18,4)",
                oldPrecision: 18,
                oldScale: 4);

            migrationBuilder.AddForeignKey(
                name: "FK_PortfolioStocks_Stock_StockId",
                table: "PortfolioStocks",
                column: "StockId",
                principalTable: "Stock",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);
        }
    }
}
