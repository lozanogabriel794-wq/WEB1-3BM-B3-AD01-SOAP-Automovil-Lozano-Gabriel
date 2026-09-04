using AutoSoap.Data;
using AutoSoap.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace AutoSoap.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class MantenimientosController : ControllerBase
    {
        private readonly ConcesionariaDbContext _context;

        public MantenimientosController(ConcesionariaDbContext context)
        {
            _context = context;
        }

        // GET: api/Mantenimientos
        [HttpGet]
        public async Task<ActionResult<IEnumerable<Mantenimiento>>> GetMantenimientos()
        {
            return await _context.Mantenimiento.ToListAsync();
        }

        // GET: api/Mantenimientos/5
        [HttpGet("{id}")]
        public async Task<ActionResult<Mantenimiento>> GetMantenimiento(int id)
        {
            var mantenimiento = await _context.Mantenimiento.FindAsync(id);

            if (mantenimiento == null)
            {
                return NotFound();
            }

            return mantenimiento;
        }

        // POST: api/Mantenimientos
        [HttpPost]
        public async Task<ActionResult<Mantenimiento>> PostMantenimiento(Mantenimiento mantenimiento)
        {
            _context.Mantenimiento.Add(mantenimiento);
            await _context.SaveChangesAsync();

            return CreatedAtAction(nameof(GetMantenimiento), new { id = mantenimiento.IdMantenimiento }, mantenimiento);
        }

        // PUT: api/Mantenimientos/5
        [HttpPut("{id}")]
        public async Task<IActionResult> PutMantenimiento(int id, Mantenimiento mantenimiento)
        {
            if (id != mantenimiento.IdMantenimiento)
            {
                return BadRequest();
            }

            _context.Entry(mantenimiento).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!MantenimientoExists(id))
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

        // DELETE: api/Mantenimientos/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteMantenimiento(int id)
        {
            var mantenimiento = await _context.Mantenimiento.FindAsync(id);
            if (mantenimiento == null)
            {
                return NotFound();
            }

            _context.Mantenimiento.Remove(mantenimiento);
            await _context.SaveChangesAsync();

            return NoContent();
        }

        private bool MantenimientoExists(int id)
        {
            return _context.Mantenimiento.Any(e => e.IdMantenimiento == id);
        }
    }
}
