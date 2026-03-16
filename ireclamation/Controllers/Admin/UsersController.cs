using System;
using System.Collections.Generic;
using System.Linq;
using System.Security.Cryptography;
using System.Text;
using System.Threading.Tasks;
using iReclamation.BuisnessLayers;
using iReclamation.Dtos;
using iReclamation.Models;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace iReclamation.Controllers.Admin
{
    [Route("api/[controller]")]
    [ApiController]
    public class UsersController : ControllerBase
    {
        private readonly UserService _userService;
        private readonly ApplicationDbContext _context;

        public UsersController(UserService userService, ApplicationDbContext context)
        {
            _userService = userService;
            _context = context;
        }

        [HttpGet]
        public async Task<ActionResult<IEnumerable<UsersDto>>> GetUsers()
        {
            var users = await _userService.GetUsersAsync();
            return Ok(users);
        }
        
        [HttpGet("RolesList")]
        public async Task<ActionResult<IEnumerable<Roles>>> GetRoles()
        {
            var rolesList = await _userService.GetRoles();
            return Ok(rolesList);
        }        
        [HttpGet("DashboardList")]
        public async Task<ActionResult<IEnumerable<Dashboard>>> GetDashboardList()
        {
            var DashboardsList = await _userService.GetDashboards();
            return Ok(DashboardsList);
        }
        [HttpGet("UserDashboard/{userId}")]
        public async Task<ActionResult<IEnumerable<Dashboard>>> GetDashboardsByUser(int userId)
        {
            var DashboardsList = await _userService.GetDashboardByUser(userId);
            return Ok(DashboardsList);
        }
        
        

        [HttpGet("{id}")]
        public async Task<ActionResult<UsersDto>> GetUser(int id)
        {
            var user = await _userService.GetUserByIdAsync(id);
            if (user == null)
            {
                return NotFound();
            }
            return Ok(user);
        }

        [HttpPost("disactivateUser")]
        public async Task<ActionResult> disactivateUser(int id)
        {
            var user = await _userService.GetUserByIdAsync(id);
            if (user != null)
            {
                _userService.DisactivateUser(id);
                return Ok(user);
            }

            return NotFound();


        }

        [HttpPost]
        public async Task<IActionResult> AddUser(AuthController.RegisterDto registerDto)
        {
            if (await _userService.UserExists(registerDto.Username)) return BadRequest("UserName Is Already Taken");

            var hmac = new HMACSHA512();


            var user = new Users()
            {
                Username = registerDto.Username,
                Prenom = registerDto.Prenom,
                Nom = registerDto.Nom,
                ServiceId = registerDto.serviceId ,
                IsActif = registerDto.isActif,
                RolesId = registerDto.RoleId,
                Email = registerDto.Email,
                PasswordHash = hmac.ComputeHash(Encoding.UTF8.GetBytes(registerDto.Password)),
                PasswordSalt = hmac.Key,
            };

           
            await _userService.AddUserAsync(user);
            return CreatedAtAction(nameof(GetUser), new { id = user.UserId }, user);
        }

        [HttpPut("resetPassword/{id}")]
        public async Task<IActionResult> resetPassword(int id, AuthController.RegisterDto registerDto)
        {
            var userDto =  _userService.resetPassword(id,registerDto);
            if (userDto != null)
            {
                return Ok(userDto);
            }
            return NotFound();
            
            
        }


        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateUser(int id, UsersDto user)
        {
            
            var userDto =  _userService.UpdateUserAsync(id,user);
            if (userDto != null)
            {
                return Ok(userDto);
            }
            return NotFound();
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteUser(int id)
        {
            var user = await _context.Users.FindAsync(id);
            if (user == null)
            {
                return NotFound();
            }

            _context.Users.Remove(user);
            await _context.SaveChangesAsync();

            return Ok(user);

        }
    }
}
