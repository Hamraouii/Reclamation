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
    public class TypeReclamationsController : ControllerBase
    {
        private readonly ApplicationDbContext _context;
        private readonly IMapper _mapper;


        public TypeReclamationsController(ApplicationDbContext context , IMapper mapper)
        {
            _context = context;
            _mapper = mapper;
        }

        // GET: api/TypeReclamations
        [HttpGet]
        public async Task<ActionResult<IEnumerable<TypeReclamationDto>>> GetTypeReclamations()
        {
            var typeReclamations = await _context.TypeReclamations.ToListAsync();
            var typeReclamationDtos = _mapper.Map<List<TypeReclamationDto>>(typeReclamations);
            return typeReclamationDtos;
        }
        
        [HttpGet("{id}")]
        public async Task<ActionResult<TypeReclamationDto>> GetTypeReclamation(int id)
        {
            var typeReclamation = await _context.TypeReclamations.FindAsync(id);
        
            if (typeReclamation == null)
            {
                return NotFound();
            }
        
            var typeReclamationDto = _mapper.Map<TypeReclamationDto>(typeReclamation);
            return typeReclamationDto;
        }
        
        [HttpPost]
        public async Task<ActionResult<TypeReclamationDto>> PostTypeReclamation(TypeReclamationDto typeReclamationDto)
        {
            var typeReclamation = _mapper.Map<TypeReclamations>(typeReclamationDto);
            _context.TypeReclamations.Add(typeReclamation);
            await _context.SaveChangesAsync();
        
            return CreatedAtAction(nameof(GetTypeReclamation), new { id = typeReclamation.Id }, typeReclamationDto);
        }
        
        [HttpPut("{id}")]
        public async Task<IActionResult> PutTypeReclamation(int id, TypeReclamationDto typeReclamationDto)
        {
            if (id != typeReclamationDto.Id)
            {
                return BadRequest();
            }
        
            var typeReclamation = _mapper.Map<TypeReclamations>(typeReclamationDto);
            _context.Entry(typeReclamation).State = EntityState.Modified;
        
            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!TypeReclamationExists(id))
                {
                    return NotFound();
                }
                else
                {
                    throw;
                }
            }
        
            return Ok(typeReclamationDto);
        }
        
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteTypeReclamation(int id)
        {
            var typeReclamation = await _context.TypeReclamations.FindAsync(id);
            if (typeReclamation == null)
            {
                return NotFound();
            }
        
            _context.TypeReclamations.Remove(typeReclamation);
            await _context.SaveChangesAsync();

            return Ok(typeReclamation);
        }
        
        private bool TypeReclamationExists(int id)
        {
            return _context.TypeReclamations.Any(e => e.Id == id);
        }
        
    }
}
