using Microsoft.Owin;
using Owin;

[assembly: OwinStartupAttribute(typeof(ZeusWeb.Startup))]
namespace ZeusWeb
{
    public partial class Startup
    {
        public void Configuration(IAppBuilder app)
        {
            ConfigureAuth(app);
        }
    }
}
