namespace iReclamation.Models;

public class File
{
    public int Id { get; set; }
    public string FileName { get; set; }
    public byte[] Content { get; set; }
    public string? FilePath { get; set; }
    public int ReclamationId { get; set; }
    public virtual Reclamations Reclamation { get; set; }
}