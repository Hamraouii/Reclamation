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
    public class SourcesController : ControllerBase
    {
        private readonly ApplicationDbContext _context;
        private readonly IMapper _mapper;


        public SourcesController(ApplicationDbContext context, IMapper mapper)
        {
            _context = context;
            _mapper = mapper;
        }

        // GET: api/Sources
        [HttpGet]
        public ActionResult<IEnumerable<SourceDto>> GetSources()
        {
            var sources = _context.Sources.ToList();
            var sourceDtos = _mapper.Map<List<SourceDto>>(sources);
            return sourceDtos;
        }

// GET: api/Sources/5
        [HttpGet("{id}")]
        public ActionResult<SourceDto> GetSources(int id)
        {
            var source = _context.Sources.Find(id);
            if (source == null)
            {
                return NotFound();
            }
            var sourceDto = _mapper.Map<SourceDto>(source);
            return sourceDto;
        }

// POST: api/Sources
        [HttpPost]
        public ActionResult<SourceDto> PostSources(SourceDto sourceDto)
        {
            var source = _mapper.Map<Sources>(sourceDto);
            _context.Sources.Add(source);
            _context.SaveChanges();
            return CreatedAtAction("GetSources", new { id = source.Id }, sourceDto);
        }

// PUT: api/Sources/5
        [HttpPut("{id}")]
        public async Task<IActionResult> PutSources(int id, SourceDto sourceDto)
        {
            var existingSource = await _context.Sources.FindAsync(id);
            if (existingSource == null)
            {
                return NotFound();
            }
            

            try
            {
                existingSource.LibelleAr = sourceDto.LibelleAr;
                existingSource.Libelle = sourceDto.Libelle;
                await _context.SaveChangesAsync();
            }
            catch (Exception e)
            {
                return BadRequest("error" + e);
            }

            return Ok(sourceDto);
        }

// DELETE: api/Sources/5
        [HttpDelete("{id}")]
        public ActionResult<SourceDto> DeleteSources(int id)
        {
            var source = _context.Sources.Find(id);
            if (source == null)
            {
                return NotFound();
            }
            var sourceDto = _mapper.Map<SourceDto>(source);
            _context.Sources.Remove(source);
            _context.SaveChanges();
            return Ok(sourceDto);
        }
        
        private bool SourceExists(int id)
        {
            return _context.Sources.Any(e => e.Id == id);
        }
    }
}
