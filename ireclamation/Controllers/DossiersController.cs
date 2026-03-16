using System;
using System.Collections.Generic;
using System.Linq;
using System.Text.Json;
using System.Threading.Tasks;
using AutoMapper;
using iReclamation.Dtos;
using iReclamation.Models;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using File = iReclamation.Models.File;

namespace iReclamation.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class DossiersController : ControllerBase
    {
        private readonly ApplicationDbContext _context;
        private readonly IMapper _mapper;

        public DossiersController(ApplicationDbContext context, IMapper mapper)
        {
            _context = context;
            _mapper = mapper;
        }
        
        // GET: api/Dossiers/5
        [HttpGet()]
        public async Task<ActionResult<List<DossierDto>>> GetDossiersByReclamation(int ReclamationId)
        {
            var dossier = await _context.Dossier.Where(d => d.ReclamationsId == ReclamationId).ToListAsync();

            if (dossier == null)
            {
                return NotFound();
            }
           

            var dossierDto = _mapper.Map<List<DossierDto>>(dossier);
            return dossierDto;
        }

        // POST: api/Dossiers
        [HttpPost]
        public async Task<ActionResult<DossierDto>> PostDossier(int ReclamationId , DossierDto dossierDto)
        {
            var dossier = _mapper.Map<Dossier>(dossierDto);
            dossier.DateOfCreation = DateTime.Now;
            dossier.ReclamationsId = ReclamationId;
            
            _context.Dossier.Add(dossier);
            await _context.SaveChangesAsync();

            var createdDto = _mapper.Map<DossierDto>(dossier);
            return CreatedAtAction(nameof(GetDossier), new { id = createdDto.id }, createdDto);
        }

        // GET: api/Dossiers/5
        [HttpGet("{id}")]
        public async Task<ActionResult<DossierDto>> GetDossier(int id)
        {
            var dossier = await _context.Dossier.FirstOrDefaultAsync(d => d.id == id);

            if (dossier == null)
            {
                return NotFound();
            }

            var dossierDto = _mapper.Map<DossierDto>(dossier);
            return dossierDto;
        }

        // DELETE: api/Dossiers/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteDossier(int id)
        {
            var dossier = await _context.Dossier.FindAsync(id);
            if (dossier == null)
            {
                return NotFound();
            }

            _context.Dossier.Remove(dossier);
            await _context.SaveChangesAsync();

            return NoContent();
        }

        
        
    }
    
}
