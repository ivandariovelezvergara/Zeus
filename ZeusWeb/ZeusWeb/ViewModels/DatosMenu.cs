using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using ZeusWeb.Models;
using ZeusWeb.ZeusService;

namespace ZeusWeb.ViewModels
{
    public class DatosMenu
    {
        public int id { get; set; }
        public string nombre { get; set; }
        public string icono { get; set; }
        public List<Modulo> modulos { get; set; }
        public List<EmpleadoDTO> lista { get; set; }

        public DatosMenu(int grupo)
        {
            icono = "ic";
            id = 0;
            nombre = "Jeffer";
            this.modulos = new List<Modulo>();



            ServiceZeusClient cls = new ServiceZeusClient();
            lista = cls.ListaEmpleadosAsignados(1).ToList();

            var model = new List<ActualizarModels>();

            for (int i = 0; i < lista.Count; i++)
            {
                modulos.Add(new Modulo()
                {
                    nombre = lista[i].usr_nombres + " " + lista[i].usr_apellidos,
                    //imagen = lista[i].usr_fotografia,
                });
            }


            //modulos.Add(new Modulo()
            //    {
            //        id = 1,
            //        nombre = "SPY 132",
            //        icono = "",
            //        grupo = 1
            //    });
            //    modulos.Add(new Modulo()
            //    {
            //        id = 2,
            //        nombre = "TAL 369",
            //        icono = "",
            //        grupo = 1
            //    });
            //    modulos.Add(new Modulo()
            //    {
            //        id = 3,
            //        nombre = "VFE 821",
            //        icono = "",
            //        grupo = 1
            //    });
        }
    }
}
