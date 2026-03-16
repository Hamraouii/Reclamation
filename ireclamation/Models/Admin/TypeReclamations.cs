namespace iReclamation.Models;

public class TypeReclamations
{
    public int Id { get; set; }
    public string Libelle { get; set; }
    public string LibelleAr { get; set; }
    public virtual ICollection<Reclamations> Reclamations { get; set; }
}