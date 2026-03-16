using AutoMapper;
using iReclamation.Dtos;
using iReclamation.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace iReclamation.Controllers;

[Route("api/[controller]")]
[ApiController]
public class AdherentsController : ControllerBase
{
    private readonly ApplicationDbContext _context;
    private readonly IMapper _mapper;


    public AdherentsController(ApplicationDbContext context, IMapper mapper)
    {
        _context = context;
        _mapper = mapper;
    }
    
    // GET: api/Adherents
        [HttpGet]
        public async Task<ActionResult<IEnumerable<AdherentDto>>> GetAdherents()
        {
            var adherents = await _context.Adherent.Include(x=>x.Region)
                .Include(x=>x.Ville).ToListAsync();
            var adherentDtos = _mapper.Map<List<AdherentDto>>(adherents);
            return adherentDtos;
        }
        
        // GET: api/Adherents/GetTopAdherents
        [HttpGet("GetTopAdherents")]
        public async Task<ActionResult<IEnumerable<AdherentDto>>> GetTopAdherents()
        {
            var adherents = await _context.Adherent.Include(x=>x.Region)
                .Include(x=>x.Ville).Take(100).ToListAsync();
            var adherentDtos = _mapper.Map<List<AdherentDto>>(adherents);
            return adherentDtos;
        }
        
        [HttpPost("GetAdherentsWithFilters")]
        public async Task<ActionResult<List<AdherentDto>>> GetAdherentsWithFilters([FromBody] filterAdherent filter)
        {
            if (filter == null)
            {
                return BadRequest("Filter cannot be null");
            }

            var query =  _context.Adherent.Include(x=>x.Region)
                .Include(x=>x.Ville).AsQueryable();

            

            
            if (!string.IsNullOrEmpty(filter.Affiliation) )
            {
                query = query.Where(x => x.Affiliation != null && x.Affiliation == filter.Affiliation);
            }
            if (!string.IsNullOrEmpty(filter.Immatriculation) )
            {
                query = query.Where(x => x.Immatriculation != null && x.Immatriculation == filter.Immatriculation);
            }
            

            var adherents = query.ToList();
            
            var adherentsDto = _mapper.Map<List<AdherentDto>>(adherents);

            return adherentsDto;
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<AdherentDto>> GetAdherent(int id)
        {
            var adherent =  _context.Adherent.Include(x=>x.Region)
                .Include(x=>x.Ville).FirstOrDefault(x=>x.id == id);

            if (adherent == null)
            {
                return NotFound();
            }

            var adherentDto = _mapper.Map<AdherentDto>(adherent);
            return adherentDto;
        }
        
        [HttpGet("AdherentByAffiliation")]
        public async Task<ActionResult<AdherentDto>> GetAdherentByAffiliation(string affiliation)
        {
            var adherent =  _context.Adherent.Include(x=>x.Region)
                .Include(x=>x.Ville).FirstOrDefault(x=>x.Affiliation == affiliation);

            if (adherent == null)
            {
                return NotFound();
            }

            var adherentDto = _mapper.Map<AdherentDto>(adherent);
            return adherentDto;
        }

        [HttpPost]
        public async Task<ActionResult<AdherentDto>> PostAdherent(AdherentDto adherentDto)
        {
            var adherent = _mapper.Map<Adherent>(adherentDto);
            _context.Adherent.Add(adherent);
            await _context.SaveChangesAsync();

            var createdDto = _mapper.Map<AdherentDto>(adherent);
            return CreatedAtAction(nameof(GetAdherent), new { id = createdDto.id }, createdDto);
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> PutAdherent(int id, AdherentDto adherentDto)
        {

            var existingAdherent = await _context.Adherent.FindAsync(id);

            if (existingAdherent == null)
            {
                return NotFound();
            }

            _mapper.Map(adherentDto, existingAdherent);

            _context.SaveChanges();
            return Ok(adherentDto);
        }



        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteAdherent(int id)
        {
            var adherent = await _context.Adherent.FindAsync(id);
            if (adherent == null)
            {
                return NotFound();
            }

            _context.Adherent.Remove(adherent);
            await _context.SaveChangesAsync();

            return Ok("Adherent Removed");
        }

        private bool AdherentExists(int id)
        {
            return _context.Adherent.Any(e => e.id == id);
        }




        
    
}

public class filterAdherent
{
    public string? Affiliation { get; set; }
    public string? Immatriculation { get; set; }
}