using iReclamation.Models;
using File = iReclamation.Models.File;

namespace iReclamation.Dtos;

public class ReclamationDto
{
    public int? Id { get; set; }
    public string? Reference { get; set; }
    public DateTime? DateCreation { get; set; } = DateTime.Now;
    public DateTime? DateReception { get; set; }
    public DateTime? DateCloture  { get; set; }
    public string? DateReceptionString { get; set; } 
    public int? UserId { get; set; } 
    public virtual UsersDto? User { get; set; } 
    public string? Resume { get; set; }
    public string? treatedBy  { get; set; }
    public string? createdBy  { get; set; }
    public string? Organisme { get; set; }
    public string? ReferenceBo { get; set; }
    public FileDto? File { get; set; }

    public string? LastUserTreated { get; set; }
    
    public DateTime? DateBOinp { get; set; }
    
    public string? Destinataire { get; set; }
    public string? NomAdherent { get; set; }
    public string? PrenomAdherent { get; set; }
    public string? AdresseAdherent { get; set; }
    public string? villeAdherent { get; set; }
    public string? RegionAdherent { get; set; }
    
    public string? AdresseOrg { get; set; }
    public int? ServicesId { get; set; }
    public int? SourcesId { get; set; }
    public int? TypeReclamationsId { get; set; }
    public int? AdherentId { get; set; }
    public int? EtatReclamationId { get; set; }
    public string? Reponse { get; set; }
    public virtual ServiceDto? Services { get; set; }
    public virtual SourceDto? Sources { get; set; }
    public virtual TypeReclamationDto? TypeReclamations { get; set; }
    public virtual AdherentDto? Adherent { get; set; }
    public virtual EtatReclamationDto? EtatReclamation { get; set; }
    public virtual List<HistoriqueReclamationDto>? HistoriqueReclamation { get; set; }
    public bool? isDeleted { get; set; }

}