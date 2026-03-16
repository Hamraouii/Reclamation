namespace iReclamation.DashboardClass;

public class RecCountByPeriod
{
    public string ServiceName { get; set; }
    public int LessThanOneMonth { get; set; }
    public int BetweenOneAndTwoMonths { get; set; }
    public int MoreThanTwoMonths { get; set; }
}