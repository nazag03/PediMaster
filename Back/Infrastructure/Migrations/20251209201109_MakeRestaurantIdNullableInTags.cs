using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Infrastructure.Migrations
{
    /// <inheritdoc />
    public partial class MakeRestaurantIdNullableInTags : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Tags_Restaurants_RestaurantId",
                table: "Tags");

            migrationBuilder.AlterColumn<int>(
                name: "RestaurantId",
                table: "Tags",
                type: "integer",
                nullable: true,
                oldClrType: typeof(int),
                oldType: "integer");

            migrationBuilder.AddForeignKey(
                name: "FK_Tags_Restaurants_RestaurantId",
                table: "Tags",
                column: "RestaurantId",
                principalTable: "Restaurants",
                principalColumn: "RestaurantId");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Tags_Restaurants_RestaurantId",
                table: "Tags");

            migrationBuilder.AlterColumn<int>(
                name: "RestaurantId",
                table: "Tags",
                type: "integer",
                nullable: false,
                defaultValue: 0,
                oldClrType: typeof(int),
                oldType: "integer",
                oldNullable: true);

            migrationBuilder.AddForeignKey(
                name: "FK_Tags_Restaurants_RestaurantId",
                table: "Tags",
                column: "RestaurantId",
                principalTable: "Restaurants",
                principalColumn: "RestaurantId",
                onDelete: ReferentialAction.Cascade);
        }
    }
}
