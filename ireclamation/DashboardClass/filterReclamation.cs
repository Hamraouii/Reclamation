namespace iReclamation.DashboardClass;

public class filterReclamation
{
    public DateTime? DateDebut { get; set; }
    public DateTime? DateEnd { get; set; }
    public string? TypeDate { get; set; }
    public List<int>? SourceId { get; set; }
    public int? regionId { get; set; }
    public string? Reference { get; set; }
    public int? Id { get; set; }
    public int? serviceId { get; set; }
    public int? TypeReclamationId { get; set; }
    public int? EtatReclamationId { get; set; }
    public int? UserId { get; set; }
    public int? AdherentId { get; set; }
    public int? AnneeDossier { get; set; }
    public int? EtatDossierId { get; set; }
}