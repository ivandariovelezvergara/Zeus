using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace ZeusWeb.ViewModels
{
    public class ItemsModulo
    {
        public int id { get; set; }
        public string nombre { get; set; }
        public string url { get; set; }
        public string controlador { get; set; }
        public string metodo { get; set; }
        public string icono { get; set; }
        public int modulo { get; set; }

        public ItemsModulo()
        {
            id = 1;
            nombre = "Item";
            url = "#";
            controlador = "";
            metodo = "";
            icono = "";
            modulo = 1;
        }
    }
}
