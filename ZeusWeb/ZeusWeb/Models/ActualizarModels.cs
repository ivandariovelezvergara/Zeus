using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using ZeusWeb.ZeusService;

namespace ZeusWeb.Models
{
    public class ActualizarModels : MenuModels
    {
        public int IDUSUARIO { get; set; }
        public string FullName { get { return nombres + " " + apellidos; } }
        public byte[] imagen { get; set; }
        public string cargoNombre { get; set; }
        
        public string fotoA { get; set; }
    }
}