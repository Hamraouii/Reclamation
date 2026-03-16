using System;
using System.Collections.Generic;
using System.Linq;
using System.Security.Claims;
using System.Security.Cryptography;
using System.Text;
using System.Threading.Tasks;
using iReclamation.Dtos;
using iReclamation.Enums;
using iReclamation.Interfaces;
using iReclamation.Models;
using iReclamation.Utility.ApiResponse;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace iReclamation.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class AuthController : ControllerBase
    {
        private IConfiguration _configuration;
        private readonly ApplicationDbContext _context;
        private readonly ITokenService _tokenService;

        public AuthController(IConfiguration configuration, ITokenService tokenService, ApplicationDbContext context)
        {
            _configuration = configuration;
            _tokenService = tokenService;
            _context = context;
        }

        [HttpPost("register")]
        public async Task<ActionResult<UserDto>> Register(RegisterDto registerDto)
        {

            if (await UserExists(registerDto.Username)) return BadRequest("UserName Is Already Taken");

            var hmac = new HMACSHA512();


            var user = new Users()
            {
                Username = registerDto.Username,
                Prenom = registerDto.Prenom,
                Nom = registerDto.Nom,
                ServiceId = registerDto.serviceId,
                IsActif = registerDto.isActif,
                RolesId = registerDto.RoleId,
                Email = registerDto.Email,
                PasswordHash = hmac.ComputeHash(Encoding.UTF8.GetBytes(registerDto.Password)),
                PasswordSalt = hmac.Key,
            };

            _context.Users.Add(user);
            await _context.SaveChangesAsync();

            return new UserDto
            {
                Username = user.Username,
                XKestrel = _tokenService.CreateToken(user),
                isActif = user.IsActif
            };
        }

        private async Task<bool> UserExists(string username)
        {
            return await _context.Users.AnyAsync(x => x.Username == username.ToLower());
        }

        [HttpPost("login")]
        public async Task<ActionResult<DataSourceResult>> Login(LoginDto loginDto)
        {
            DataSourceResult dataResult = new DataSourceResult();


            var dictionary = new Dictionary<string, object>();
            try
            {
                var user = await _context.Users
                    .Include(x => x.Roles)
                    .Include(x => x.UserDashboards)
                    .SingleOrDefaultAsync(x => x.Username == loginDto.Username);

                if (user != null)
                {

                    var hmac = new HMACSHA512(user.PasswordSalt);

                    var computedHash = hmac.ComputeHash(Encoding.UTF8.GetBytes(loginDto.Password));

                    for (int i = 0; i < computedHash.Length; i++)
                    {
                        if (computedHash[i] != user.PasswordHash[i]) return Unauthorized("Invalid Password");
                    }
                    var userDashboard = user.UserDashboards.Select(x => new { x.Id, x.DashboardId }).ToArray();
                    var userDashboardClaims = user.UserDashboards.Select(userDashboard => new System.Security.Claims.Claim(ClaimTypes.Role, userDashboard.DashboardId.ToString()));

                    var roles_names = user.Roles.Title;
                    var roleClaims = new Claim(ClaimTypes.Role, roles_names);

                    var XkestrelValue = _tokenService.CreateToken(user);
                    

                    dictionary.Add("XKestrel", XkestrelValue);
                    dictionary.Add("username", user.Username);
                    dictionary.Add("Uid", user.UserId.ToString());
                    dictionary.Add("RoleId", user.RolesId.ToString());
                    dictionary.Add("serviceId", user.ServiceId.ToString());
                    dictionary.Add("NomComplet", user.Nom + " " + user.Prenom);
                    dictionary.Add("Roles_names", roles_names);
                    dictionary.Add("roles", roles_names);
                    dictionary.Add("userDashboard", userDashboard);
                    dictionary.Add("isAdmin", user.RolesId == 1 ? true : false);


                    //On définit le résultat à retourner
                    dataResult.NbRows = 1;
                    dataResult.data = dictionary;
                    dataResult.TotalRows = 1;
                    dataResult.msg = "Authentifié";
                    dataResult.codeReponse = CodeReponseEnum.ok;
                }
                else
                {
                    //On définit le résultat à retourner
                    dataResult.NbRows = 0;
                    dataResult.TotalRows = 0;
                    dataResult.msg = "Non authentifié";
                    dataResult.codeReponse = CodeReponseEnum.unauthorized;
                }
            }
            catch (Exception ex)
            {
                //On définit le retour avec le détail de l'erreur
                dataResult.codeReponse = CodeReponseEnum.error;
                dataResult.msg = (ex.InnerException == null) ? ex.Message : ex.InnerException.Message;
            }

            //localStorage.setItem("userData", userDtoJson);
            return dataResult;


        }

        public class RegisterDto
        {
            public string? Username { get; set; }
            public string Password { get; set; }
            public string? Prenom { get; set; }
            public string? Nom { get; set; }
            public string? Email { get; set; }
            public int? RoleId { get; set; }
            public int? serviceId { get; set; }
            public bool? isActif { get; set; } = true;

        }
    }
}
