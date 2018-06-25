using System;
using System.Collections.Generic;
using System.Data;
using System.Data.Common;
using System.Data.Entity;
using System.Linq;
using System.Net;
using System.Web;
using System.Web.Mvc;
using BPT.DAL;
using BPT.Models;

namespace BPT.Controllers
{
    public class UsersController : Controller
    {
        private BPTContext db = new BPTContext();

        // GET: Users
  
        [HttpGet]
        public JsonResult Index()
        {
            try
            {
                var users = db.Users.ToList();
                return new JsonNetResult()
                {
                    Data = users
                };
            }
            catch (Exception ex)
            {
                return Json("Error occured. " + ex.Message);
            }
        }

        // GET: Users/Details/5
        public ActionResult Details(int? id)
        {
            if (id == null)
            {
                return new HttpStatusCodeResult(HttpStatusCode.BadRequest);
            }
            User user = db.Users.Find(id);
            if (user == null)
            {
                return HttpNotFound();
            }
            return View(user);
        }

        // GET: Users/Create
        public ActionResult Create()
        {
            return View();
        }

        // POST: Users/Create
        // To protect from overposting attacks, please enable the specific properties you want to bind to, for 
        // more details see https://go.microsoft.com/fwlink/?LinkId=317598.
        [HttpPost]
        //[ValidateAntiForgeryToken]
        public ActionResult Create(User user)
        {
            try
            {
                if (ModelState.IsValid)
                {
                    db.Users.Add(user);
                    var result = db.SaveChanges() > 0;
                    return Json(result, JsonRequestBehavior.AllowGet);
                }
                return Json("Model State is not valid");
            }
            catch (DbException ex)
            {
                return Json("Error occured. " + ex.Message);
            }
        }

        [HttpPost]
        public JsonResult Update(User user)
        {
            try
            {
                if (ModelState.IsValid)
                {
                    db.Entry(user).State = EntityState.Modified;
                    var result = db.SaveChanges();
                    return Json(result > 0);
                }
                return Json("Model State is not valid");
            }
            catch (Exception ex)
            {
                return Json("Error occured. " + ex.Message);
            }
        }

        [HttpGet]
        public ActionResult Delete(int id)
        {
            try
            {
                User user = db.Users.Find(id);
                db.Users.Remove(user);
                var result = db.SaveChanges() > 0;
                return Json(result, JsonRequestBehavior.AllowGet);
            }
            catch (Exception ex)
            {
                return Json("Error occured. " + ex.Message);
            }
        }

        protected override void Dispose(bool disposing)
        {
            if (disposing)
            {
                db.Dispose();
            }
            base.Dispose(disposing);
        }
    }
}
