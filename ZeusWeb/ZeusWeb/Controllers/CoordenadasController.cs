using System;
using System.Collections.Generic;
using System.Web.Mvc;
using ZeusWeb.Helper_Classes;
using ZeusWeb.Models;
using ZeusWeb.ZeusService;
using System.Linq;

namespace ZeusWeb.Controllers
{
    public class CoordenadasController : Controller
    {
        public ActionResult Index(FormCollection form)
        {
            ViewBag.miPerfil = Perfil_Login.miPerfil;
            ViewBag.lista = Perfil_Login.ListaEmpleadosAsignados.ToList();
            ViewBag.menu = false;
            ViewBag.mapa = true;
            ViewBag.style = "position: relative; width: 101%;";

            List<CoordenadasContainerModel> listaCoordenadas = actualizarCoordenadas(form);

            if (form["Menu"] == "true")
            {
                ViewBag.vengoDelMenu = true;
            }
            else
            {
                ViewBag.vengoDelMenu = false;
            }

            return View(listaCoordenadas);
        }
        
        [HttpPost]
        public JsonResult NuevaConsulta(FormCollection form)
        {
            List<CoordenadasContainerModel> listaCoordenadas = actualizarCoordenadas(form);
            return Json(listaCoordenadas);
        }

        private List<CoordenadasContainerModel> actualizarCoordenadas(FormCollection form)
        {
            List<CoordenadasContainerModel> coordenadasUsuarios = new List<CoordenadasContainerModel>();
            string commaDelimitedChannel = form["select-industry"];
            int[] ID_ConsultarUsuarios_Int = Array.ConvertAll(commaDelimitedChannel.Split(','), int.Parse);
            long fechaInicial = 0;
            long fechaFinal = 0;
            ViewBag.ID_Suscriptores = commaDelimitedChannel;
            ViewBag.ID_Suscriptores_Int = ID_ConsultarUsuarios_Int;

            if (form.Count > 2)
            {
                fechaInicial = HelperMethods.ConvertToUnixTimestamp(Convert.ToDateTime(form["fechaInicial"].ToString()));
                fechaFinal = HelperMethods.ConvertToUnixTimestamp(Convert.ToDateTime(form["fechaFinal"].ToString()));
            }
            
            ServiceZeusClient servicio = new ServiceZeusClient();   
            UbicacionDTO[] coordenadasServicio = servicio.BajarCoordenadasEmpleados(fechaInicial, fechaFinal, ID_ConsultarUsuarios_Int);

            if (coordenadasServicio != null)
            {
                foreach (var ID_usuario in ID_ConsultarUsuarios_Int)
                {
                    List<CoordenadasModel> listaCoordenadas = new List<CoordenadasModel>();

                    var coordenadasUsuarioUnico = (from consultaUsuarios in coordenadasServicio
                                                   where consultaUsuarios.ID_Usuario_Ubicacion == ID_usuario select consultaUsuarios).ToList();

                    foreach (var item in coordenadasUsuarioUnico)
                    {
                        listaCoordenadas.Add(new CoordenadasModel(item));
                    }

                    CoordenadasContainerModel containerListaCoordenadas = new CoordenadasContainerModel(listaCoordenadas);
                    coordenadasUsuarios.Add(containerListaCoordenadas);
                }               
            }
            
            return coordenadasUsuarios;
        }
    }
}