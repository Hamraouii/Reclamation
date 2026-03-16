using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace iReclamation.Models;

public class HistoriqueReclamation
{
    [Key]
    [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
    public int Id { get; set; }

    public int ReclamationsId { get; set; }

    // public virtual Reclamations? Reclamation { get; set; }
    
    public string Etat { get; set; }
    public string? Reponse { get; set; }
    public int? ActionId { get; set; } // Nullable foreign key
    public virtual Actions? Action { get; set; } // Navigation property
    public int userId { get; set; }
    public int? serviceId { get; set; }
    public virtual Users? user { get; set; }

    public DateTime DateDeffet { get; set; } = DateTime.Now;
}