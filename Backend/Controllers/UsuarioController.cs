using Microsoft.AspNetCore.Mvc;

namespace Backend.Controllers 
{
    [ApiController]
    [Route("api/usuario")]
    public class UsuarioController : ControllerBase
    {
        private static readonly List<Usuario> _usuarios = new List<Usuario>();

        [HttpGet]
        public IActionResult Get() => Ok(_usuarios);

        [HttpPost]
        public IActionResult Post([FromBody] Usuario nuevo)
        {
            if (nuevo == null || string.IsNullOrEmpty(nuevo.Nombre)) return BadRequest();
            nuevo.Id = _usuarios.Count + 1;
            _usuarios.Add(nuevo);
            return Ok(nuevo);
        }

        [HttpDelete("{id}")]
        public IActionResult Delete(int id)
        {
            var usuario = _usuarios.FirstOrDefault(u => u.Id == id);
            if (usuario == null) return NotFound();
            
            _usuarios.Remove(usuario);
            return NoContent(); // respuesta exitosa
        }


    }

    public class Usuario
    {
        public int Id { get; set; }
        public string Nombre { get; set; } = string.Empty;
    }
}