namespace iReclamation.Dtos;

public class FileDto
{
    public int Id { get; set; }
    public string FileName { get; set; }
    // public byte[] Content { get; set; }
    public string? FilePath { get; set; }
    public int ReclamationId { get; set; }
}