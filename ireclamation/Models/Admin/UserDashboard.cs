namespace iReclamation.Models;

public class UserDashboard
{
    public int? Id { get; set; }
    public int? UserId { get; set; } 
    public virtual Users? User { get; set; } 
    public int DashboardId { get; set; }
}