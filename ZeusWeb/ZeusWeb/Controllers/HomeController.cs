using System.Web.Mvc;
using ZeusWeb.Models;
using ZeusWeb.Helper_Classes;

namespace ZeusWeb.Controllers
{
        public class HomeController : Controller
    {
        public ActionResult Login()
        {
            return View();
        }

        // POST: /Account/Login
        [HttpPost]
        [AllowAnonymous]
        [ValidateAntiForgeryToken]
        public ActionResult VerificarLogin(LoginViewModel model, string returnUrl)
        {
            ZeusService.ServiceZeusClient service = new ZeusService.ServiceZeusClient();
            var result = service.VerificarLogin(model.UserName, model.Password);

            if (result != null)
            {
                Perfil_Login.miPerfil = result;
                Perfil_Login.ListaEmpleadosAsignados = service.ListaEmpleadosAsignados(Perfil_Login.miPerfil.usr_grupo_encargado_ID);
                return RedirectToAction("Inicio", "Inicio");
            }
            else
            {
                return RedirectToAction("Login", "Home");
            }
        }
    }
}