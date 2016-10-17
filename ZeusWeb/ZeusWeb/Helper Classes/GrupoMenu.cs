using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace ZeusWeb.Helper_Classes
{
    public class GrupoMenu
    {
        public int id { get; set; }
        public string nombre { get; set; }
        public string icono { get; set; }
        public List<Modulo> Modulos { get; set; }
        public GrupoMenu()
        {
            this.Modulos = new List<Modulo>();
        }
    }

    public class Modulo
    {
        public int id { get; set; }
        public string nombre { get; set; }
        public string icono { get; set; }
        public int grupo { get; set; }
        public List<ItemModulo> Items { get; set; }

        public Modulo()
        {
            this.Items = new List<ItemModulo>();
        }

    }

    public class ItemModulo
    {
        public int id { get; set; }
        public string nombre { get; set; }
        public string url { get; set; }
        public string controlador { get; set; }
        public string metodo { get; set; }
        public string icono { get; set; }
        public int modulo { get; set; }
        public List<Permiso> Permisos { get; set; }
        public ItemModulo()
        {
            this.Permisos = new List<Permiso>();
        }
    }

    public class Permiso
    {
        public int id { get; set; }
        public string descripcion { get; set; }
    }
}
