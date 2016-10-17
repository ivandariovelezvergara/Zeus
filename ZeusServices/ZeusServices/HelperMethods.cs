using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.Data;
using System.Data.SqlClient;
using System.Configuration;

namespace ZeusServices
{
    public static class HelperMethods
    {
        public static SqlConnection db_SQL;
        public static string conStr = "";

        public static void OpenConnection_Net()
        {
            conStr = "server=" + ConfigurationManager.AppSettings["PATH_DIR_IP"] + "" +
            ";user id=" + ConfigurationManager.AppSettings["PATH_USER"] + "" +
            ";password=" + ConfigurationManager.AppSettings["PATH_PASS"] + "" +
            ";database=" + ConfigurationManager.AppSettings["PATH_BD"] + "";

            db_SQL = new SqlConnection(conStr);
        }

        public static void Terminar_Net()
        {
            db_SQL.Close();
            db_SQL = null;
        }

        public static List<UbicacionDTO> LlenarCoordenadas(List<tbl_coordenadas> Listacoordenadas)
        {
            List<UbicacionDTO> coordenadasEnviar = new List<UbicacionDTO>();

            foreach (var coordenada in Listacoordenadas)
            {
                if (string.IsNullOrWhiteSpace(coordenada.usr_direccion))
                {
                    coordenada.usr_direccion = GoogleGeoCode(coordenada.usr_latitud, coordenada.usr_longitud);
                }

                coordenadasEnviar.Add(new UbicacionDTO(coordenada));
            }

            return coordenadasEnviar;
        }

        public static string GoogleGeoCode(decimal latitud, decimal longitud)
        {
            string url = "https://maps.googleapis.com/maps/api/geocode/json?latlng=" + latitud.ToString().Replace(',', '.') + "," + longitud.ToString().Replace(',', '.') + "&language=es&key=AIzaSyBYIzxss7qe_I550qUTBn9qLhM3Yr7FPzA";

            dynamic googleResults = new Uri(url).GetDynamicJsonObject();

            try
            {
                return googleResults.results[0].formatted_address;
            }
            catch (Exception)
            {
                return "Dirección no encontrada";
            }
        }

        public static long ConvertToUnixTimestamp(DateTime date)
        {
            DateTime origin = new DateTime(1970, 1, 1, 0, 0, 0, 0, DateTimeKind.Utc);
            try
            {
                TimeSpan diff = date - origin;
                return (long)Math.Floor(diff.TotalSeconds);
            }
            catch (Exception)
            {
                return 0;
            }
        }

        public static string ConvertFromUnixTimestamp(long? timestamp, bool horas)
        {
            try
            {
                DateTime origin = new DateTime(1970, 1, 1, 0, 0, 0, 0, DateTimeKind.Utc);
                var timeSpan = TimeSpan.FromSeconds((long)timestamp);
                var localDateTime = origin.Add(timeSpan);

                if (horas)
                {
                    return string.Format("{0:yyyy/MM/dd HH:mm}", localDateTime);
                }
                else
                {
                    return string.Format("{0:yyyy/MM/dd}", localDateTime);
                }
            }
            catch (Exception)
            {
                return " ";
            }
        }
    }
}
