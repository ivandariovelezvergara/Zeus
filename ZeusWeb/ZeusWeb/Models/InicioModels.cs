using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using ZeusWeb.Helper_Classes;
using ZeusWeb.ViewModels;

namespace ZeusWeb.Models
{
    public class InicioModels
    {
        public int id { get; set; }
        public string nombre { get; set; }
        public string icono { get; set; }
        public List<DatosMenu> DatosMenu { get; set; }
        public string foto
        {
            get
            {
                return Convert.ToBase64String(Perfil_Login.miPerfil.usr_fotografia);
            }
        }
        public string nombreUsuario
        {
            get
            {
                return Perfil_Login.miPerfil.usr_nombres + " " + Perfil_Login.miPerfil.usr_apellidos;
            }
        }

        public InicioModels()
        {
            icono = "ic";
            id = 0;
            nombre = "Jeffer";

            this.DatosMenu = new List<DatosMenu>();
            DatosMenu.Add(new DatosMenu(1)
            {
                id = 1,
                nombre = "Placas",
                icono = "",    
            });
        }
    }
}