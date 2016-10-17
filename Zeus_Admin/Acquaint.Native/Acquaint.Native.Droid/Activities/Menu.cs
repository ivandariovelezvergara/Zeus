using System;
using Android.App;
using Android.Content;
using Android.OS;
using Android.Widget;

namespace Acquaint.Native.Droid
{
    [Activity]
    public class Menu : Activity
    {
        ImageButton BotonPerfil;
        ImageButton BotonPerfilContactos;
        ImageButton BotonGeoreferencia;
        ImageButton BotonMensajeria;
        ImageButton BotonInformes;
        ImageButton BotonConfiguracion;
        Intent intentLista;

        #region Lifecycle Implementation
        protected override void OnCreate(Bundle savedInstanceState)
        {
            base.OnCreate(savedInstanceState);

            SetContentView(Resource.Layout.Menu);

            intentLista = new Intent(Application.Context, typeof(AcquaintanceListActivity));

            BotonPerfil = FindViewById<ImageButton>(Resource.Id.BotonPerfil);
            BotonPerfilContactos = FindViewById<ImageButton>(Resource.Id.BotonPerfilContactos);
            BotonGeoreferencia = FindViewById<ImageButton>(Resource.Id.BotonGeoreferencia);
            BotonMensajeria = FindViewById<ImageButton>(Resource.Id.BotonMensajeria);
            BotonInformes = FindViewById<ImageButton>(Resource.Id.BotonInformes);
            BotonConfiguracion = FindViewById<ImageButton>(Resource.Id.Boton);

            // Set Background Resource for image
            BotonPerfil.SetBackgroundResource(Resource.Mipmap.MiPerfil);
            BotonPerfilContactos.SetBackgroundResource(Resource.Mipmap.ListaContactos);
            BotonGeoreferencia.SetBackgroundResource(Resource.Mipmap.Mapa);
            BotonMensajeria.SetBackgroundResource(Resource.Mipmap.Chat);
            BotonInformes.SetBackgroundResource(Resource.Mipmap.Informes);
            BotonConfiguracion.SetBackgroundResource(Resource.Mipmap.Configuracion);

            // Set Click Events
            BotonPerfil.Click += BotonPerfil_Click;
            BotonPerfilContactos.Click += BotonPerfilContactos_Click;
            BotonGeoreferencia.Click += BotonGeoreferencia_Click;
            BotonMensajeria.Click += BotonMensajeria_Click;
            BotonInformes.Click += BotonInformes_Click;
			Android_Service_Client.StartLocationService();
        }

        protected override void OnResume()
        {
            base.OnResume();
        }

        protected override void OnDestroy()
        {
            base.OnDestroy();
			//Android_Service_Client.StopLocationService();
        }

        protected override void OnPause()
        {
            base.OnPause();
        }

        protected override void OnRestart()
        {
            base.OnRestart();   
        }

        protected override void OnSaveInstanceState(Bundle outState)
        {
            base.OnSaveInstanceState(outState);
        }

		public override void OnBackPressed()
		{
			Perfil_Login.logeado = false;
			startActivityTransition(new Intent(Application.Context, typeof(ActivityLogin)));
			base.OnBackPressed();
		}
		#endregion

		#region Button Events
        void BotonInformes_Click(object sender, EventArgs e)
        {
			startActivityTransition(new Intent(Application.Context, typeof(InformesList)));
		}

        void BotonMensajeria_Click(object sender, EventArgs e)
        {
            intentLista.PutExtra(Resources.GetString(Resource.String.acquaintanceListIntentKey), Resources.GetString(Resource.String.ChatActivity));
            startActivityTransition(intentLista);
        }

        void BotonGeoreferencia_Click(object sender, EventArgs e)
        {
            intentLista.PutExtra(Resources.GetString(Resource.String.acquaintanceListIntentKey), Resources.GetString(Resource.String.MapaActivity));
            startActivityTransition(intentLista);
        }

        void BotonPerfilContactos_Click(object sender, EventArgs e)
        {
            intentLista.PutExtra(Resources.GetString(Resource.String.acquaintanceListIntentKey), Resources.GetString(Resource.String.PerfilContactosActivity));
            startActivityTransition(intentLista);
        }

        void BotonPerfil_Click(object sender, EventArgs e)
        {
            startActivityTransition(new Intent(Application.Context, typeof(InformacionPersonal)));
        }
		#endregion

		void startActivityTransition(Intent intentMenu)
		{ 
			StartActivity(intentMenu);
			HelperMethods.makeTransition(this);
		}
    }
}