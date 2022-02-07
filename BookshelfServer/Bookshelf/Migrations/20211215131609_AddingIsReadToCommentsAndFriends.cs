using Microsoft.EntityFrameworkCore.Migrations;

namespace Bookshelf.Migrations
{
    public partial class AddingIsReadToCommentsAndFriends : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.RenameColumn(
                name: "New",
                table: "Comments",
                newName: "IsRead");

            migrationBuilder.AddColumn<bool>(
                name: "IsRead",
                table: "Friends",
                type: "bit",
                nullable: false,
                defaultValue: false);
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "IsRead",
                table: "Friends");

            migrationBuilder.RenameColumn(
                name: "IsRead",
                table: "Comments",
                newName: "New");
        }
    }
}
