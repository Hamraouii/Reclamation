using System;
using System.Collections.Generic;
using System.Linq;
using System.Security.Claims;
using System.Text.Json;
using System.Threading.Tasks;
using AutoMapper;
using iReclamation.DashboardClass;
using iReclamation.Dtos;
using iReclamation.Enums;
using iReclamation.Models;
using iReclamation.Utility.ApiResponse;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using OfficeOpenXml;
using PuppeteerSharp;
using Wkhtmltopdf.NetCore;
using File = iReclamation.Models.File;

namespace iReclamation.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class ReclamationsController : ControllerBase
    {
        private readonly ApplicationDbContext _context;
        
        private readonly IMapper _mapper; // Inject IMapper
        private readonly IConfiguration _configuration;
        private readonly HttpContext _HttpContext;
        private readonly IGeneratePdf _generatePdf;

        public ReclamationsController(ApplicationDbContext context,IHttpContextAccessor httpContextAccessor, IMapper mapper,IConfiguration configuration, IGeneratePdf generatePdf)
        {
            _context = context;
            _mapper = mapper;
            _configuration = configuration;
            _HttpContext = httpContextAccessor.HttpContext;
            _generatePdf = generatePdf;
        }

        // GET: api/Reclamations
        [HttpGet]
        public async Task<ActionResult<IEnumerable<ReclamationDto>>> GetReclamations()
        {
            var sidClaim = HttpContext.User.Claims.FirstOrDefault(c => c.Type == ClaimTypes.PrimarySid);
            var serviceId = 0;
            if (!string.IsNullOrEmpty(sidClaim.Value))
            {
                serviceId = int.Parse(sidClaim.Value);
            }

            var reclamations = await _context.Reclamations
                .Include(x=>x.Adherent)
                .Include(x=>x.TypeReclamations)
                .Include(x=>x.Sources)
                .Include(x=>x.Services)
                .Include(x=>x.User)
                .Include(x=>x.EtatReclamation)
                .Include(x=>x.File)
                .Where(x=>x.isDeleted == false).ToListAsync();
            if (serviceId != null && serviceId != 0)
            {
                reclamations = reclamations.Where(x => x.ServicesId != null && x.ServicesId == serviceId).ToList();
            }
            var reclamationsDto = _mapper.Map<List<ReclamationDto>>(reclamations);
            foreach (var reclamation in reclamationsDto)
            {
                reclamation.DateReceptionString = reclamation.DateReception.Value.ToString("yyyy-MM-dd");
                var userCreated = _context.Users.FirstOrDefault(x => x.UserId == reclamation.UserId);
                reclamation.createdBy = userCreated != null ? userCreated.Nom + userCreated.Prenom : ""; 
                var lastUserTreated =_context.HistoriqueReclamation
                    .Include(x=>x.user)
                    .Where(x => x.ReclamationsId == reclamation.Id)
                    .OrderByDescending(x => x.DateDeffet)
                    .FirstOrDefault();
                reclamation.LastUserTreated = lastUserTreated != null ? lastUserTreated.user.Nom : "";
            }
            return reclamationsDto;
        }
        
        [HttpGet("getTopReclamations")]
        public async Task<ActionResult<IEnumerable<ReclamationDto>>> GetTopReclamations()
        {
            var sidClaim = HttpContext.User.Claims.FirstOrDefault(c => c.Type == ClaimTypes.PrimarySid);
            var serviceId = 0;
            if (!string.IsNullOrEmpty(sidClaim.Value))
            {
                serviceId = int.Parse(sidClaim.Value);
            }

            var reclamations = await _context.Reclamations
                .Include(x=>x.Adherent)
                .Include(x=>x.TypeReclamations)
                .Include(x=>x.Sources)
                .Include(x=>x.Services)
                .Include(x=>x.User)
                .Include(x=>x.EtatReclamation)
                .Include(x=>x.File)
                .OrderByDescending(x => x.DateCreation)
                .Take(100)
                .Where(x=>x.isDeleted == false)
                .ToListAsync();
            if (serviceId != null && serviceId != 0)
            {
                reclamations = reclamations.Where(x => x.ServicesId != null && x.ServicesId == serviceId).ToList();
            }
            var reclamationsDto = _mapper.Map<List<ReclamationDto>>(reclamations);
            foreach (var reclamation in reclamationsDto)
            {
                reclamation.DateReceptionString = reclamation.DateReception.Value.ToString("yyyy-MM-dd");
                var userCreated = _context.Users.FirstOrDefault(x => x.UserId == reclamation.UserId);
                reclamation.createdBy = userCreated != null ? userCreated.Nom + userCreated.Prenom : ""; 
                var lastUserTreated =_context.HistoriqueReclamation
                    .Include(x=>x.user)
                    .Where(x => x.ReclamationsId == reclamation.Id)
                    .OrderByDescending(x => x.DateDeffet)
                    .FirstOrDefault();
                reclamation.LastUserTreated = lastUserTreated != null ? lastUserTreated.user.Nom : "";
            }
            return reclamationsDto;
        }

        [HttpPost("getReclamationCountByEtat")]
        public async Task<List<RecByEtat>> GetReclamationCountByEtat([FromBody] filterReclamation filter)
        {
            var sidClaim = HttpContext.User.Claims.FirstOrDefault(c => c.Type == ClaimTypes.PrimarySid);
            var serviceId = 0;
            if (!string.IsNullOrEmpty(sidClaim.Value))
            {
                serviceId = int.Parse(sidClaim.Value);
            }

            var reclamationall = _context.Reclamations
                .Include(x => x.EtatReclamation)
                .Where(r =>
                    r.DateCreation >= filter.DateDebut &&
                    r.DateCreation <= filter.DateEnd &&
                    filter.SourceId.Contains(r.SourcesId));
            if (serviceId != null && serviceId != 0)
            {
                reclamationall = reclamationall.Where(x => x.ServicesId != null && x.ServicesId == serviceId);
            }

            var reclamationallCount = reclamationall.Count();
            
            // Query to group reclamations by EtatReclamationId and count the number of reclamations in each group
            var reclamationCountQuery =  _context.Reclamations
                .Include(x => x.EtatReclamation)
                .Where(x => x.isDeleted == false)
                .Where(r =>
                    r.DateCreation >= filter.DateDebut &&
                    r.DateCreation <= filter.DateEnd &&
                    filter.SourceId.Contains(r.SourcesId));
            
            if (serviceId != null && serviceId != 0)
            {
                reclamationCountQuery = reclamationCountQuery.Where(x => x.ServicesId != null && x.ServicesId == serviceId);
            }
            var reclamationCounts =await reclamationCountQuery
                .GroupBy(r => r.EtatReclamation.Libelle)
                .Select(g => new RecByEtat() 
                    { EtatName = g.Key,
                        RecCount = g.Count(),
                        TauxRec = ( g.Count() / reclamationallCount ) * 100
                    })
                .ToListAsync();
            
            return reclamationCounts;
        }
        
        [HttpPost("getReclamationCountByService")]
        public async Task<List<RecByService>> GetReclamationsCountByService([FromBody] filterReclamation filter)
        {
            // Query to join Reclamations with Services, group by ServiceId,
            // and count the total number of reclamations and the number of reclamations with EtatReclamationId = 2
            var sidClaim = HttpContext.User.Claims.FirstOrDefault(c => c.Type == ClaimTypes.PrimarySid);
            var serviceId = 0;
            if (!string.IsNullOrEmpty(sidClaim.Value))
            {
                serviceId = int.Parse(sidClaim.Value);
            }

            var reclamationCountQuery =  _context.Reclamations
                .Include(x=>x.Services)
                .Where(x => x.isDeleted == false)
                .Where(r =>
                    r.DateCreation >= filter.DateDebut &&
                    r.DateCreation <= filter.DateEnd &&
                    filter.SourceId.Contains(r.SourcesId));
            
            if (serviceId != null && serviceId != 0)
            {
                reclamationCountQuery = reclamationCountQuery.Where(x => x.ServicesId != null && x.ServicesId == serviceId);
            }
            
            var reclamationCounts =await reclamationCountQuery
                .GroupBy(r => r.Services.Libelle)
                .Select(g => new RecByService()
                {
                    ServiceId = g.Key,
                    TotalReclamations = g.Count(),
                    ReclamationsCloture = g.Count(r => r.EtatReclamationId == 2),
                    Percentage = (double)g.Count(r => r.EtatReclamationId == 2) / g.Count() * 100
                })
                .ToListAsync();

            // Convert the result to a list of tuples
            
        
            return reclamationCounts;
        }
        
        [HttpPost("GetReclamationsByAffectedBy")]
        public async Task<List<ReclamationDto>> GetReclamationsByAffectedBy([FromBody] filterReclamation filter)
        {
            var sidClaim = HttpContext.User.Claims.FirstOrDefault(c => c.Type == ClaimTypes.PrimarySid);
            var serviceId = 0;
            if (!string.IsNullOrEmpty(sidClaim.Value))
            {
                serviceId = int.Parse(sidClaim.Value);
            }

            var affectActionId = _configuration.GetValue<int>("ActionIds:Affecté");
            // Query the HistoriqueReclamation table to get the ReclamationsIds for the given userId
            var reclamationsIds = await _context.HistoriqueReclamation
                .Include(x=>x.user)
                .Where(hr => hr.userId == filter.UserId && hr.ActionId == affectActionId)
                .Select(hr => hr.ReclamationsId)
                .ToListAsync();

            // Query the Reclamations table to get the reclamations with ReclamationsIds obtained above
            var reclamationsQuery =  _context.Reclamations
                .Include(r => r.HistoriqueReclamation)
                .Include(x => x.Adherent)
                .Include(x => x.Services)
                .Include(x => x.Sources)
                .Include(x => x.User)
                .Include(x => x.EtatReclamation)
                .Where(x => x.isDeleted == false)
                .Where(r => reclamationsIds.Contains(r.Id));
            
            if (serviceId != null && serviceId != 0)
            {
                reclamationsQuery = reclamationsQuery.Where(x => x.ServicesId != null && x.ServicesId == serviceId);
            }

            var reclamations =await reclamationsQuery.ToListAsync();
                
            if (filter.DateDebut.HasValue)
            {
                reclamations = reclamations.Where(reclamationId =>
                    reclamationId.DateReception >= filter.DateDebut.Value).ToList();
            }

            if (filter.DateEnd.HasValue)
            {
                reclamations = reclamations.Where(reclamationId =>
                    reclamationId.DateReception <= filter.DateEnd.Value).ToList();
                
            }

            if (filter.serviceId.HasValue)
            {
                reclamations = reclamations.Where(reclamationId =>
                    reclamationId.ServicesId == filter.serviceId.Value).ToList();
            }

            if (filter.SourceId.Count > 0)
            {
                reclamations = reclamations.Where(r =>
                    filter.SourceId.Contains(r.SourcesId)).ToList();
           
            }
            var reclamationsDto = _mapper.Map<List<ReclamationDto>>(reclamations);
            
            foreach (var reclamation in reclamationsDto)
            {
                reclamation.DateReceptionString = reclamation.DateReception.Value.ToString("yyyy-MM-dd");
                var userCreated = _context.Users.FirstOrDefault(x => x.UserId == reclamation.UserId);
                reclamation.createdBy = userCreated != null ? userCreated.Nom + userCreated.Prenom : ""; 
                var lastUserTreated =_context.HistoriqueReclamation
                    .Include(x=>x.user)
                    .Where(x => x.ReclamationsId == reclamation.Id)
                    .OrderByDescending(x => x.DateDeffet)
                    .FirstOrDefault();
                reclamation.LastUserTreated = lastUserTreated.user.Nom;
            }

            return reclamationsDto;
        }
        
        [HttpPost("GetReclamationsByMACBy")]
        public async Task<List<ReclamationDto>> GetReclamationsByMACBy([FromBody] filterReclamation filter)
        {
            var sidClaim = HttpContext.User.Claims.FirstOrDefault(c => c.Type == ClaimTypes.PrimarySid);
            var serviceId = 0;
            if (!string.IsNullOrEmpty(sidClaim.Value))
            {
                serviceId = int.Parse(sidClaim.Value);
            }
            
            var affectActionId = _configuration.GetValue<int>("ActionIds:MAC");
            // Query the HistoriqueReclamation table to get the ReclamationsIds for the given userId
            var reclamationsIds = await _context.HistoriqueReclamation
                .Where(hr => hr.userId == filter.UserId && hr.ActionId == affectActionId)
                
                .ToListAsync();

            // Query the Reclamations table to get the reclamations with ReclamationsIds obtained above
            
            
            if (filter.DateDebut.HasValue)
            {
                reclamationsIds = reclamationsIds.Where(reclamationId =>
                    reclamationId.DateDeffet >= filter.DateDebut.Value).ToList();
            }

            if (filter.DateEnd.HasValue)
            {
                reclamationsIds = reclamationsIds.Where(reclamationId =>
                    reclamationId.DateDeffet <= filter.DateEnd.Value).ToList();
                
            }

            var reclamationfiltredIds = reclamationsIds.Select(hr => hr.ReclamationsId).ToList();

               

            var reclamationsQuery =  _context.Reclamations
                .Include(r => r.HistoriqueReclamation)
                .Include(x => x.Adherent)
                .Include(x => x.Services)
                .Include(x => x.Sources)
                .Include(x => x.User)
                .Include(x=>x.EtatReclamation)
                .Where(x => x.isDeleted == false)
                .Where(r => reclamationfiltredIds.Contains(r.Id));
            
            if (serviceId != null && serviceId != 0)
            {
                reclamationsQuery = reclamationsQuery.Where(x => x.ServicesId != null && x.ServicesId == serviceId);
            }

            var reclamations =await reclamationsQuery.ToListAsync();
            
            if (filter.serviceId.HasValue)
            {
                reclamations = reclamations.Where(reclamationId =>
                    reclamationId.ServicesId == filter.serviceId.Value).ToList();
            }

            if (filter.SourceId.Count > 0)
            {
                reclamations = reclamations.Where(r =>
                    filter.SourceId.Contains(r.SourcesId)).ToList();
           
            }
            
            var reclamationsDto = _mapper.Map<List<ReclamationDto>>(reclamations);
            
            foreach (var reclamation in reclamationsDto)
            {
                reclamation.DateReceptionString = reclamation.DateReception.Value.ToString("yyyy-MM-dd");
                var userCreated = _context.Users.FirstOrDefault(x => x.UserId == reclamation.UserId);
                reclamation.createdBy = userCreated != null ? userCreated.Nom + userCreated.Prenom : ""; 
                var lastUserTreated =_context.HistoriqueReclamation
                    .Include(x=>x.user)
                    .Where(x => x.ReclamationsId == reclamation.Id)
                    .OrderByDescending(x => x.DateDeffet)
                    .FirstOrDefault();
                reclamation.LastUserTreated = lastUserTreated.user.Nom;
            }

            return reclamationsDto;
        }
        
        [HttpPost("GetReclamationsByCreatedBy")]
        public async Task<List<ReclamationDto>> GetReclamationsByCreatedBy([FromBody] filterReclamation filter)
        {
            var sidClaim = HttpContext.User.Claims.FirstOrDefault(c => c.Type == ClaimTypes.PrimarySid);
            var serviceId = 0;
            if (!string.IsNullOrEmpty(sidClaim.Value))
            {
                serviceId = int.Parse(sidClaim.Value);
            }
            
            var affectActionId = _configuration.GetValue<int>("ActionIds:Crée");
            // Query the HistoriqueReclamation table to get the ReclamationsIds for the given userId
            var reclamationsIds = await _context.HistoriqueReclamation
                .Where(hr => hr.userId == filter.UserId && hr.ActionId == affectActionId)
                .Select(hr => hr.ReclamationsId)
                .ToListAsync();

            
            // Query the Reclamations table to get the reclamations with ReclamationsIds obtained above
            var reclamationsQuery = _context.Reclamations
                .Include(x => x.Adherent)
                .Include(x => x.Services)
                .Include(x => x.Sources)
                .Include(x => x.User)
                .Include(x => x.EtatReclamation)
                .Include(r => r.HistoriqueReclamation)
                .Where(x => x.isDeleted == false)
                .Where(r => reclamationsIds.Contains(r.Id));
            
            if (serviceId != null && serviceId != 0)
            {
                reclamationsQuery = reclamationsQuery.Where(x => x.ServicesId != null && x.ServicesId == serviceId);
            }

            var reclamations =await reclamationsQuery.ToListAsync();
            
            if (filter.DateDebut.HasValue)
            {
                reclamations = reclamations.Where(reclamationId =>
                    reclamationId.DateReception >= filter.DateDebut.Value).ToList();
            }

            if (filter.DateEnd.HasValue)
            {
                reclamations = reclamations.Where(reclamationId =>
                    reclamationId.DateReception <= filter.DateEnd.Value).ToList();
                
            }

            if (filter.serviceId.HasValue)
            {
                reclamations = reclamations.Where(reclamationId =>
                    reclamationId.ServicesId == filter.serviceId.Value).ToList();
            }

            if (filter.SourceId.Count > 0 )
            {
                reclamations = reclamations.Where(r =>
                    filter.SourceId.Contains(r.SourcesId)).ToList();
           
            }

            
            var reclamationsDto = _mapper.Map<List<ReclamationDto>>(reclamations);
            
            foreach (var reclamation in reclamationsDto)
            {
                reclamation.DateReceptionString = reclamation.DateReception.Value.ToString("yyyy-MM-dd");
                var userCreated = _context.Users.FirstOrDefault(x => x.UserId == reclamation.UserId);
                reclamation.createdBy = userCreated != null ? userCreated.Nom + userCreated.Prenom : ""; 
                var lastUserTreated =_context.HistoriqueReclamation
                    .Include(x=>x.user)
                    .Where(x => x.ReclamationsId == reclamation.Id)
                    .OrderByDescending(x => x.DateDeffet)
                    .FirstOrDefault();
                reclamation.LastUserTreated = lastUserTreated.user.Nom;
            }

            return reclamationsDto;
        }
        
        [HttpPost("GetReclamationsByRegion")]
        public async Task<List<ReclamationDto>> GetReclamationsByRegion([FromBody] filterReclamation filter)
        {
            var sidClaim = HttpContext.User.Claims.FirstOrDefault(c => c.Type == ClaimTypes.PrimarySid);
            var serviceId = 0;
            if (!string.IsNullOrEmpty(sidClaim.Value))
            {
                serviceId = int.Parse(sidClaim.Value);
            }

            var reclamationsQuery =  _context.Reclamations
                .Include(x=>x.Adherent)
                .Include(x=>x.User)
                .Include(x=>x.Sources)
                .Include(x=>x.Services)
                .Include(x=>x.EtatReclamation)
                .Where(x => x.isDeleted == false)
                .Where(r => r.Adherent.RegionId == filter.regionId);
            
            if (serviceId != null && serviceId != 0)
            {
                reclamationsQuery = reclamationsQuery.Where(x => x.ServicesId != null && x.ServicesId == serviceId);
            }

            var reclamations =await reclamationsQuery.ToListAsync();

            var reclamationsDto = _mapper.Map<List<ReclamationDto>>(reclamations);
            
            foreach (var reclamation in reclamationsDto)
            {
                reclamation.DateReceptionString = reclamation.DateReception.Value.ToString("yyyy-MM-dd");
                var userCreated = _context.Users.FirstOrDefault(x => x.UserId == reclamation.UserId);
                reclamation.createdBy = userCreated.Nom + userCreated.Prenom; 
                var lastUserTreated =_context.HistoriqueReclamation
                    .Include(x=>x.user)
                    .Where(x => x.ReclamationsId == reclamation.Id)
                    .OrderByDescending(x => x.DateDeffet)
                    .FirstOrDefault();
                reclamation.LastUserTreated = lastUserTreated.user != null ? lastUserTreated.user.Nom : "";
            }

            return reclamationsDto;
            
        }
        
        [HttpPost("GetReclamationCountsByTimePeriod")]
        public async Task<List<RecCountByPeriod>> GetReclamationCountsByTimePeriod()
        {
            var sidClaim = HttpContext.User.Claims.FirstOrDefault(c => c.Type == ClaimTypes.PrimarySid);
            var serviceId = 0;
            if (!string.IsNullOrEmpty(sidClaim.Value))
            {
                serviceId = int.Parse(sidClaim.Value);
            }
            
            DateTime currentDate = DateTime.Now;
            DateTime oneMonthAgo = currentDate.AddMonths(-1);
            DateTime twoMonthsAgo = currentDate.AddMonths(-2);

            var reclamationCountQuery =  _context.Reclamations.AsQueryable()
            .Where(x => x.isDeleted == false);
            if (serviceId != null && serviceId != 0)
            {
                reclamationCountQuery = reclamationCountQuery.Where(x => x.ServicesId != null && x.ServicesId == serviceId);
            }

            var reclamationCounts =await reclamationCountQuery
                .GroupBy(r => r.ServicesId)
                .Select(g => new RecCountByPeriod()
                {
                    ServiceName = _context.Services.First(x => x.Id == g.Key.Value).Libelle,
                    LessThanOneMonth = g.Count(r => r.DateReception > oneMonthAgo),
                    BetweenOneAndTwoMonths =
                        g.Count(r => r.DateReception <= oneMonthAgo && r.DateReception > twoMonthsAgo),
                    MoreThanTwoMonths = g.Count(r => r.DateReception <= twoMonthsAgo)
                })
                .ToListAsync();

            return reclamationCounts;
        }
        
        
        
        [HttpPost("getReclamationCountByType")]
        public async Task<List<RecByTypeRec>> GetReclamationsCountByType([FromBody] filterReclamation filter)
        {
            // Query to join Reclamations with Services, group by ServiceId,
            // and count the total number of reclamations and the number of reclamations with EtatReclamationId = 2
            var sidClaim = HttpContext.User.Claims.FirstOrDefault(c => c.Type == ClaimTypes.PrimarySid);
            var serviceId = 0;
            if (!string.IsNullOrEmpty(sidClaim.Value))
            {
                serviceId = int.Parse(sidClaim.Value);
            }

            var reclamation = await _context.Reclamations
                .Include(x => x.TypeReclamations)
                .Where(x => x.isDeleted == false)
                .Where(r =>
                    r.DateCreation >= filter.DateDebut &&
                    r.DateCreation <= filter.DateEnd).ToListAsync();
            
            if (serviceId != null && serviceId != 0)
            {
                reclamation.Where(x => x.ServicesId != null && x.ServicesId == serviceId);
            }
            
            if (filter.SourceId != null)
            {
                reclamation.Where(r => filter.SourceId.Contains(r.SourcesId));
            }
            
            var reclamationCounts =  reclamation
                .GroupBy(r => r.TypeReclamations.Libelle)
                .Select(g => new RecByTypeRec()
                {
                    TypeReclamation = g.Key,
                    TotalReclamations = g.Count(),
                    ReclamationsCloture = g.Count(r => r.EtatReclamationId == 2),
                    Percentage = (double)g.Count(r => r.EtatReclamationId == 2) / g.Count() * 100
                })
                .ToList();

            

            // Convert the result to a list of tuples
            
        
            return reclamationCounts;
        }
        
        [HttpPost("getReclamationByDossier")]
        public async Task<List<ReclamationDto>> GetReclamationsByDossier([FromBody] filterReclamation filter)
        {
            var sidClaim = HttpContext.User.Claims.FirstOrDefault(c => c.Type == ClaimTypes.PrimarySid);
            var serviceId = 0;
            if (!string.IsNullOrEmpty(sidClaim.Value))
            {
                serviceId = int.Parse(sidClaim.Value);
            }
            var reclamations = await _context.Reclamations
                .Include(x=>x.Dossiers)
                .Include(x=>x.Adherent)
                .Include(x=>x.User)
                .Include(x=>x.Sources)
                .Include(x=>x.Services)
                .Include(x=>x.EtatReclamation)
                .Where(x => x.isDeleted == false)
                .Where(r => r.Dossiers.Any(d => d.Annee_dossier == filter.AnneeDossier 
                                                && d.EtatDossierId == filter.EtatDossierId ))
                .ToListAsync();

            if (serviceId != null && serviceId != 0)
            {
                reclamations.Where(x => x.ServicesId != null && x.ServicesId == serviceId);
            }
            
            if (filter.DateDebut.HasValue && filter.DateEnd.HasValue)
            {
                reclamations.Where(r => r.DateReception >= filter.DateDebut && r.DateReception <= filter.DateEnd);
            }

            var reclamationsDto = _mapper.Map<List<ReclamationDto>>(reclamations);
            
            foreach (var reclamation in reclamationsDto)
            {
                reclamation.DateReceptionString = reclamation.DateReception.Value.ToString("yyyy-MM-dd");
                var userCreated = _context.Users.FirstOrDefault(x => x.UserId == reclamation.UserId);
                reclamation.createdBy = userCreated != null ? userCreated.Nom + userCreated.Prenom : ""; 
                var lastUserTreated =_context.HistoriqueReclamation
                    .Include(x=>x.user)
                    .Where(x => x.ReclamationsId == reclamation.Id)
                    .OrderByDescending(x => x.DateDeffet)
                    .FirstOrDefault();
                reclamation.LastUserTreated = lastUserTreated.user.Nom;
            }

            return reclamationsDto;

        }
        
        [HttpPost("getCountReclamation")]
        public async Task<int> getCountReclamation([FromBody] filterReclamation filter)
        {
            var sidClaim = HttpContext.User.Claims.FirstOrDefault(c => c.Type == ClaimTypes.PrimarySid);
            var serviceId = 0;
            if (!string.IsNullOrEmpty(sidClaim.Value))
            {
                serviceId = int.Parse(sidClaim.Value);
            }
            
            var reclamations = await _context.Reclamations
                .Where(x => x.isDeleted == false)
                .ToListAsync();
            
            if (serviceId != null && serviceId != 0)
            {
                reclamations = reclamations.Where(x => x.ServicesId != null && x.ServicesId == serviceId).ToList();
            }
            
            if (filter.DateDebut.HasValue)
            {
                reclamations = reclamations.Where(reclamationId =>
                    reclamationId.DateReception >= filter.DateDebut.Value).ToList();
            }

            if (filter.DateEnd.HasValue)
            {
                reclamations = reclamations.Where(reclamationId =>
                    reclamationId.DateReception <= filter.DateEnd.Value).ToList();
                
            }

            if (filter.serviceId.HasValue)
            {
                reclamations = reclamations.Where(reclamationId =>
                    reclamationId.ServicesId == filter.serviceId.Value).ToList();
            }

            if (filter.SourceId.Count > 0 )
            {
                reclamations = reclamations.Where(r =>
                    filter.SourceId.Contains(r.SourcesId)).ToList();
           
            }

            
            

            return reclamations.Count;

        }
        
        [HttpPost("getReclamationwithFilter")]
        public async Task<ActionResult<List<ReclamationDto>>> GetReclamationsWithFiltersAsync([FromBody] filterReclamation filter)
        {
            if (filter == null)
            {
                return BadRequest("Filter cannot be null");
            }
            
            
            var sidClaim = HttpContext.User.Claims.FirstOrDefault(c => c.Type == ClaimTypes.PrimarySid);
            var serviceId = 0;
            if (!string.IsNullOrEmpty(sidClaim.Value))
            {
                serviceId = int.Parse(sidClaim.Value);
            }
            
            var query = _context.Reclamations
                .Include(x=>x.Adherent)
                .Include(x=>x.User)
                .Include(x=>x.Sources)
                .Include(x=>x.Services)
                .Include(x=>x.EtatReclamation)
                .Where(x => x.isDeleted == false)
                .AsQueryable();

            // Apply filters based on the provided parameters
            if (!string.IsNullOrEmpty(filter.TypeDate) && filter.DateDebut.HasValue && filter.DateEnd.HasValue)
            {
                
                
                switch (filter.TypeDate)
                {
                    case "DCL":
                        query = query.Where(r => r.DateCloture >= filter.DateDebut && r.DateCloture <= filter.DateEnd);
                        break;
                    case "DR":
                        query = query.Where(r => r.DateReception >= filter.DateDebut && r.DateReception <= filter.DateEnd);
                        break;
                    case "DCR":
                        query = query.Where(r => r.DateCreation >= filter.DateDebut && r.DateCreation <= filter.DateEnd);
                        break;
                    default:
                        throw new ArgumentException("Invalid date filter type specified.");
                }
            }

            if (filter.SourceId != null && filter.SourceId.Count > 0)
            {
                query = query.Where(r => filter.SourceId.Contains(r.SourcesId));
            }
            
            if (filter.EtatReclamationId.HasValue)
            {
                query = query.Where(r => r.EtatReclamationId == filter.EtatReclamationId);
            }
            
            if (serviceId != null && serviceId != 0)
            {
                query = query.Where(x => x.ServicesId != null && x.ServicesId == serviceId);
            }
            
            if (filter.serviceId.HasValue )
            {
                query = query.Where(x => x.ServicesId != null && x.ServicesId == filter.serviceId);
            }
            
            if (!string.IsNullOrEmpty(filter.Reference) )
            {
                query = query.Where(x => x.Reference != null && x.Reference == filter.Reference);
            }
            if (filter.Id.HasValue )
            {
                query = query.Where(x => x.Id != null && x.Id == filter.Id);
            }
            

            var reclamations = query.ToList();
            
            var reclamationsDto = _mapper.Map<List<ReclamationDto>>(reclamations);
            
            foreach (var reclamation in reclamationsDto)
            {
                reclamation.DateReceptionString = reclamation.DateReception.Value.ToString("yyyy-MM-dd");
                var userCreated = _context.Users.FirstOrDefault(x => x.UserId == reclamation.UserId);
                reclamation.createdBy = userCreated != null ? userCreated.Nom + userCreated.Prenom : ""; 
                var lastUserTreated =_context.HistoriqueReclamation
                    .Include(x=>x.user)
                    .Where(x => x.ReclamationsId == reclamation.Id)
                    .OrderByDescending(x => x.DateDeffet)
                    .FirstOrDefault();
                reclamation.LastUserTreated = lastUserTreated != null ? lastUserTreated.user.Nom : "";
            }


            return reclamationsDto;
        }
        
    

// GET: api/Reclamations/5
        [HttpGet("{id}")]
        public async Task<ActionResult<ReclamationDto>> GetReclamation(int id)
        {
            var reclamation =  _context
                .Reclamations
                .Include(x=>x.Adherent)
                .Include(x=>x.Sources)
                .Include(x=>x.Services)
                .Include(x=>x.EtatReclamation)
                .Include(x=>x.TypeReclamations)
                .FirstOrDefault(x=>x.Id == id);
            
            

            if (reclamation == null)
            {
                return NotFound();
            }

            var reclamationDto = _mapper.Map<ReclamationDto>(reclamation);
            reclamationDto.DateReceptionString = reclamationDto.DateReception.Value.ToString("yyyy-MM-dd");
            var userCreated = _context.Users.FirstOrDefault(x => x.UserId == reclamationDto.UserId);
            reclamationDto.createdBy = userCreated != null ? userCreated.Nom + userCreated.Prenom : ""; 
            var lastUserTreated =_context.HistoriqueReclamation
                .Include(x=>x.user)
                .Where(x => x.ReclamationsId == id)
                .OrderByDescending(x => x.DateDeffet)
                .FirstOrDefault();
            reclamationDto.LastUserTreated = lastUserTreated.user.Nom;
            return reclamationDto;
        }
        
        // GET: api/Reclamations/5
        [HttpGet("ReclamationHistory/{id}")]
        public async Task<ActionResult<ReclamationDto>> GetReclamationwithHistory(int id)
        {
            var reclamation =  _context.Reclamations
                .Include(x=>x.User)
                .Include(x=>x.HistoriqueReclamation).ThenInclude(h=>h.user)
                .FirstOrDefault(x=>x.Id == id);

            if (reclamation == null)
            {
                return NotFound();
            }

            var reclamationDto = _mapper.Map<ReclamationDto>(reclamation);
            
            reclamationDto.DateReceptionString = reclamationDto.DateReception.Value.ToString("yyyy-MM-dd");
            var userCreated = _context.Users.FirstOrDefault(x => x.UserId == reclamationDto.UserId);
            reclamationDto.createdBy = userCreated != null ? userCreated.Nom +" " + userCreated.Prenom : ""; 
            var lastUserTreated =_context.HistoriqueReclamation
                .Include(x=>x.user)
                .Where(x => x.ReclamationsId == id)
                .OrderByDescending(x => x.DateDeffet)
                .FirstOrDefault();
            reclamationDto.LastUserTreated = lastUserTreated.user.Nom;
            
            return reclamationDto;
        }

        // POST: api/Reclamations
        [HttpPost]
        public async Task<ActionResult<ReclamationDto>> PostReclamation(ReclamationDto reclamationDto)
        {
            var EtatCreated = _configuration.GetSection("EtatCreated").Value;
            var EtatCloture = _configuration.GetSection("EtatCloture").Value;
            var isAffectedinCreation = reclamationDto.ServicesId != null ? true : false;
            var sidClaim = HttpContext.User.Claims.FirstOrDefault(c => c.Type == ClaimTypes.Sid);
            var ServiceClaim = HttpContext.User.Claims.FirstOrDefault(c => c.Type == ClaimTypes.PrimarySid);
            
            reclamationDto.EtatReclamationId = int.Parse(EtatCreated);
            reclamationDto.UserId =  int.Parse(sidClaim.Value);
            reclamationDto.DateCreation = DateTime.Now;
            reclamationDto.isDeleted = false;
            if (reclamationDto.Reponse != null)
            {
                reclamationDto.ServicesId = int.Parse(ServiceClaim.Value);
                reclamationDto.EtatReclamationId = int.Parse(EtatCloture);
            }
            var reclamation = _mapper.Map<Reclamations>(reclamationDto);
            _context.Reclamations.Add(reclamation);
            await _context.SaveChangesAsync(); // Save changes to generate the ID

            // Retrieve the generated Reclamations ID
            int generatedReclamationId = reclamation.Id;
            var newHistory = new HistoriqueReclamation()
            {
                DateDeffet = DateTime.Now,
                ActionId = 1,
                Etat = "Crée",
                ReclamationsId = generatedReclamationId,
                Reponse = reclamationDto.Reponse,
                userId =  int.Parse(sidClaim.Value)
            };
            _context.HistoriqueReclamation.Add(newHistory);
            
            if (reclamationDto.Reponse != null)
            {
                var newHistoryCloture = new HistoriqueReclamation()
                {
                    DateDeffet = DateTime.Now,
                    ActionId = 3,
                    Etat = "Cloture ",
                    ReclamationsId = reclamation.Id,
                    Reponse = reclamationDto.Reponse,
                    userId = int.Parse(sidClaim.Value)
                };
                _context.HistoriqueReclamation.Add(newHistoryCloture);
            }
            if (isAffectedinCreation == true)
            {
                var service = _context.Services.Find(reclamationDto.ServicesId);
                var newHistoryAffect = new HistoriqueReclamation()
                {
                    DateDeffet = DateTime.Now,
                    ActionId = 2,
                    Etat = "Affectée à " + service.Libelle,
                    ReclamationsId = reclamation.Id,
                    Reponse = reclamationDto.Reponse,
                    userId = int.Parse(sidClaim.Value)
                };
                _context.HistoriqueReclamation.Add(newHistoryAffect);
            }
            await _context.SaveChangesAsync();

            reclamationDto.Id = generatedReclamationId;

            return Ok(reclamationDto);
        }

        // PUT: api/Reclamations/5
        [HttpPut("{id}")]
        public async Task<IActionResult> PutReclamation(int id, ReclamationDto reclamationDto)
        {
            var newHistory = new HistoriqueReclamation();
            var EtatCloture = _configuration.GetSection("EtatCloture").Value;
            var sidClaim = HttpContext.User.Claims.FirstOrDefault(c => c.Type == ClaimTypes.Sid);
            var userName = HttpContext.User.Claims.FirstOrDefault(c => c.Type == ClaimTypes.Actor);
            var reclamationInDb = _context.Reclamations.Find(id);
            if (reclamationInDb != null)
            {
                using (var transaction = await _context.Database.BeginTransactionAsync())
                {
                    try
                    {
                        if (EtatCloture != null && reclamationInDb.EtatReclamationId == int.Parse(EtatCloture))
                        {
                            reclamationInDb.treatedBy = userName.Value;
                            if (sidClaim != null)
                            {
                                newHistory = new HistoriqueReclamation()
                                {
                                    DateDeffet = DateTime.Now,
                                    ActionId = 4,
                                    Etat = "MAC " ,
                                    ReclamationsId = id,
                                    userId = int.Parse(sidClaim.Value)
                                };
                            }


                        }
                        else if (EtatCloture != null && reclamationDto.EtatReclamationId == int.Parse(EtatCloture))
                        {
                            reclamationInDb.treatedBy = userName?.Value;
                            if (sidClaim?.Value != null)
                            {
                                newHistory  = new HistoriqueReclamation()
                                {
                                    DateDeffet = DateTime.Now,
                                    ActionId = 3,
                                    Etat = "Cloture ",
                                    Reponse = reclamationDto.Reponse,
                                    ReclamationsId = id,
                                    userId = int.Parse(sidClaim.Value)

                                };
                            }


                        }
                        else
                        {
                            reclamationInDb.treatedBy = userName?.Value;
                            await _context.SaveChangesAsync();
                            if (sidClaim != null)
                            {
                                newHistory = new HistoriqueReclamation()
                                {
                                    DateDeffet = DateTime.Now,
                                    ActionId = 5,
                                    Etat = "Modification ",
                                    Reponse = reclamationDto.Reponse,
                                    ReclamationsId = id,
                                    userId = int.Parse(sidClaim.Value)

                                };
                            }

                        }
                        reclamationDto.UserId = reclamationInDb.UserId;
                        _mapper.Map(reclamationDto, reclamationInDb);
                        await _context.SaveChangesAsync();

                        _context.HistoriqueReclamation.Add(newHistory);
                        await _context.SaveChangesAsync();


                        await transaction.CommitAsync();
                        
                        return Ok(reclamationDto);
                    }
                    catch (Exception e)
                    {
                        await transaction.RollbackAsync();

                        return BadRequest("error" + e);
                    }
                }

            }
            else
            {
                return NotFound();
            }

        }
        
        // PUT: api/Reclamations/5
        [HttpPut("AffectReclamation/{id}")]
        public async Task<IActionResult> AffectReclamation(int id, int serviceId)
        {
            var actorClaim = _HttpContext.User.Claims.FirstOrDefault(c => c.Type == System.Security.Claims.ClaimTypes.Actor);
            var sidClaim = _HttpContext.User.Claims.FirstOrDefault(c => c.Type == System.Security.Claims.ClaimTypes.Sid);
            var reclamationInDb = _context.Reclamations.Find(id);
            if (reclamationInDb != null)
            {
                var service = _context.Services.Find(serviceId);
                if (service != null)
                {
                    reclamationInDb.ServicesId = serviceId;
                    _context.SaveChanges();
                    var newHistory = new HistoriqueReclamation
                    {
                        DateDeffet = DateTime.Now,
                        ActionId = 2,
                        Etat = "Affecté à " + service.Libelle,
                        ReclamationsId = id,
                        userId = int.Parse(sidClaim.Value)

                    };
                    _context.HistoriqueReclamation.Add(newHistory);
                    _context.SaveChanges();

                    var reclamationDto = _mapper.Map<ReclamationDto>(reclamationInDb);
                    return Ok(reclamationDto);
                }
                else
                    return BadRequest();

            }
            else return NotFound();

        }
        
        // PUT: api/Reclamations/5
        [HttpPut("MAC/{id}")]
        public async Task<IActionResult> MACReclamation(int id, ReclamationDto reclamationDto)
        {
            var EtatCloture = _configuration.GetSection("EtatCloture").Value;
            var sidClaim = HttpContext.User.Claims.FirstOrDefault(c => c.Type == ClaimTypes.Sid);
            var reclamationInDb = _context.Reclamations.Find(id);
            if (reclamationInDb != null)
            {
                if (reclamationInDb.EtatReclamationId == int.Parse(EtatCloture))
                {
                    _mapper.Map(reclamationDto, reclamationInDb);
                    var newHistory = new HistoriqueReclamation()
                    {
                        DateDeffet = DateTime.Now,
                        ActionId = 4,
                        Etat = "MAC",
                        ReclamationsId = id,
                        Reponse = reclamationDto.Reponse,
                        userId =  int.Parse(sidClaim.Value)

                    };
                    _context.HistoriqueReclamation.Add(newHistory);
                    _context.SaveChangesAsync();
                    return Ok(reclamationDto);
                }
                else
                    return BadRequest();

            }
            else return NotFound();

        }
        
        // PUT: api/Reclamations/5
        [HttpPut("ClotureReclamation/{id}")]
        public async Task<IActionResult> ClotureReclamation(int id)
        {
            var sidClaim = HttpContext.User.Claims.FirstOrDefault(c => c.Type == ClaimTypes.Sid);
            var reclamationInDb = _context.Reclamations.Find(id);
            if (reclamationInDb != null)
            {

                reclamationInDb.DateCloture = DateTime.Now;
                reclamationInDb.EtatReclamationId = 3;
                reclamationInDb.treatedBy = "User TODO";
                    var newHistory = new HistoriqueReclamation()
                    {
                        DateDeffet = DateTime.Now,
                        ActionId = 3,
                        Etat = "Cloture ",
                        ReclamationsId = id,
                        userId = int.Parse(sidClaim.Value)

                    };
                    _context.HistoriqueReclamation.Add(newHistory);
                    _context.SaveChangesAsync();
                    return Ok(reclamationInDb);
                

            }
            else return NotFound();

        }

        // DELETE: api/Reclamations/5
        [HttpDelete("{id}")]
        public async Task<DataSourceResult> DeleteReclamation(int id)
        {
            DataSourceResult dataResult = new DataSourceResult();

            var reclamation = await _context.Reclamations.FindAsync(id);
            if (reclamation == null)
            {
                dataResult.msg = "Reclamation not found";
                dataResult.codeReponse = CodeReponseEnum.error;
                return dataResult;
            }

            // Find and delete all historical records related to the reclamation
            // var historicalRecords = await _context.HistoriqueReclamation
            //     .Where(h => h.ReclamationsId == id)
            //     .ToListAsync();
            //
            // _context.HistoriqueReclamation.RemoveRange(historicalRecords);
            // await _context.SaveChangesAsync();

            reclamation.isDeleted = true;
            // _context.Reclamations.Remove(reclamation);
            await _context.SaveChangesAsync();

            dataResult.msg = "Reclamation supprimee";
            dataResult.codeReponse = CodeReponseEnum.ok;
            return dataResult;

        }

        // GET: api/Reclamations/GetRecByService/5
        [HttpGet("GetRecByService/{serviceId}")]
        public async Task<ActionResult<IEnumerable<ReclamationDto>>> GetRecByService(int serviceId)
        {
            var reclamations = await _context.Reclamations
                .Where(r => r.ServicesId == serviceId)
                .Where(x => x.isDeleted == false)
                .ToListAsync();
        
            if (reclamations == null || reclamations.Count == 0)
            {
                return NotFound();
            }
        
            var reclamationsDto = _mapper.Map<List<ReclamationDto>>(reclamations);
            return reclamationsDto;
        }
        
        // GET: api/Reclamations/GetAllRec
        [HttpGet("GetAllRec")]
        public async Task<ActionResult<IEnumerable<ReclamationDto>>> GetAllRec()
        {
            var reclamations = await _context.Reclamations.ToListAsync();
            var reclamationsDto = _mapper.Map<List<ReclamationDto>>(reclamations);
            return reclamationsDto;
        }
        
        // POST: api/Reclamations/5/upload
        [HttpPost("{id}/upload")]
        public async Task<IActionResult> UploadFile(int id, IFormFile file)
        {
            var reclamation = await _context.Reclamations.FindAsync(id);
            if (reclamation == null)
            {
                return NotFound();
            }

            if (file == null || file.Length == 0)
            {
                return BadRequest("File is required.");
            }

            if (file.Length > 10 * 1024 * 1024) // 10 MB
            {
                return BadRequest("File size cannot exceed 10 MB.");
            }
            
            var uploadPath = System.IO.Path.Combine(Directory.GetCurrentDirectory(), "Files", "Reclamations", "Reclamation_Files");

            
            if (!Directory.Exists(uploadPath))
            {
                // If it doesn't exist, create the directory
                Directory.CreateDirectory(uploadPath);
            }

            //Upload File
            var fileNameToCreate = NameOfFiles(uploadPath, file.FileName);

            var filepath = Path.Combine(uploadPath, fileNameToCreate);

            var allowedExtensions = new[] { ".png", ".jpg", ".jpeg" }; // Example extensions
            var fileExtension = Path.GetExtension(file.FileName).ToLowerInvariant();
            if (!allowedExtensions.Contains(fileExtension))
            {
                return BadRequest("Only PNG, JPG, and JPEG files are allowed.");
            }

            try
            {
                using (var memoryStream = new MemoryStream())
                {
                    await file.CopyToAsync(memoryStream);
                    var fileData = memoryStream.ToArray();
                    var newFile = new File()
                    {
                        FileName = file.FileName,
                        FilePath = filepath,
                        Content = fileData,
                        ReclamationId = id
                    };
                    
                    if (reclamation == null)
                    {
                        return NotFound();
                    }

                    reclamation.File = newFile;
                    await _context.SaveChangesAsync();
                }

                return Ok("File uploaded successfully.");
            }
            catch (Exception ex)
            {
                return StatusCode(StatusCodes.Status500InternalServerError, ex.Message);
            }
        }
        
        [HttpPost, Route("ExportListReclamation")]
        public IActionResult ExportListReclamation(List<ReclamationDto> reclamationDto)
        {
            try
            {
                var options = new ConvertOptions
                {
                    PageSize = Wkhtmltopdf.NetCore.Options.Size.A4,
                    PageOrientation = Wkhtmltopdf.NetCore.Options.Orientation.Portrait,
                    PageMargins = new Wkhtmltopdf.NetCore.Options.Margins { Left = 5, Right = 5, Top = 5, Bottom = 10 },
                };

                _generatePdf.SetConvertOptions(options);
                var pdf = _generatePdf.GetByteArray("Views/ReclamationTable.cshtml",reclamationDto);
                var pdfStream = new System.IO.MemoryStream();
                pdfStream.Write(pdf.Result, 0, pdf.Result.Length);
                pdfStream.Position = 0;
                return new FileStreamResult(pdfStream, "application/pdf");
            }
            catch (Exception ex)
            {
                throw ex;
            }
        }
        
        [HttpPost, Route("ExportRecByType")]
        public IActionResult ExportRecByType(List<RecByTypeRec> reclamationDto)
        {
            try
            {
                var options = new ConvertOptions
                {
                    PageSize = Wkhtmltopdf.NetCore.Options.Size.A4,
                    PageOrientation = Wkhtmltopdf.NetCore.Options.Orientation.Portrait,
                    PageMargins = new Wkhtmltopdf.NetCore.Options.Margins { Left = 5, Right = 5, Top = 5, Bottom = 10 },
                };

                _generatePdf.SetConvertOptions(options);
                var pdf = _generatePdf.GetByteArray("Views/ReclamationByType.cshtml",reclamationDto);
                var pdfStream = new System.IO.MemoryStream();
                pdfStream.Write(pdf.Result, 0, pdf.Result.Length);
                pdfStream.Position = 0;
                return new FileStreamResult(pdfStream, "application/pdf");
            }
            catch (Exception ex)
            {
                throw ex;
            }
        }        
        [HttpPost, Route("ExportRecByService")]
        public IActionResult ExportRecByService(List<RecByService> reclamationDto)
        {
            try
            {
                var options = new ConvertOptions
                {
                    PageSize = Wkhtmltopdf.NetCore.Options.Size.A4,
                    PageOrientation = Wkhtmltopdf.NetCore.Options.Orientation.Portrait,
                    PageMargins = new Wkhtmltopdf.NetCore.Options.Margins { Left = 5, Right = 5, Top = 5, Bottom = 10 },
                };

                _generatePdf.SetConvertOptions(options);
                var pdf = _generatePdf.GetByteArray("Views/ReclamationByService.cshtml",reclamationDto);
                var pdfStream = new System.IO.MemoryStream();
                pdfStream.Write(pdf.Result, 0, pdf.Result.Length);
                pdfStream.Position = 0;
                return new FileStreamResult(pdfStream, "application/pdf");
            }
            catch (Exception ex)
            {
                throw ex;
            }
        }
        
        [HttpPost("ExcelReclamation")]
        public async Task<IActionResult> ExportToExcel(List<ReclamationDto> list)
        {
            string trustedFileNameForFileStorage;
            trustedFileNameForFileStorage = DateTime.Now.Ticks.ToString() + "_" + "ExportReclamation.Xlsx";
            var path = Path.Combine(Directory.GetCurrentDirectory(), "uploads", trustedFileNameForFileStorage);
 
            await using FileStream fs = new(path, FileMode.Create);
 
            using (var package = new ExcelPackage(fs))
            {
                var workSheet = package.Workbook.Worksheets.Add("Sheet1");
                workSheet.Cells.LoadFromCollection(list, true);
                package.Save();
            }
            fs.Close();
            var memory = new MemoryStream();
            using (var stream = new FileStream(path, FileMode.Open))
            {
                await stream.CopyToAsync(memory);
            }
            memory.Position = 0;
            return File(memory, "application/vnd.ms-excel", Path.GetFileName(path));
 
 
        }
        [HttpPost("ExcelRecByService")]
        public async Task<IActionResult> ExcelRecByService(List<RecByService> list)
        {
            string trustedFileNameForFileStorage;
            trustedFileNameForFileStorage = DateTime.Now.Ticks.ToString() + "_" + "ExportReclamationParService.Xlsx";
            var path = Path.Combine(Directory.GetCurrentDirectory(), "uploads", trustedFileNameForFileStorage);
 
            await using FileStream fs = new(path, FileMode.Create);
 
            using (var package = new ExcelPackage(fs))
            {
                var workSheet = package.Workbook.Worksheets.Add("Sheet1");
                workSheet.Cells.LoadFromCollection(list, true);
                package.Save();
            }
            fs.Close();
            var memory = new MemoryStream();
            using (var stream = new FileStream(path, FileMode.Open))
            {
                await stream.CopyToAsync(memory);
            }
            memory.Position = 0;
            return File(memory, "application/vnd.ms-excel", Path.GetFileName(path));
 
 
        }
        
        [HttpPost("ExcelRecByTypeRec")]
        public async Task<IActionResult> ExcelRecByTypeRec(List<RecByTypeRec> list)
        {
            string trustedFileNameForFileStorage;
            trustedFileNameForFileStorage = DateTime.Now.Ticks.ToString() + "_" + "ExportReclamationParService.Xlsx";
            var path = Path.Combine(Directory.GetCurrentDirectory(), "uploads", trustedFileNameForFileStorage);
 
            await using FileStream fs = new(path, FileMode.Create);
 
            using (var package = new ExcelPackage(fs))
            {
                var workSheet = package.Workbook.Worksheets.Add("Sheet1");
                workSheet.Cells.LoadFromCollection(list, true);
                package.Save();
            }
            fs.Close();
            var memory = new MemoryStream();
            using (var stream = new FileStream(path, FileMode.Open))
            {
                await stream.CopyToAsync(memory);
            }
            memory.Position = 0;
            return File(memory, "application/vnd.ms-excel", Path.GetFileName(path));
 
 
        }
        
        [HttpPost("ExcelRecCountByPeriod")]
        public async Task<IActionResult> ExcelRecCountByPeriod(List<RecCountByPeriod> list)
        {
            string trustedFileNameForFileStorage;
            trustedFileNameForFileStorage = DateTime.Now.Ticks.ToString() + "_" + "ExportReclamationParService.Xlsx";
            var path = Path.Combine(Directory.GetCurrentDirectory(), "uploads", trustedFileNameForFileStorage);
 
            await using FileStream fs = new(path, FileMode.Create);
 
            using (var package = new ExcelPackage(fs))
            {
                var workSheet = package.Workbook.Worksheets.Add("Sheet1");
                workSheet.Cells.LoadFromCollection(list, true);
                package.Save();
            }
            fs.Close();
            var memory = new MemoryStream();
            using (var stream = new FileStream(path, FileMode.Open))
            {
                await stream.CopyToAsync(memory);
            }
            memory.Position = 0;
            return File(memory, "application/vnd.ms-excel", Path.GetFileName(path));
 
 
        }
        
        [HttpPost, Route("ExcelRecByEtat")]
        public async Task<IActionResult> ExcelRecByEtat(List<RecByEtat> list)
        {
            string trustedFileNameForFileStorage;
            trustedFileNameForFileStorage = DateTime.Now.Ticks.ToString() + "_" + "ExportReclamationParEtat.Xlsx";
            var path = Path.Combine(Directory.GetCurrentDirectory(), "uploads", trustedFileNameForFileStorage);
 
            await using FileStream fs = new(path, FileMode.Create);
 
            using (var package = new ExcelPackage(fs))
            {
                var workSheet = package.Workbook.Worksheets.Add("Sheet1");
                workSheet.Cells.LoadFromCollection(list, true);
                package.Save();
            }
            fs.Close();
            var memory = new MemoryStream();
            using (var stream = new FileStream(path, FileMode.Open))
            {
                await stream.CopyToAsync(memory);
            }
            memory.Position = 0;
            return File(memory, "application/vnd.ms-excel", Path.GetFileName(path));
        }
        
        [HttpPost, Route("ExportRecByEtat")]
        public IActionResult ExportRecByEtat(List<RecByEtat> reclamationDto)
        {
            try
            {
                var options = new ConvertOptions
                {
                    PageSize = Wkhtmltopdf.NetCore.Options.Size.A4,
                    PageOrientation = Wkhtmltopdf.NetCore.Options.Orientation.Portrait,
                    PageMargins = new Wkhtmltopdf.NetCore.Options.Margins { Left = 5, Right = 5, Top = 5, Bottom = 10 },
                };

                _generatePdf.SetConvertOptions(options);
                var pdf = _generatePdf.GetByteArray("Views/ReclamationByEtat.cshtml",reclamationDto);
                var pdfStream = new System.IO.MemoryStream();
                pdfStream.Write(pdf.Result, 0, pdf.Result.Length);
                pdfStream.Position = 0;
                return new FileStreamResult(pdfStream, "application/pdf");
            }
            catch (Exception ex)
            {
                throw ex;
            }
        }
        
        [HttpPost, Route("ExportRecByPeriode")]
        public IActionResult ExportRecByPeriode(List<RecCountByPeriod> reclamationDto)
        {
            try
            {
                var options = new ConvertOptions
                {
                    PageSize = Wkhtmltopdf.NetCore.Options.Size.A4,
                    PageOrientation = Wkhtmltopdf.NetCore.Options.Orientation.Portrait,
                    PageMargins = new Wkhtmltopdf.NetCore.Options.Margins { Left = 5, Right = 5, Top = 5, Bottom = 10 },
                };

                _generatePdf.SetConvertOptions(options);
                var pdf = _generatePdf.GetByteArray("Views/ReclamationByPeriode.cshtml",reclamationDto);
                var pdfStream = new System.IO.MemoryStream();
                pdfStream.Write(pdf.Result, 0, pdf.Result.Length);
                pdfStream.Position = 0;
                return new FileStreamResult(pdfStream, "application/pdf");
            }
            catch (Exception ex)
            {
                throw ex;
            }
        }
        
        [HttpPost, Route("ExportEnveloppe")]
        public IActionResult ExportEnveloppe(ReclamationDto reclamationDto)
        {
            try
            {
                var options = new ConvertOptions
                {
                    PageSize = Wkhtmltopdf.NetCore.Options.Size.A4,
                    PageOrientation = Wkhtmltopdf.NetCore.Options.Orientation.Portrait,
                    PageMargins = new Wkhtmltopdf.NetCore.Options.Margins { Left = 5, Right = 5, Top = 5, Bottom = 10 },
                };

                _generatePdf.SetConvertOptions(options);
                var pdf = _generatePdf.GetByteArray("Views/ReclamationEnveloppe.cshtml",reclamationDto);
                var pdfStream = new System.IO.MemoryStream();
                pdfStream.Write(pdf.Result, 0, pdf.Result.Length);
                pdfStream.Position = 0;
                return new FileStreamResult(pdfStream, "application/pdf");
            }
            catch (Exception ex)
            {
                throw ex;
            }
        }
        
        [HttpGet("DownloadFile")]
        public IActionResult DownloadFile(int fileId)
        {
            // Retrieve the file from the database by its ID
            var file = _context.Files.FirstOrDefault(f => f.Id == fileId);
            if (file == null)
            {
                return NotFound(); // Handle the case where the file is not found
            }

            // Serve the file content as a downloadable file
            return File(file.Content, "application/octet-stream", file.FileName);
        }
        
        private bool ReclamationExists(int id)
        {
            return _context.Reclamations.Any(e => e.Id == id);
        }
        
        private string NameOfFiles(string uploadPath, string fileName)
        {
            try
            {
                var extensionofFile = Path.GetExtension(Path.Combine(uploadPath, fileName));
                if (System.IO.File.Exists(Path.Combine(uploadPath, fileName)))
                {
                    fileName = string.Format("{0}{1}{2}", fileName, DateTime.Now.ToString("yyyy_MM_dd_HH_mm"), extensionofFile);

                    return fileName;
                }
                else
                    return fileName;
            }
            catch (Exception)
            {
                throw;
            }
        }
    }
}
