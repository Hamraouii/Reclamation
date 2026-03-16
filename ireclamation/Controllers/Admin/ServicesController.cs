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

namespace iReclamation.Controllers.Admin
{
    [Route("api/[controller]")]
    [ApiController]
    public class ServicesController : ControllerBase
    {
        private readonly ApplicationDbContext _context;
        private readonly IMapper _mapper;

        public ServicesController(ApplicationDbContext context, IMapper mapper)
        {
            _context = context;
            _mapper = mapper;
        }

        // GET: api/Services
        [HttpGet]
        public async Task<ActionResult<IEnumerable<ServiceDto>>> GetServices()
        {
            var services = await _context.Services.ToListAsync();
            var serviceDtos = _mapper.Map<List<ServiceDto>>(services);
            return serviceDtos;
        }

        // GET: api/Services/5
        [HttpGet("{id}")]
        public async Task<ActionResult<ServiceDto>> GetService(int id)
        {
            var service = await _context.Services.FindAsync(id);

            if (service == null)
            {
                return NotFound();
            }

            var serviceDto = _mapper.Map<ServiceDto>(service);
            return serviceDto;
        }

        // POST: api/Services
        [HttpPost]
        public async Task<ActionResult<ServiceDto>> PostService(ServiceDto serviceDto)
        {
            var service = _mapper.Map<Services>(serviceDto);
            _context.Services.Add(service);
            await _context.SaveChangesAsync();

            var createdDto = _mapper.Map<ServiceDto>(service);
            return CreatedAtAction(nameof(GetService), new { id = createdDto.Id }, createdDto);
        }

        // PUT: api/Services/5
        [HttpPut("{id}")]
        public async Task<IActionResult> PutService(int id, ServiceDto serviceDto)
        {

            var existingService = await _context.Services.FindAsync(id);
            if (existingService == null)
            {
                return NotFound();
            }
            

            try
            {
                existingService.LibelleAr = serviceDto.LibelleAr;
                existingService.Libelle = serviceDto.Libelle;
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!ServiceExists(id))
                {
                    return NotFound();
                }
                else
                {
                    throw;
                }
            }

            return Ok(existingService);
        }

        // DELETE: api/Services/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteService(int id)
        {
            var service = await _context.Services.FindAsync(id);
            if (service == null)
            {
                return NotFound();
            }

            _context.Services.Remove(service);
            await _context.SaveChangesAsync();

            return Ok(service);
        }

        private bool ServiceExists(int id)
        {
            return _context.Services.Any(e => e.Id == id);
        }
    
    }
}
