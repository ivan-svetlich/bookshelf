using Microsoft.EntityFrameworkCore.Migrations;

namespace Bookshelf.Migrations
{
    public partial class SettingForeignKeysInChatTables : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_ActiveChats_AspNetUsers_UserId1",
                table: "ActiveChats");

            migrationBuilder.DropForeignKey(
                name: "FK_ActiveChats_AspNetUsers_UserId2",
                table: "ActiveChats");

            migrationBuilder.AlterColumn<string>(
                name: "UserId2",
                table: "ActiveChats",
                type: "nvarchar(450)",
                nullable: true,
                oldClrType: typeof(string),
                oldType: "nvarchar(450)");

            migrationBuilder.AlterColumn<string>(
                name: "UserId1",
                table: "ActiveChats",
                type: "nvarchar(450)",
                nullable: true,
                oldClrType: typeof(string),
                oldType: "nvarchar(450)");

            migrationBuilder.AddForeignKey(
                name: "FK_ActiveChats_AspNetUsers_UserId1",
                table: "ActiveChats",
                column: "UserId1",
                principalTable: "AspNetUsers",
                principalColumn: "Id",
                onDelete: ReferentialAction.Restrict);

            migrationBuilder.AddForeignKey(
                name: "FK_ActiveChats_AspNetUsers_UserId2",
                table: "ActiveChats",
                column: "UserId2",
                principalTable: "AspNetUsers",
                principalColumn: "Id",
                onDelete: ReferentialAction.Restrict);
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_ActiveChats_AspNetUsers_UserId1",
                table: "ActiveChats");

            migrationBuilder.DropForeignKey(
                name: "FK_ActiveChats_AspNetUsers_UserId2",
                table: "ActiveChats");

            migrationBuilder.AlterColumn<string>(
                name: "UserId2",
                table: "ActiveChats",
                type: "nvarchar(450)",
                nullable: false,
                defaultValue: "",
                oldClrType: typeof(string),
                oldType: "nvarchar(450)",
                oldNullable: true);

            migrationBuilder.AlterColumn<string>(
                name: "UserId1",
                table: "ActiveChats",
                type: "nvarchar(450)",
                nullable: false,
                defaultValue: "",
                oldClrType: typeof(string),
                oldType: "nvarchar(450)",
                oldNullable: true);

            migrationBuilder.AddForeignKey(
                name: "FK_ActiveChats_AspNetUsers_UserId1",
                table: "ActiveChats",
                column: "UserId1",
                principalTable: "AspNetUsers",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "FK_ActiveChats_AspNetUsers_UserId2",
                table: "ActiveChats",
                column: "UserId2",
                principalTable: "AspNetUsers",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);
        }
    }
}
