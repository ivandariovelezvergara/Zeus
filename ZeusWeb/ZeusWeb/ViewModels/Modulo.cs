using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace ZeusWeb.ViewModels
{
    public class Modulo
    {
        public int id { get; set; }
        public string nombre { get; set; }
        public string icono { get; set; }
        public int grupo { get; set; }
        public List<ItemsModulo> Items { get; set; }

        public Modulo()
        {
            id = 1;
            nombre = "Modulo";
            icono = "";
            grupo = 1;
            this.Items = new List<ItemsModulo>();
            Items.Add(new ItemsModulo()
            {
                id = 1,
                nombre = "",
                icono = "",
                controlador = "",
                metodo = "",
                modulo = 1,
                url = ""
            }); 
        }
    }
}
