using Microsoft.AspNetCore.Mvc;
using System.Collections.Generic;

namespace UsuariosBackend.Controllers
{
    [ApiController]
    [Route("api/v1/usuario")]
    public class UsuarioController : ControllerBase
    {
        // Lista estática para que los datos persistan mientras el servidor esté corriendo
        private static readonly List<Usuario> _usuarios = new List<Usuario>();

        [HttpGet]
        public IActionResult Get()
        {
            return Ok(_usuarios);
        }

        [HttpPost]
        public IActionResult Post([FromBody] Usuario nuevo)
        {
            if (nuevo == null || string.IsNullOrEmpty(nuevo.Nombre))
            {
                return BadRequest("El nombre es requerido");
            }

            nuevo.Id = _usuarios.Count + 1;
            _usuarios.Add(nuevo);
            return Ok(nuevo);
        }
    }

    // La clase Usuario debe estar fuera de la clase Controller o bien definida
    public class Usuario
    {
        public int Id { get; set; }
        public string Nombre { get; set; } = string.Empty;
    }
}