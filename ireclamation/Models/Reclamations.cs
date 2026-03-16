namespace iReclamation.Models;

public class Reclamations
{
    public int Id { get; set; }
    public string Reference { get; set; }
    public DateTime DateCreation { get; set; } = DateTime.Now;
    public DateTime DateReception { get; set; }
    public DateTime? DateCloture { get; set; }
    public int? UserId { get; set; } 
    public virtual Users? User { get; set; } 
    public string Resume { get; set; }
    public string? treatedBy  { get; set; }

    public int TypeReclamationsId { get; set; }
    public TypeReclamations TypeReclamations { get; set; }
    public int? ServicesId { get; set; }
    
    public string? Organisme { get; set; }
    public string? ReferenceBo { get; set; }
    
    public DateTime? DateBOinp { get; set; }
    
    public string? Destinataire { get; set; }
    public string? NomAdherent { get; set; }
    public string? PrenomAdherent { get; set; }
    public string? AdresseAdherent { get; set; }
    public string? villeAdherent { get; set; }
    public string? RegionAdherent { get; set; }
    
    
    public string? AdresseOrg { get; set; }
    public Services? Services { get; set; }
    public int SourcesId { get; set; }
    public Sources? Sources { get; set; }
    public int AdherentId { get; set; }
    public Adherent? Adherent { get; set; }
    public int EtatReclamationId { get; set; } 
    public EtatReclamation? EtatReclamation { get; set; } 
    public string? Reponse { get; set; }
    public File? File { get; set; }

    public List<Dossier>? Dossiers { get; set; }
    public virtual List<HistoriqueReclamation>? HistoriqueReclamation { get; set; }
    public bool? isDeleted { get; set; }
}