using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Infrastructure.Migrations
{
    /// <inheritdoc />
    public partial class CreateMigration : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_DaylisMenu_Foods_FoodId",
                table: "DaylisMenu");

            migrationBuilder.DropIndex(
                name: "IX_DaylisMenu_FoodId",
                table: "DaylisMenu");

            migrationBuilder.DropColumn(
                name: "FoodId",
                table: "DaylisMenu");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<int>(
                name: "FoodId",
                table: "DaylisMenu",
                type: "integer",
                nullable: true);

            migrationBuilder.CreateIndex(
                name: "IX_DaylisMenu_FoodId",
                table: "DaylisMenu",
                column: "FoodId");

            migrationBuilder.AddForeignKey(
                name: "FK_DaylisMenu_Foods_FoodId",
                table: "DaylisMenu",
                column: "FoodId",
                principalTable: "Foods",
                principalColumn: "FoodId");
        }
    }
}
