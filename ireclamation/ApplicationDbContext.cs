using System.Reflection;
using iReclamation.Models;
using Microsoft.EntityFrameworkCore;
using File = iReclamation.Models.File;

namespace iReclamation;

public class ApplicationDbContext : DbContext
{
    public ApplicationDbContext(DbContextOptions<ApplicationDbContext> options)
        : base(options)
    {
    }
    
    public DbSet<Adherent> Adherent { get; set; }
    public DbSet<File> Files { get; set; }
    public DbSet<Regions> Regions { get; set; }
    public DbSet<EtatDossier> EtatDossier { get; set; }
    public DbSet<Services> Services { get; set; }
    public DbSet<UserDashboard> UserDashboard { get; set; }
    public DbSet<Dashboard> Dashboard { get; set; }
    public DbSet<Dossier> Dossier { get; set; }
    public DbSet<HistoriqueReclamation> HistoriqueReclamation { get; set; }
    public DbSet<Roles> Roles { get; set; }
    public DbSet<Actions> Actions { get; set; }
    public DbSet<Sources> Sources { get; set; }
    public DbSet<TypeReclamations> TypeReclamations { get; set; }
    public DbSet<Villes> Villes { get; set; }
    public DbSet<Users> Users { get; set; }
    public DbSet<Reclamations> Reclamations { get; set; }
    public DbSet<EtatReclamation> EtatReclamations { get; set; }


    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        base.OnModelCreating(modelBuilder);

        // Use reflection to find and apply entity configurations from the assembly
        //var assembly = typeof(ICheckDb).Assembly;

        modelBuilder.ApplyConfigurationsFromAssembly(Assembly.GetExecutingAssembly());
    }
    
}