using System.Threading.Tasks;
using Android.App;
using Android.Content;
using Android.OS;
using Android.Support.V7.App;
using Android.Content.PM;

namespace Acquaint.Native.Droid
{
	/// <summary>
	/// Splash activity. Android doesn't support splash screens out of the box (like iOS), so we're making our own.
	/// </summary>
	[Activity(ScreenOrientation = ScreenOrientation.Portrait, MainLauncher = true, Theme = "@style/AcquaintTheme.Splash", Icon = "@mipmap/icon", NoHistory = true)]
	public class SplashActivity : AppCompatActivity
	{
		protected override async void OnCreate(Bundle savedInstanceState)
		{
			base.OnCreate(savedInstanceState);
            
			// await a new task
			await Task.Factory.StartNew(async () => {

				// delay for 2 seconds on the splash screen
				await Task.Delay(2000);

                if (Perfil_Login.logeado)
                {
                    // start the AcquaintanceListActivity
                    StartActivity(new Intent(Application.Context, typeof(Menu)));
                }
                else
                {
                    // start the AcitivyLogin
                    StartActivity(new Intent(Application.Context, typeof(ActivityLogin)));
                }
                Finish();
            });
		}

        protected override void OnDestroy()
        {
            base.OnDestroy();
        }

        protected override void OnResume()
        {
            base.OnResume();
        }

        protected override void OnPause()
        {
            base.OnPause();
        }

        protected override void OnSaveInstanceState(Bundle outState)
        {
            base.OnSaveInstanceState(outState);
        }
    }
}

