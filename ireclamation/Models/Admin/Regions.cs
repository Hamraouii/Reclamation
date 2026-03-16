namespace iReclamation.Models;

public class Regions
{
    public int Id { get; set; }
    public string Nom { get; set; }
    public virtual List<Villes>? Villes { get; set; }
    // public virtual ICollection<Reclamations>? Reclamations { get; set; }
}