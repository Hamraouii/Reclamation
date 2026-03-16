using System.Collections;

namespace iReclamation.Dtos;

public class RegionDto
{
    public int? Id { get; set; }
    public string? Nom { get; set; }
    public virtual List<VilleDto>? Villes { get; set; }
    // public virtual ICollection<ReclamationDto>? Reclamations { get; set; }
}