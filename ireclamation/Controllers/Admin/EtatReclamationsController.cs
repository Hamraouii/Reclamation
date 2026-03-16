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
    public class EtatReclamationsController : ControllerBase
    {
         private readonly ApplicationDbContext _context;
         private readonly IMapper _mapper;


        public EtatReclamationsController(ApplicationDbContext context, IMapper mapper)
        {
            _context = context;
            _mapper = mapper;
        }

        // GET: api/EtatReclamations
        [HttpGet]
        public async Task<ActionResult<IEnumerable<EtatReclamationDto>>> GetEtatReclamations()
        {
            var etatReclamations = await _context.EtatReclamations.ToListAsync();
            var etatReclamationDtos = _mapper.Map<List<EtatReclamationDto>>(etatReclamations);
            return etatReclamationDtos;
        }
        
        [HttpGet("{id}")]
        public async Task<ActionResult<EtatReclamationDto>> GetEtatReclamation(int id)
        {
            var etatReclamation = await _context.EtatReclamations.FindAsync(id);
        
            if (etatReclamation == null)
            {
                return NotFound();
            }
        
            var etatReclamationDto = _mapper.Map<EtatReclamationDto>(etatReclamation);
            return etatReclamationDto;
        }
        
        [HttpPost]
        public async Task<ActionResult<EtatReclamationDto>> PostEtatReclamation(EtatReclamationDto etatReclamationDto)
        {
            var etatReclamation = _mapper.Map<EtatReclamation>(etatReclamationDto);
            _context.EtatReclamations.Add(etatReclamation);
            await _context.SaveChangesAsync();
        
            return CreatedAtAction("GetEtatReclamation", new { id = etatReclamation.Id }, etatReclamationDto);
        }
        
        [HttpPut("{id}")]
        public async Task<IActionResult> PutEtatReclamation(int id, EtatReclamationDto etatReclamationDto)
        {
            var etatReclamation = await _context.EtatReclamations.FindAsync(id);
            if (etatReclamation == null)
            {
                return NotFound();
            }
        
            try
            {
                etatReclamation.LibelleAr = etatReclamationDto.LibelleAr;
                etatReclamation.Libelle = etatReclamationDto.Libelle;
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!EtatReclamationExists(id))
                {
                    return NotFound();
                }
                else
                {
                    throw;
                }
            }
        
            return NoContent();
        }
        
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteEtatReclamation(int id)
        {
            var etatReclamation = await _context.EtatReclamations.FindAsync(id);
            if (etatReclamation == null)
            {
                return NotFound();
            }
        
            _context.EtatReclamations.Remove(etatReclamation);
            await _context.SaveChangesAsync();
        
            return NoContent();
        }

        private bool EtatReclamationExists(int id)
        {
            return _context.EtatReclamations.Any(e => e.Id == id);
        }
    }
}
