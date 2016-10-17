using System.Collections.Generic;
using ZeusWeb.ZeusService;

namespace ZeusWeb.Models
{
    public class CoordenadasModel
    {
        public int ID_Ubicacion { get; set; }
        public int ID_usuario { get; set; }
        public string Nombre_Completo { get; set; }
        public string Direccion { get; set; }
        public decimal Latitud { get; set; }
        public decimal Longitud { get; set; }
        public decimal? Velocidad { get; set; }
        public decimal Precision { get; set; }
        public decimal Bearing { get; set; }
        public string Tiempo { get; set; }

        public CoordenadasModel() { }
        public CoordenadasModel(UbicacionDTO listaCoordenadas)
        {
            ID_Ubicacion = listaCoordenadas.ID_Coordenada;
            ID_usuario = listaCoordenadas.ID_Usuario_Ubicacion;
            Nombre_Completo = listaCoordenadas.Nombre_Usuario;
            Latitud = listaCoordenadas.Latitud;
            Longitud = listaCoordenadas.Longitud;
            Velocidad = listaCoordenadas.Velocidad;
            Precision = listaCoordenadas.Precision;
            Bearing = listaCoordenadas.Bearing;
            Tiempo = listaCoordenadas.Tiempo;
            Direccion = listaCoordenadas.Direccion;
        }
    }

    public class CoordenadasContainerModel
    {
        public List<CoordenadasModel> coordenadasContainer { get; set; }

        public CoordenadasContainerModel(List<CoordenadasModel> container)
        {
            coordenadasContainer = container;
        }
    }
}