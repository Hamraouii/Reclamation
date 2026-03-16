using System.Collections;
using iReclamation.Enums;

namespace iReclamation.Utility.ApiResponse;

/// <summary>
/// Describes the result of Kendo DataSource read operation. 
/// </summary>
[Serializable]
public class DataSourceResult
{
    /// <summary>
    /// Code réponse (résultat du traitement)
    /// </summary>
    public CodeReponseEnum codeReponse { get; set; }

    /// <summary>
    /// Message (détail ou description de l'erreur)
    /// </summary>
    public string msg { get; set; }

    /// <summary>
    /// Données retournées (résultat de l'exécution de l'api)
    /// </summary>
    public IEnumerable data { get; set; }

    /// <summary>
    /// 
    /// </summary>
    public object? dataOBJ { get; set; }

    /// <summary>
    /// Nombre d'enregistrements retournés (en fonction de la pagination)
    /// </summary>
    public Int64 NbRows { get; set; }

    /// <summary>
    /// Nombre total (à utiliser dans le grid)
    /// </summary>
    public Int64 TotalRows { get; set; }

    /// <summary>
    /// Constructeur avec data
    /// </summary>
    /// <param name="Data">Données à ajouter dans la réponse</param>
    public DataSourceResult(IEnumerable Data)
    {
        this.data = data;
    }

    /// <summary>
    /// Constructeur par défaut
    /// </summary>
    public DataSourceResult() 
    { 
    }

    /// <summary>
    /// 
    /// </summary>
    /// <param name="codeReponse">Code réponse de l'api</param>
    /// <param name="msg">Message retourné par l'api</param>
    public DataSourceResult(CodeReponseEnum codeReponse, string msg)
    {
        this.codeReponse = codeReponse;
        this.msg = msg;
    }
}