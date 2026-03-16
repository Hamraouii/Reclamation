namespace iReclamation.Enums;

public enum CodeReponseEnum
{
    /// <summary>
    /// API exécutée avec succès
    /// </summary>
    ok = 200,

    /// <summary>
    /// Exécution non authorisée
    /// </summary>
    unauthorized = 401,

    /// <summary>
    /// API a retourné une erreur
    /// </summary>
    error = 500,

    /// <summary>
    /// Paramètres d'appel vide
    /// </summary>
    errorMissingAllParams = 501,

    /// <summary>
    /// Paramètre(s) manquant(s) ou invalide(s)
    /// </summary>
    errorInvalidMissingParams = 502,

    /// <summary>
    /// Format paramètre(s) invalide
    /// </summary>
    errorInvalidParams = 503,
    /// <summary>
    /// IP non authorisée par les WS Certus
    /// </summary>
    unauthorizedIP = 620
}