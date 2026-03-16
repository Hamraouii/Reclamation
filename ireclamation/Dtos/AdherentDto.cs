using iReclamation.Models;

namespace iReclamation.Dtos;

public class AdherentDto
{
    public int? id { get; set; }
    public string? Affiliation { get; set; }
    public string? Codeimmatriculation { get; set; }
    public string? Immatriculation { get; set; }
    public string? Cin { get; set; }
    public string? Nom { get; set; }
    public string? Prenom { get; set; }
    public string? Sexe { get; set; }
    public string? Adresse { get; set; }
    public int VilleId { get; set; }
    public virtual VilleDto? Ville { get; set; }
    public int RegionId { get; set; }
    public virtual RegionDto? Region { get; set; }
    public string? Situationfamiliale { get; set; }
    public string? Organisme { get; set; }
    public DateTime? Datenaissance { get; set; }
    public DateTime? Daterecrutement { get; set; }
    public DateTime? Dateaffiliation { get; set; }
    public string? Statutadherent { get; set; }
    public string? Pension { get; set; }
    public string? Numppr { get; set; }
    public string? Email { get; set; }
    public string? Telephone { get; set; }
}