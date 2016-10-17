using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using ZeusWeb.Helper_Classes;
using ZeusWeb.Models;

namespace ZeusWeb.Controllers
{
    public class InicioController : Controller
    {
        // GET: Inicio
        public ActionResult Inicio()
        {
            ViewBag.lista = Perfil_Login.ListaEmpleadosAsignados.ToList();
            ViewBag.miPerfil = Perfil_Login.miPerfil;
            ViewBag.menu = true;
            ViewBag.mapa = false;

            ViewBag.style = "position: fixed; width: 100%;";
            return View();
        }

        // POST: Inicio/Create
        [HttpPost]
        public ActionResult Create(FormCollection collection)
        {
            try
            {
                // TODO: Add insert logic here
                return RedirectToAction("Index");
            }
            catch
            {
                return View();
            }
        }
        
        // POST: Inicio/Edit/5
        [HttpPost]
        public ActionResult Edit(int id, FormCollection collection)
        {
            try
            {
                // TODO: Add update logic here
                return RedirectToAction("Index");
            }
            catch
            {
                return View();
            }
        }
    }
}
