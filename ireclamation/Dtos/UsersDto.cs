using iReclamation.Models;

namespace iReclamation.Dtos;

public class UsersDto
{
    public int UserId { get; set; }
    public string? Email { get; set; }
    public int? ServiceId { get; set; }
    public string? Prenom { get; set; }
    public string? Nom { get; set; }
    public string Username { get; set; }
    public byte[]? PasswordHash { get; set; }
    public byte[]? PasswordSalt { get; set; }
    public int? RolesId { get; set; }
    public bool? IsActif { get; set; }
    public virtual Roles? Roles { get; set; }
    public virtual List<UserDashboardDto>? UserDashboards { get; set; }
    public virtual ServiceDto? Service { get; set; }
}