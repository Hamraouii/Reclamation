using iReclamation.Models;

namespace iReclamation.Interfaces;

public interface ITokenService
{
    string CreateToken(Users user);

}