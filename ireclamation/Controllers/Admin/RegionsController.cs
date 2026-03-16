using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using AutoMapper;
using iReclamation.Dtos;
using iReclamation.Models;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace iReclamation.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class RegionsController : ControllerBase
    {
        private readonly ApplicationDbContext _context;
        private readonly IMapper _mapper;


        public RegionsController(ApplicationDbContext context, IMapper mapper)
        {
            _context = context;
            _mapper = mapper;
        }

        // GET: api/regions
        [HttpGet]
        public async Task<ActionResult<List<Regions>>> GetRegions()
        {
            var regions = await _context.Regions
                .ToListAsync();
            return Ok(regions);
        }

        [HttpGet("{regionId}")]
        public async Task<ActionResult<IEnumerable<VilleDto>>> GetCitiesByRegion(int regionId)
        {
            var region = await _context.Regions
                .Include(r => r.Villes)
                .FirstOrDefaultAsync(r => r.Id == regionId);
            if (region == null)
            {
                return NotFound();
            }
            var villes = region.Villes.ToList();
            
            return Ok(villes);
        }
        
        [HttpGet("getAllVilles")]
        public async Task<ActionResult<IEnumerable<Villes>>> getAllVilles()
        {
            var villes = await _context.Villes
                .ToListAsync();
            if (villes == null)
            {
                return NotFound();
            }
            
            
            return Ok(villes);
        }

    }
}
