namespace iReclamation.Dtos;

public class HistoriqueReclamationDto
{
    public int? Id { get; set; }

    public int ReclamationsId { get; set; }

    // public virtual Reclamations? Reclamation { get; set; }
    
    public string Etat { get; set; }
    public string? Reponse { get; set; }
    public int? ActionId { get; set; } // Nullable foreign key
    public virtual ActionDto? Action { get; set; } // Navigation property
    public int userId { get; set; }
    public int? serviceId { get; set; }
    public virtual UsersDto? user { get; set; }

    public DateTime DateDeffet { get; set; } = DateTime.Now;
}