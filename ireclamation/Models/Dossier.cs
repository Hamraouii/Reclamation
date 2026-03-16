namespace iReclamation.Models;

public class Dossier
{
    
    public int id { get; set; }
    public int Numero_dossier { get; set; }
    public int Annee_dossier { get; set; }
    public int EtatDossierId { get; set; }
    public int ReclamationsId { get; set; }
    public DateTime DateOfCreation { get; set; }
    public virtual Reclamations Reclamations { get; set; }
    public virtual EtatDossier EtatDossier { get; set; }
    
}