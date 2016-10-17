using System;
using System.Collections.Generic;
using System.Linq;
using System.Web.Mvc;
using ZeusWeb.Models;
using ZeusWeb.ZeusService;

namespace ZeusWeb.Controllers
{
    public class ActualizarController : Controller
    {
        public List<EmpleadoDTO> lista { get;set; }

        public ActionResult Mostrar()
        {
            ServiceZeusClient cls = new ServiceZeusClient();
            lista = cls.ListaEmpleadosAsignados(1).ToList();

            var model = new List<ActualizarModels>();

            for (int i = 0; i < lista.Count; i++)
            {
                model.Add(new ActualizarModels
                {
                    nombres = lista[i].usr_nombres,
                    apellidos = lista[i].usr_apellidos,
                    IDUSUARIO = lista[i].ID_Login,
                    imagen = lista[i].usr_fotografia,
                    cargoNombre = lista[i].grp_nombre_cargo,
                    celular = lista[i].usr_telefonoMovil
                });
            }           
            return PartialView("Actualizar", model);
        }
        // GET: Actualizar

        public ActionResult ActualizarItem(ActualizarModels model)
        {
            try
            {
                ServiceZeusClient cls = new ServiceZeusClient();

                model.cargo = 1;

                //cls.AgregarEmpleado(model.login, model.pass, HelperMethods.ConvertToUnixTimestamp(DateTime.Now), HelperMethods.ConvertToUnixTimestamp(DateTime.Now),
                //   HelperMethods.ConvertToUnixTimestamp(DateTime.Now), model.nombres, model.apellidos, model.direccion, model.salario,
                //   model.celular, model.telefono, model.correo, (short)model.departamento, HelperMethods.getFoto(model.foto), model.identificacion,
                //   (short)model.cargo, (short)model.grupo, HelperMethods.ConvertToUnixTimestamp(model.fechaNacimiento));
                
                return PartialView("Actualizar", model);
            }
            catch (Exception ex)
            {
                throw ex;
            }
        }


        [AcceptVerbs(HttpVerbs.Post)]
        public ActionResult getInfoPersona(string idUsuario)
        {
            try
            {
                ServiceZeusClient cls = new ServiceZeusClient();
                lista = cls.ListaEmpleadosAsignados(1).ToList();

                List<EmpleadoDTO> lis = (from r in lista.AsEnumerable()
                                            where (r.ID_Login == Convert.ToInt32(idUsuario))
                                            select r).ToList();

                var model = new List<ActualizarModels>();
                
                    model.Add(new ActualizarModels
                    {
                        login = lis[0].usr_login,
                        nombres = lis[0].usr_nombres,
                        apellidos = lis[0].usr_apellidos,
                        IDUSUARIO = lis[0].ID_Login,
                        cargoNombre = lis[0].grp_nombre_cargo,
                        celular = lis[0].usr_telefonoMovil,
                        fotoA = Convert.ToBase64String(lis[0].usr_fotografia),
                        correo = lis[0].usr_email,
                        identificacion = lis[0].usr_identificacion,
                        telefono = lis[0].usr_telefonoFijo,
                        direccion = lis[0].usr_direccion,
                        fechaNacimiento = Convert.ToDateTime(lis[0].usr_fechanacimiento),
                        cargo = lis[0].usr_cargo_ID,
                        grupo = lis[0].usr_grupo_encargado_ID,
                        departamento = lis[0].usr_departamento_ID,
                        salario = (decimal)lis[0].usr_salario
                    });

                return Json(model, JsonRequestBehavior.AllowGet);
            }
            catch (Exception ex)
            {
                throw ex;
            }
        }
    }
}
