using System.Web;
using System.Web.Optimization;

namespace BPT
{
    public class BundleConfig
    {
        // For more information on bundling, visit https://go.microsoft.com/fwlink/?LinkId=301862
        public static void RegisterBundles(BundleCollection bundles)
        {
            bundles.Add(new ScriptBundle("~/bundles/jquery").Include(
                        "~/Scripts/jquery-{version}.js"));

            bundles.Add(new ScriptBundle("~/bundles/jqueryval").Include(
                        "~/Scripts/jquery.validate*"));

            // Use the development version of Modernizr to develop with and learn from. Then, when you're
            // ready for production, use the build tool at https://modernizr.com to pick only the tests you need.
            bundles.Add(new ScriptBundle("~/bundles/modernizr").Include(
                        "~/Scripts/modernizr-*"));

            bundles.Add(new ScriptBundle("~/bundles/bootstrap").Include(
                      "~/Scripts/bootstrap.js"));

            bundles.Add(new StyleBundle("~/Content/css").Include(
                      "~/Content/bootstrap.css",
                      "~/Content/site.css"));
            RegisterVendorBundles(bundles);
            RegisterAppBundles(bundles);
        }

        private static void RegisterVendorBundles(BundleCollection bundles)
        {
            bundles.Add(new StyleBundle("~/css/vendor").Include(
                "~/Content/themes/css/fonts.css",
                "~/Content/bootstrap/bootstrap.min.css",
                "~/Content/ui-bootstrap/ui-bootstrap-csp.css",
                "~/Content/angular-busy/angular-busy.css",
                "~/Content/themes/css/bootstrap-multiselect.css",
                "~/Content/themes/css/select2.css",
                "~/Content/themes/css/datepicker3.css",
                "~/Content/themes/css/icheck/blue.css",
                "~/Content/themes/css/skins/skin-blue.css",
                "~/Content/jqueryui/jquery-ui.css",
                "~/Content/toastr/toastr.css",
                "~/Content/ngTable/ng-table.min.css",
                "~/Content/css/layout.css"
                ));

            bundles.Add(new ScriptBundle("~/scripts/vendor").Include(
                "~/Scripts/jquery/Chart.js",
                 "~/Scripts/jquery/jquery-{version}.js",
                 "~/Scripts/bootstrap/bootstrap.min.js",
                  "~/Scripts/bootstrap/bootstrap-multiselect.js",
                 "~/Scripts/jqueryui/jquery-ui.js",
                 "~/Content/themes/js/plugins/fastclick/fastclick.js",
                 "~/Content/themes/js/plugins/slimscroll/jquery.slimscroll.js",
                 "~/Content/themes/js/plugins/select2/select2.full.js",
                 "~/Content/themes/js/plugins/datepicker/bootstrap-datepicker.js",
                 "~/Content/themes/js/plugins/icheck/icheck.js",
                 "~/Content/themes/js/plugins/inputmask/jquery.inputmask.bundle.js",
                 "~/Scripts/angular/angular.js",
                 "~/Scripts/angular/angular-animate.js",
                 "~/Scripts/angular/angular-cookies.js",
                 "~/Scripts/angular/angular-route.js",
                 "~/Scripts/angular/angular-touch.js",
                 "~/Scripts/angular-ui/ui-bootstrap.js",
                 "~/Scripts/angular-ui/ui-bootstrap-tpls.js",
                 "~/Scripts/angular-css/angular-css.js",
                 "~/Scripts/moment/moment.js",
                 "~/Scripts/toastr/toastr.js",
                 "~/Content/ngTable/ng-table.min.js",
                 "~/Scripts/angular-moment/angular-moment.js",
                 "~/Scripts/angular-truncate/angular-truncate.js",
                 "~/Scripts/lodash/ng-lodash.min.js",
                 "~/Scripts/inputMask/angular-input-masks.js",
                 "~/Scripts/angular-busy/angular-busy.js",
                 "~/Scripts/ckeditor/ckeditor.js"));
        }

        private static void RegisterAppBundles(BundleCollection bundles)
        {
            bundles.Add(new ScriptBundle("~/scripts/app")
                .Include(
                    //"~/Content/themes/js/app.js",
                    //"~/Content/themes/js/init.js",

                    "~/app/env.js",
                    //"~/application/env.production.js",
                    "~/app/app.routes.js",
                    "~/app/app.components.js",
                    "~/app/app.js",
                    "~/app/app.constants.js")
                .IncludeDirectory("~/app/pages", "*.js", true)
                .IncludeDirectory("~/app/directives", "*.js", true)
                .IncludeDirectory("~/app/components", "*.js", true)
                .IncludeDirectory("~/app/common", "*.js", true)
                .IncludeDirectory("~/app/services", "*.js", true));
        }
    }
}
