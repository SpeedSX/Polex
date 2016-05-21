﻿using System.Web.Mvc;
using Abp.Web.Mvc.Authorization;

namespace Polex.Web.Controllers
{
    [AbpMvcAuthorize]
    public class HomeController : PolexControllerBase
    {
        public ActionResult Index()
        {
            return View("~/App/Main/views/layout/layout.cshtml"); //Layout of the angular application.
        }
	}
}