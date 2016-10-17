using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Web;
using System.Web.Mvc;
using ZeusWeb.Models;
using ZeusWeb.ZeusService;

namespace ZeusWeb.Controllers
{
    public class MenuController : Controller
    {

        public ActionResult load(MenuModels model)
        {
            return View("Menu");
        }

        public void saveData(MenuModels model)
        {
            ServiceZeusClient cls = new ServiceZeusClient();

            int cargo = 0;

            if (model.cargo.Equals("Empleado"))
                cargo = 1;
            else
                cargo = 2;

            try
            {
                cls.AgregarEmpleado(model.login, model.pass, HelperMethods.ConvertToUnixTimestamp(DateTime.Now), HelperMethods.ConvertToUnixTimestamp(DateTime.Now),
                    HelperMethods.ConvertToUnixTimestamp(DateTime.Now), model.nombres, model.apellidos, model.direccion, model.salario,
                    model.celular, model.telefono, model.correo, (short)model.departamento, HelperMethods.getFoto(model.foto), model.identificacion,
                    (short)cargo, (short)model.grupo, HelperMethods.ConvertToUnixTimestamp(model.fechaNacimiento));
            }

            catch (Exception) { }
            
        }

        public ActionResult MyAction()
        {
            ViewBag.Images = Directory.EnumerateFiles(Server.MapPath("~/img/CrearUsuario"))
                              .Select(fn => "~/img/CrearUsuario/" + Path.GetFileName(fn));

            return View("");
        }

        public ActionResult listarGrupos()
        {
            //Grupos vm = new Grupos();
            //IEnumerable<GradeTypes> actionTypes = Enum.GetValues(typeof(GradeTypes))
            //                                             .Cast<GradeTypes>();
            //vm.ActionsList = from action in actionTypes
            //                 select new SelectListItem
            //                 {
            //                     Text = action.ToString(),
            //                     Value = action.ToString()
            //                 };


            //return View(vm);
            return null;
        }

        public void saveData2(FormCollection form)
        {
            string nombres = Request.Form["nombres"];
            string apellidos = Request.Form["apellidos"];
            string correo = Request.Form["correo"];
            string identificacion = Request.Form["identificacion"];
            string telefono = Request.Form["telefono"];
            string celular = Request.Form["celular"];
            string direccion = Request.Form["direccion"];
            DateTime fechaNacimiento = Convert.ToDateTime(Request.Form["fechaNacimiento"]);
            string cargo = Request.Form["cargo"];
            string departamento = Request.Form["departamento"];
            string Pass = Request.Form["Pass"];
            string RepPass = Request.Form["RepPass"];

        }

    }
}

