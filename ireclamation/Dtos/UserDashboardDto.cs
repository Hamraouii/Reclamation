namespace iReclamation.Dtos;

public class UserDashboardDto
{
    public int? Id { get; set; }
    public int? UserId { get; set; } 
    public string? UserName { get; set; } 
    // public virtual UsersDto? User { get; set; } 
    public int DashboardId { get; set; }
    public string? DashboardName { get; set; }
    
}