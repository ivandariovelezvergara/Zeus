namespace Acquaint.Native.Droid
{
    public static class Perfil_Login
    {
        // Propiedades para controlar el acceso a los datos privados SUPER IMPORTANTES para las activities
		public static UbicacionDTO[] ListaCoordenadasEmpleado { get; set;}

		public static bool logeado { get; set;}

		public static EmpleadoDTO miPerfil { get; set; }

        public static EmpleadoDTO[] ListaEmpleadosAsignados { get; set; }
    }
}