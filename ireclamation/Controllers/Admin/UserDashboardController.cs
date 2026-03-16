using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using AutoMapper;
using iReclamation.Dtos;
using iReclamation.Enums;
using iReclamation.Models;
using iReclamation.Utility.ApiResponse;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace iReclamation.Controllers.Admin
{
    [Route("api/[controller]")]
    [ApiController]
    public class UserDashboardController : ControllerBase
    {
        private readonly ApplicationDbContext _context;
        private readonly IMapper _mapper;


        public UserDashboardController(ApplicationDbContext context, IMapper mapper)
        {
            _context = context;
            _mapper = mapper;
        }
        
        [HttpPost()]
        public UserDashboard AddUserDashboard(UserDashboardDto userDashboardDto)
        {
            var userDashboard = _mapper.Map<UserDashboard>(userDashboardDto);
            _context.UserDashboard.Add(userDashboard);
            _context.SaveChanges();
            return userDashboard;
        }

        [HttpDelete("{userDashboardId}")]
        public async Task<DataSourceResult> RemoveUserDashboard(int userDashboardId)
        {
            DataSourceResult dataResult = new DataSourceResult();

            var userDashboard = _context.UserDashboard.FirstOrDefault(ud => ud.Id == userDashboardId );
            if (userDashboard != null)
            {
                _context.UserDashboard.Remove(userDashboard);
                _context.SaveChanges();
            }
            dataResult.msg = "Utilisateur dashboard disallowed";
            dataResult.codeReponse = CodeReponseEnum.ok;
            return dataResult;
        }
    }
}
