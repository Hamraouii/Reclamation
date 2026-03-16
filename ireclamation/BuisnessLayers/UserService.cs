using System.Security.Cryptography;
using System.Text;
using System.Text.Json;
using System.Text.Json.Serialization;
using AutoMapper;
using iReclamation.Controllers;
using iReclamation.Dtos;
using iReclamation.Models;
using Microsoft.EntityFrameworkCore;

namespace iReclamation.BuisnessLayers;

public class UserService
{
    private readonly ApplicationDbContext _context;
    private readonly IMapper _mapper; // Inject IMapper

    

    public UserService(ApplicationDbContext context, IMapper imapper)
    {
        _context = context;
        _mapper = imapper;

    }

    public async Task<IEnumerable<UsersDto>> GetUsersAsync()
    {
        var users =  await _context.Users.Include(x=>x.Roles)
            .Include(x=>x.UserDashboards)
            .Include(x=>x.Service).ToListAsync();
        var usersDto = _mapper.Map<List<UsersDto>>(users);
        // return JsonSerializer.Serialize(users, _jsonSerializerOptions);
        return usersDto;

    }

    public async Task<UsersDto> GetUserByIdAsync(int id)
    {
        var user = await _context.Users.Include(x=>x.UserDashboards).FirstOrDefaultAsync(x=>x.UserId ==id);
        var userDto = _mapper.Map<UsersDto>(user);
        return userDto;
    }
    
    public async Task<List<Roles>> GetRoles()
    {
        return await _context.Roles.ToListAsync();
    }
    
    public async Task<List<Dashboard>> GetDashboards()
    {
        return await _context.Dashboard.ToListAsync();
    }    
    public async Task<List<UserDashboardDto>> GetDashboardByUser(int userId)
    {
        var dashs = _context.UserDashboard.ToList();
        var userDashboard = await _context.UserDashboard.Where(x=>x.UserId == userId).ToListAsync();
        var userDashboardDto = _mapper.Map<List<UserDashboardDto>>(userDashboard);
        foreach (var userDash in userDashboardDto)
        {
            var user = _context.Users.Find(userDash.UserId);
            var dashboard = _context.Dashboard.Find(userDash.DashboardId);

            userDash.UserName = user.Nom + ' '+ user.Prenom;
            userDash.DashboardName = dashboard.DisplayName;
        }
        return userDashboardDto;
    }
    

    
    public async Task AddUserAsync(Users user)
    {
        _context.Users.Add(user);
        await _context.SaveChangesAsync();
    }
    
    public async Task DisactivateUser(int id)
    {
        var user = _context.Users.FirstOrDefault(w=>w.UserId == id);
        user.IsActif = false;
        await _context.SaveChangesAsync();
    }
    
    public async Task<bool> UserExists(string username)
    {
        return await _context.Users.AnyAsync(x => x.Username == username.ToLower());
    }

    public UsersDto resetPassword(int userId,AuthController.RegisterDto registerDto)
    {
        var userInDb = _context.Users.Find(userId);
        var hmac = new HMACSHA512();

        if (userInDb != null)
        {
            userInDb.PasswordHash = hmac.ComputeHash(Encoding.UTF8.GetBytes(registerDto.Password));
            userInDb.PasswordSalt = hmac.Key;
            _context.SaveChanges();
            var userDto = _mapper.Map<UsersDto>(userInDb);
            return userDto;
        }
        else
        {
            return null;
        }
        
    }
    
    public UsersDto UpdateUserAsync(int userId,UsersDto userDto)
    {
        var userInDb = _context.Users.Find(userId);
        if (userInDb != null)
        {
            _mapper.Map(userDto, userInDb);
            _context.SaveChanges();
            return userDto;
        }
        else
        {
            return null;
        }
        
    }

    public async Task DeleteUserAsync(int id)
    {
        var user = _context.Users.Find(id);
        _context.Users.Remove(user); 
        _context.SaveChanges();
    }
}