namespace iReclamation.Dtos;

public class UserDto
{
    public string? Username { get; set; }
    public string XKestrel { get; set; }
    public bool? isActif { get; set; }
    public string? NomComplet { get; set; }
    public string Roles_names { get; set; }
    public string RoleClaims { get; set; }
}