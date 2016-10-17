using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.ComponentModel;
using System.ComponentModel.DataAnnotations;
using System.IO;
using System.Web;

namespace ZeusWeb.Models
{
    public class MenuModels
    {
        public string login { get; set; }
        public HttpPostedFileBase foto { get; set; }
        public string nombres { get; set; }
        public string apellidos { get; set; }
        public string correo { get; set; }
        public string identificacion { get; set; }
        public string telefono { get; set; }
        public string celular { get; set; }
        public string direccion { get; set; }
        public DateTime fechaNacimiento { get; set; }
        public int cargo { get; set; }
        public int grupo { get; set; }
        public int departamento { get; set; }
        public string pass { get; set; }
        public string repPass { get; set; }
        public decimal salario { get; set; }

        public IEnumerable<string> Images { get; set; }

    }

}
