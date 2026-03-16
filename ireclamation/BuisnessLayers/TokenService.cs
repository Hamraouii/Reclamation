using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using iReclamation.Interfaces;
using iReclamation.Models;
using iReclamation.Utility.Auth;
using Microsoft.IdentityModel.Tokens;

namespace iReclamation.BuisnessLayers;

public class TokenService : ITokenService
{
    private IConfiguration _configuration;

    public TokenService(IConfiguration configuration)
    {
        _configuration = configuration;
    }
    public string CreateToken(Users user)
    {
        var securityKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(_configuration["JwtSettings:Key"]));
        var credentials = new SigningCredentials(securityKey, SecurityAlgorithms.HmacSha256);
        var id = user.UserId.ToString();

        var claims = new List<Claim>(new System.Security.Claims.Claim[]
        {
            new System.Security.Claims.Claim(ClaimTypes.PrimarySid,
                user.ServiceId != null ? user.ServiceId.Value.ToString() : ""),
            new System.Security.Claims.Claim(ClaimTypes.Actor, user.Username),
            new System.Security.Claims.Claim(ClaimTypes.Sid, id),
            new System.Security.Claims.Claim(ClaimTypes.Name, user.Nom + " " + user.Prenom),
        });
        var Sectoken = new JwtSecurityToken(_configuration["JwtSettings:Issuer"],
            _configuration["JwtSettings:Issuer"],
            claims,
            expires: DateTime.Now.AddMinutes(240),
            signingCredentials: credentials);
            
        var token =  new JwtSecurityTokenHandler().WriteToken(Sectoken);
        return token;
    }
}