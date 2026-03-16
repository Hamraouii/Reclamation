using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace iReclamation.Migrations
{
    /// <inheritdoc />
    public partial class InitCreate : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "Actions",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    Libelle = table.Column<string>(type: "nvarchar(max)", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Actions", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "Dashboard",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    Name = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    DisplayName = table.Column<string>(type: "nvarchar(max)", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Dashboard", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "EtatDossier",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    LibelleFr = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    LibelleAr = table.Column<string>(type: "nvarchar(max)", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_EtatDossier", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "EtatReclamations",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    Libelle = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    LibelleAr = table.Column<string>(type: "nvarchar(max)", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_EtatReclamations", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "Regions",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    Nom = table.Column<string>(type: "nvarchar(max)", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Regions", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "Roles",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    Title = table.Column<string>(type: "nvarchar(max)", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Roles", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "Services",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    Libelle = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    LibelleAr = table.Column<string>(type: "nvarchar(max)", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Services", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "Sources",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    Libelle = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    LibelleAr = table.Column<string>(type: "nvarchar(max)", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Sources", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "TypeReclamations",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    Libelle = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    LibelleAr = table.Column<string>(type: "nvarchar(max)", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_TypeReclamations", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "Villes",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    Libelle = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    LibelleAr = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    RegionsId = table.Column<int>(type: "int", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Villes", x => x.Id);
                    table.ForeignKey(
                        name: "FK_Villes_Regions_RegionsId",
                        column: x => x.RegionsId,
                        principalTable: "Regions",
                        principalColumn: "Id");
                });

            migrationBuilder.CreateTable(
                name: "Users",
                columns: table => new
                {
                    UserId = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    Email = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    ServiceId = table.Column<int>(type: "int", nullable: true),
                    Prenom = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    Nom = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    Username = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    PasswordHash = table.Column<byte[]>(type: "varbinary(max)", nullable: true),
                    PasswordSalt = table.Column<byte[]>(type: "varbinary(max)", nullable: true),
                    RolesId = table.Column<int>(type: "int", nullable: true),
                    IsActif = table.Column<bool>(type: "bit", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Users", x => x.UserId);
                    table.ForeignKey(
                        name: "FK_Users_Roles_RolesId",
                        column: x => x.RolesId,
                        principalTable: "Roles",
                        principalColumn: "Id");
                    table.ForeignKey(
                        name: "FK_Users_Services_ServiceId",
                        column: x => x.ServiceId,
                        principalTable: "Services",
                        principalColumn: "Id");
                });

            migrationBuilder.CreateTable(
                name: "Adherent",
                columns: table => new
                {
                    id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    Affiliation = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    Codeimmatriculation = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    Immatriculation = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    Cin = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    Nom = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    Prenom = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    Sexe = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    Adresse = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    VilleId = table.Column<int>(type: "int", nullable: true),
                    RegionId = table.Column<int>(type: "int", nullable: true),
                    Situationfamiliale = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    Organisme = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    Datenaissance = table.Column<DateTime>(type: "datetime2", nullable: true),
                    Daterecrutement = table.Column<DateTime>(type: "datetime2", nullable: true),
                    Dateaffiliation = table.Column<DateTime>(type: "datetime2", nullable: true),
                    Statutadherent = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    Pension = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    Numppr = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    Email = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    Telephone = table.Column<string>(type: "nvarchar(max)", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Adherent", x => x.id);
                    table.ForeignKey(
                        name: "FK_Adherent_Regions_RegionId",
                        column: x => x.RegionId,
                        principalTable: "Regions",
                        principalColumn: "Id");
                    table.ForeignKey(
                        name: "FK_Adherent_Villes_VilleId",
                        column: x => x.VilleId,
                        principalTable: "Villes",
                        principalColumn: "Id");
                });

            migrationBuilder.CreateTable(
                name: "UserDashboard",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    UserId = table.Column<int>(type: "int", nullable: true),
                    DashboardId = table.Column<int>(type: "int", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_UserDashboard", x => x.Id);
                    table.ForeignKey(
                        name: "FK_UserDashboard_Users_UserId",
                        column: x => x.UserId,
                        principalTable: "Users",
                        principalColumn: "UserId");
                });

            migrationBuilder.CreateTable(
                name: "Reclamations",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    Reference = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    DateCreation = table.Column<DateTime>(type: "datetime2", nullable: false),
                    DateReception = table.Column<DateTime>(type: "datetime2", nullable: false),
                    DateCloture = table.Column<DateTime>(type: "datetime2", nullable: true),
                    UserId = table.Column<int>(type: "int", nullable: true),
                    Resume = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    treatedBy = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    TypeReclamationsId = table.Column<int>(type: "int", nullable: false),
                    ServicesId = table.Column<int>(type: "int", nullable: true),
                    Organisme = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    ReferenceBo = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    DateBOinp = table.Column<DateTime>(type: "datetime2", nullable: true),
                    Destinataire = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    NomAdherent = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    PrenomAdherent = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    AdresseAdherent = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    villeAdherent = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    RegionAdherent = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    AdresseOrg = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    SourcesId = table.Column<int>(type: "int", nullable: false),
                    AdherentId = table.Column<int>(type: "int", nullable: false),
                    EtatReclamationId = table.Column<int>(type: "int", nullable: false),
                    Reponse = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    isDeleted = table.Column<bool>(type: "bit", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Reclamations", x => x.Id);
                    table.ForeignKey(
                        name: "FK_Reclamations_Adherent_AdherentId",
                        column: x => x.AdherentId,
                        principalTable: "Adherent",
                        principalColumn: "id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_Reclamations_EtatReclamations_EtatReclamationId",
                        column: x => x.EtatReclamationId,
                        principalTable: "EtatReclamations",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_Reclamations_Services_ServicesId",
                        column: x => x.ServicesId,
                        principalTable: "Services",
                        principalColumn: "Id");
                    table.ForeignKey(
                        name: "FK_Reclamations_Sources_SourcesId",
                        column: x => x.SourcesId,
                        principalTable: "Sources",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_Reclamations_TypeReclamations_TypeReclamationsId",
                        column: x => x.TypeReclamationsId,
                        principalTable: "TypeReclamations",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_Reclamations_Users_UserId",
                        column: x => x.UserId,
                        principalTable: "Users",
                        principalColumn: "UserId");
                });

            migrationBuilder.CreateTable(
                name: "Dossier",
                columns: table => new
                {
                    id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    Numero_dossier = table.Column<int>(type: "int", nullable: false),
                    Annee_dossier = table.Column<int>(type: "int", nullable: false),
                    EtatDossierId = table.Column<int>(type: "int", nullable: false),
                    ReclamationsId = table.Column<int>(type: "int", nullable: false),
                    DateOfCreation = table.Column<DateTime>(type: "datetime2", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Dossier", x => x.id);
                    table.ForeignKey(
                        name: "FK_Dossier_EtatDossier_EtatDossierId",
                        column: x => x.EtatDossierId,
                        principalTable: "EtatDossier",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_Dossier_Reclamations_ReclamationsId",
                        column: x => x.ReclamationsId,
                        principalTable: "Reclamations",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "Files",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    FileName = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    Content = table.Column<byte[]>(type: "varbinary(max)", nullable: false),
                    FilePath = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    ReclamationId = table.Column<int>(type: "int", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Files", x => x.Id);
                    table.ForeignKey(
                        name: "FK_Files_Reclamations_ReclamationId",
                        column: x => x.ReclamationId,
                        principalTable: "Reclamations",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "HistoriqueReclamation",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    ReclamationsId = table.Column<int>(type: "int", nullable: false),
                    Etat = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    Reponse = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    ActionId = table.Column<int>(type: "int", nullable: true),
                    userId = table.Column<int>(type: "int", nullable: false),
                    serviceId = table.Column<int>(type: "int", nullable: true),
                    DateDeffet = table.Column<DateTime>(type: "datetime2", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_HistoriqueReclamation", x => x.Id);
                    table.ForeignKey(
                        name: "FK_HistoriqueReclamation_Actions_ActionId",
                        column: x => x.ActionId,
                        principalTable: "Actions",
                        principalColumn: "Id");
                    table.ForeignKey(
                        name: "FK_HistoriqueReclamation_Reclamations_ReclamationsId",
                        column: x => x.ReclamationsId,
                        principalTable: "Reclamations",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_HistoriqueReclamation_Users_userId",
                        column: x => x.userId,
                        principalTable: "Users",
                        principalColumn: "UserId",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateIndex(
                name: "IX_Adherent_RegionId",
                table: "Adherent",
                column: "RegionId");

            migrationBuilder.CreateIndex(
                name: "IX_Adherent_VilleId",
                table: "Adherent",
                column: "VilleId");

            migrationBuilder.CreateIndex(
                name: "IX_Dossier_EtatDossierId",
                table: "Dossier",
                column: "EtatDossierId");

            migrationBuilder.CreateIndex(
                name: "IX_Dossier_ReclamationsId",
                table: "Dossier",
                column: "ReclamationsId");

            migrationBuilder.CreateIndex(
                name: "IX_Files_ReclamationId",
                table: "Files",
                column: "ReclamationId",
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_HistoriqueReclamation_ActionId",
                table: "HistoriqueReclamation",
                column: "ActionId");

            migrationBuilder.CreateIndex(
                name: "IX_HistoriqueReclamation_ReclamationsId",
                table: "HistoriqueReclamation",
                column: "ReclamationsId");

            migrationBuilder.CreateIndex(
                name: "IX_HistoriqueReclamation_userId",
                table: "HistoriqueReclamation",
                column: "userId");

            migrationBuilder.CreateIndex(
                name: "IX_Reclamations_AdherentId",
                table: "Reclamations",
                column: "AdherentId");

            migrationBuilder.CreateIndex(
                name: "IX_Reclamations_EtatReclamationId",
                table: "Reclamations",
                column: "EtatReclamationId");

            migrationBuilder.CreateIndex(
                name: "IX_Reclamations_ServicesId",
                table: "Reclamations",
                column: "ServicesId");

            migrationBuilder.CreateIndex(
                name: "IX_Reclamations_SourcesId",
                table: "Reclamations",
                column: "SourcesId");

            migrationBuilder.CreateIndex(
                name: "IX_Reclamations_TypeReclamationsId",
                table: "Reclamations",
                column: "TypeReclamationsId");

            migrationBuilder.CreateIndex(
                name: "IX_Reclamations_UserId",
                table: "Reclamations",
                column: "UserId");

            migrationBuilder.CreateIndex(
                name: "IX_UserDashboard_UserId",
                table: "UserDashboard",
                column: "UserId");

            migrationBuilder.CreateIndex(
                name: "IX_Users_RolesId",
                table: "Users",
                column: "RolesId");

            migrationBuilder.CreateIndex(
                name: "IX_Users_ServiceId",
                table: "Users",
                column: "ServiceId");

            migrationBuilder.CreateIndex(
                name: "IX_Villes_RegionsId",
                table: "Villes",
                column: "RegionsId");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "Dashboard");

            migrationBuilder.DropTable(
                name: "Dossier");

            migrationBuilder.DropTable(
                name: "Files");

            migrationBuilder.DropTable(
                name: "HistoriqueReclamation");

            migrationBuilder.DropTable(
                name: "UserDashboard");

            migrationBuilder.DropTable(
                name: "EtatDossier");

            migrationBuilder.DropTable(
                name: "Actions");

            migrationBuilder.DropTable(
                name: "Reclamations");

            migrationBuilder.DropTable(
                name: "Adherent");

            migrationBuilder.DropTable(
                name: "EtatReclamations");

            migrationBuilder.DropTable(
                name: "Sources");

            migrationBuilder.DropTable(
                name: "TypeReclamations");

            migrationBuilder.DropTable(
                name: "Users");

            migrationBuilder.DropTable(
                name: "Villes");

            migrationBuilder.DropTable(
                name: "Roles");

            migrationBuilder.DropTable(
                name: "Services");

            migrationBuilder.DropTable(
                name: "Regions");
        }
    }
}
