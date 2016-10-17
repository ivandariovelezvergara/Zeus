using System;
using System.Collections.Generic;

namespace Acquaint.Native.Droid
{
	public class Informes
	{
		public int InformeID { get; set; }

		public string NombreInforme { get; set; }

		public string DescripcionInforme { get; set; }
	}

	public class InformesColeccion 
	{
		public readonly List<Informes> ListaInformes;

		public InformesColeccion()
		{
			ListaInformes = ListarInformes();
		}

		List<Informes> ListarInformes()
		{
			return new List<Informes>()
			{
				new Informes() {InformeID = 0, NombreInforme = "Informe Coordenadas", DescripcionInforme = "Lista las coordenadas de un individuo entre dos fechas"},
				new Informes() {InformeID = 1 , NombreInforme = "Informe Personal Asignado", DescripcionInforme= "Lista personal actualmente asignado"},
				new Informes() {InformeID = 2 , NombreInforme = "Estadistico", DescripcionInforme= "Estadisticas de un individuo"},
				new Informes() {InformeID = 3 , NombreInforme = "Personalizado", DescripcionInforme= "Personaliza un informe"},
				new Informes() {InformeID = 4 , NombreInforme = "Ultimo Punto", DescripcionInforme= "Ultimo punto de un individuo"},
				new Informes() {InformeID = 5 , NombreInforme = "Zonas", DescripcionInforme= "Administracion de zonas"},
				new Informes() {InformeID = 6 , NombreInforme = "Combustible", DescripcionInforme= "Administracion de combustible"},
				new Informes() {InformeID = 7 , NombreInforme = "Geocercas Embebidas", DescripcionInforme= "Administracion de Geocercas"},
				new Informes() {InformeID = 8 , NombreInforme = "Gestion Alarmas", DescripcionInforme= "Administracion de alarmas"},
				new Informes() {InformeID = 9 , NombreInforme = "Mantenimientos Flotas", DescripcionInforme= "Informe de Mantenimiento de flotas"},
				new Informes() {InformeID = 10 , NombreInforme = "Seleccion Grupos", DescripcionInforme= "Administracion Grupos"},
			};
		}
	}
}


