using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using ZeusWeb.ZeusService;

namespace ZeusWeb.Helper_Classes
{
    public static class Perfil_Login
    {
        private static readonly string mensajeExcepcion = "Solo READONLY";

        // Banderas para evitar que se reasigne el valor durante toda la aplicacion
        private static bool miPerfilAsignado = false;
        private static bool listaEmpleadosAsignada = false;
        private static bool perfilLogeadoAsignado = false;

        // Campos privados que manejan todos los controllers
        private static EmpleadoDTO perfilUsuario;
        private static EmpleadoDTO[] listaEmpleados;
        private static UbicacionDTO[] listaCoordenadas;
        private static HistorialChat[] listaMensajes;
        private static bool usuarioLogeado = false;

        #region ->Metodos
        // Propiedades para controlar el acceso a los datos privados SUPER IMPORTANTES para las activities
        public static UbicacionDTO[] ListaCoordenadasEmpleado
        {
            get
            {
                return listaCoordenadas;
            }
            set
            {
                listaCoordenadas = value;
            }
        }

        public static bool logeado
        {
            get
            {
                return usuarioLogeado;
            }
            set
            {
                if (!perfilLogeadoAsignado)
                {
                    usuarioLogeado = value;
                    perfilLogeadoAsignado = true;
                }
                else
                {
                    throw new Exception(mensajeExcepcion);
                }
            }
        }

        public static EmpleadoDTO miPerfil
        {
            get
            {
                return perfilUsuario;
            }
            set
            {
                perfilUsuario = value;
                miPerfilAsignado = true;
            }
        }

        public static EmpleadoDTO[] ListaEmpleadosAsignados
        {
            get
            {
                return listaEmpleados;
            }
            set
            {
                listaEmpleados = value;
                listaEmpleadosAsignada = true;
            }
        }

        public static HistorialChat[] ListarMensajesChat
        {
            get
            {
                return listaMensajes;
            }
            set
            {
                listaMensajes = value;
            }
        }
        #endregion
    }
}
