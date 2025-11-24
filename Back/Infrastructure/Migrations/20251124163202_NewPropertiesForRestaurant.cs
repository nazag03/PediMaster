using System;
using System.Collections.Generic;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Infrastructure.Migrations
{
    /// <inheritdoc />
    public partial class NewPropertiesForRestaurant : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Restaurants_Users_CreatedByUserId",
                table: "Restaurants");

            migrationBuilder.RenameColumn(
                name: "Image",
                table: "Restaurants",
                newName: "Tags");

            migrationBuilder.RenameColumn(
                name: "CreatedByUserId",
                table: "Restaurants",
                newName: "CreatedForUserId");

            migrationBuilder.RenameIndex(
                name: "IX_Restaurants_CreatedByUserId",
                table: "Restaurants",
                newName: "IX_Restaurants_CreatedForUserId");

            migrationBuilder.AddColumn<string>(
                name: "City",
                table: "Restaurants",
                type: "text",
                nullable: true);

            migrationBuilder.AddColumn<DateTime>(
                name: "CreatedAt",
                table: "Restaurants",
                type: "timestamp with time zone",
                nullable: false,
                defaultValue: new DateTime(1, 1, 1, 0, 0, 0, 0, DateTimeKind.Unspecified));

            migrationBuilder.AddColumn<decimal>(
                name: "DeliveryCost",
                table: "Restaurants",
                type: "numeric",
                nullable: false,
                defaultValue: 0m);

            migrationBuilder.AddColumn<List<string>>(
                name: "Images",
                table: "Restaurants",
                type: "text[]",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "LogoUrl",
                table: "Restaurants",
                type: "text",
                nullable: true);

            migrationBuilder.AddColumn<int>(
                name: "MinOrder",
                table: "Restaurants",
                type: "integer",
                nullable: true);

            migrationBuilder.AddColumn<List<string>>(
                name: "PaymentMethod",
                table: "Restaurants",
                type: "text[]",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "Slug",
                table: "Restaurants",
                type: "text",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "WhatsappNumber",
                table: "Restaurants",
                type: "text",
                nullable: true);

            migrationBuilder.AddForeignKey(
                name: "FK_Restaurants_Users_CreatedForUserId",
                table: "Restaurants",
                column: "CreatedForUserId",
                principalTable: "Users",
                principalColumn: "UserId",
                onDelete: ReferentialAction.Cascade);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Restaurants_Users_CreatedForUserId",
                table: "Restaurants");

            migrationBuilder.DropColumn(
                name: "City",
                table: "Restaurants");

            migrationBuilder.DropColumn(
                name: "CreatedAt",
                table: "Restaurants");

            migrationBuilder.DropColumn(
                name: "DeliveryCost",
                table: "Restaurants");

            migrationBuilder.DropColumn(
                name: "Images",
                table: "Restaurants");

            migrationBuilder.DropColumn(
                name: "LogoUrl",
                table: "Restaurants");

            migrationBuilder.DropColumn(
                name: "MinOrder",
                table: "Restaurants");

            migrationBuilder.DropColumn(
                name: "PaymentMethod",
                table: "Restaurants");

            migrationBuilder.DropColumn(
                name: "Slug",
                table: "Restaurants");

            migrationBuilder.DropColumn(
                name: "WhatsappNumber",
                table: "Restaurants");

            migrationBuilder.RenameColumn(
                name: "Tags",
                table: "Restaurants",
                newName: "Image");

            migrationBuilder.RenameColumn(
                name: "CreatedForUserId",
                table: "Restaurants",
                newName: "CreatedByUserId");

            migrationBuilder.RenameIndex(
                name: "IX_Restaurants_CreatedForUserId",
                table: "Restaurants",
                newName: "IX_Restaurants_CreatedByUserId");

            migrationBuilder.AddForeignKey(
                name: "FK_Restaurants_Users_CreatedByUserId",
                table: "Restaurants",
                column: "CreatedByUserId",
                principalTable: "Users",
                principalColumn: "UserId",
                onDelete: ReferentialAction.Cascade);
        }
    }
}
