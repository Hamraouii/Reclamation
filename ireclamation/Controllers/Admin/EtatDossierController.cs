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
    public class EtatDossierController : ControllerBase
    {
        private readonly ApplicationDbContext _context;
        private readonly IMapper _mapper;

        public EtatDossierController(ApplicationDbContext context, IMapper mapper)
        {
            _context = context;
            _mapper = mapper;
        }

        // GET: api/EtatDossier
        [HttpGet]
        public async Task<ActionResult<IEnumerable<EtatDossierDto>>> GetEtatDossiers()
        {
            var etatDossiers = await _context.EtatDossier.ToListAsync();
            var etatDossiersDto = _mapper.Map<List<EtatDossierDto>>(etatDossiers);
            return etatDossiersDto;
        }

        // GET: api/EtatDossier/5
        [HttpGet("{id}")]
        public async Task<ActionResult<EtatDossierDto>> GetEtatDossier(int id)
        {
            var etatDossier = await _context.EtatDossier.FindAsync(id);

            if (etatDossier == null)
            {
                return NotFound();
            }

            var etatDossierDto = _mapper.Map<EtatDossierDto>(etatDossier);
            return etatDossierDto;
        }

        // POST: api/EtatDossier
        [HttpPost]
        public async Task<ActionResult<EtatDossierDto>> PostEtatDossier(EtatDossierDto etatDossierDto)
        {
            var etatDossier = _mapper.Map<EtatDossier>(etatDossierDto);
            _context.EtatDossier.Add(etatDossier);
            await _context.SaveChangesAsync();

            var createdDto = _mapper.Map<EtatDossierDto>(etatDossier);
            return CreatedAtAction(nameof(GetEtatDossier), new { id = createdDto.Id }, createdDto);
        }

        // PUT: api/EtatDossier/5
        [HttpPut("{id}")]
        public async Task<IActionResult> PutEtatDossier(int id, EtatDossierDto etatDossierDto)
        {

            var existingEtatDossier = await _context.EtatDossier.FindAsync(id);
            if (existingEtatDossier == null)
            {
                return NotFound();
            }

            

            try
            {
                existingEtatDossier.LibelleAr = etatDossierDto.LibelleAr;
                existingEtatDossier.LibelleFr = etatDossierDto.LibelleFr;
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!EtatDossierExists(id))
                {
                    return NotFound();
                }
                else
                {
                    throw;
                }
            }

            return Ok("etatDossierUpdated");
        }

        // DELETE: api/EtatDossier/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteEtatDossier(int id)
        {
            var etatDossier = await _context.EtatDossier.FindAsync(id);
            if (etatDossier == null)
            {
                return NotFound();
            }

            _context.EtatDossier.Remove(etatDossier);
            await _context.SaveChangesAsync();

            return NoContent();
        }

        private bool EtatDossierExists(int id)
        {
            return _context.EtatDossier.Any(e => e.Id == id);
        }
    }
}

