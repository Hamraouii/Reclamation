namespace iReclamation.Dtos;

public class VilleDto
{
    public int? Id { get; set; }
    public string? Libelle { get; set; }
    public string? LibelleAr { get; set; }
    public virtual RegionDto? Regions { get; set; }
}