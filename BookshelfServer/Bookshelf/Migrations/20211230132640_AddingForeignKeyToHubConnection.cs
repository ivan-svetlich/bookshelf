using Microsoft.EntityFrameworkCore.Migrations;

namespace Bookshelf.Migrations
{
    public partial class AddingForeignKeyToHubConnection : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "Username",
                table: "HubConnections");

            migrationBuilder.AddColumn<string>(
                name: "UserId",
                table: "HubConnections",
                type: "nvarchar(450)",
                nullable: true);

            migrationBuilder.CreateIndex(
                name: "IX_HubConnections_UserId",
                table: "HubConnections",
                column: "UserId");

            migrationBuilder.AddForeignKey(
                name: "FK_HubConnections_AspNetUsers_UserId",
                table: "HubConnections",
                column: "UserId",
                principalTable: "AspNetUsers",
                principalColumn: "Id",
                onDelete: ReferentialAction.Restrict);
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_HubConnections_AspNetUsers_UserId",
                table: "HubConnections");

            migrationBuilder.DropIndex(
                name: "IX_HubConnections_UserId",
                table: "HubConnections");

            migrationBuilder.DropColumn(
                name: "UserId",
                table: "HubConnections");

            migrationBuilder.AddColumn<string>(
                name: "Username",
                table: "HubConnections",
                type: "nvarchar(max)",
                nullable: true);
        }
    }
}
