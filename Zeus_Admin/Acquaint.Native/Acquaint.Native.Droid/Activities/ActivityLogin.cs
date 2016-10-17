using System;
using Android.App;
using Android.Content;
using Android.OS;
using Android.Widget;
using Android.Views;

namespace Acquaint.Native.Droid
{
    [Activity(WindowSoftInputMode = SoftInput.StateHidden)]
    public class ActivityLogin : Activity
    {
        Button BotonAceptar;
        EditText TextoUsuario;
		EditText TextoContrasena;
        ProgressDialog progress;
        AlertDialog.Builder alerta;
		bool verificandoLogin;

        #region Lifecycle Implementation
        protected override void OnCreate(Bundle savedInstanceState)
        {
            base.OnCreate(savedInstanceState);
            SetContentView(Resource.Layout.Login);

            TextoUsuario = FindViewById<EditText>(Resource.Id.TextoUsuario);
            TextoContrasena = FindViewById<EditText>(Resource.Id.TextoContrasena);
            BotonAceptar = FindViewById<Button>(Resource.Id.BotonAceptar);
            progress = HelperMethods.setSpinnerDialog("Iniciando Sesion...", this);
            Conexion_Web_Service.InitializeServiceClient();

            TextoUsuario.Text = "Ivan";
            TextoContrasena.Text = "Ivan";

            BotonAceptar.Click += BotonAceptar_Click;
            Conexion_Web_Service._client.ListaEmpleadosAsignadosCompleted += _client_ListaEmpleadosAsignadosCompleted;
            Conexion_Web_Service._client.VerificarLoginCompleted += _client_VerificarLoginCompleted;
        }

        protected override void OnDestroy()
        {
			Conexion_Web_Service._client.ListaEmpleadosAsignadosCompleted -= _client_ListaEmpleadosAsignadosCompleted;
			Conexion_Web_Service._client.VerificarLoginCompleted -= _client_VerificarLoginCompleted;
            base.OnDestroy();
        }

        protected override void OnResume()
        {
            base.OnResume();
			if (verificandoLogin)
			{
				Conexion_Web_Service._client.VerificarLoginAsync(TextoUsuario.Text, TextoContrasena.Text);
				progress.Show();
			}
        }

        protected override void OnPause()
        {
            base.OnPause();
        }

        protected override void OnSaveInstanceState(Bundle outState)
        {
			if (verificandoLogin)
			{
				outState.PutBoolean("verificandoLogin", verificandoLogin);
				progress.Cancel();
			}
            base.OnSaveInstanceState(outState);
        }

		protected override void OnRestoreInstanceState(Bundle savedInstanceState)
		{
			base.OnRestoreInstanceState(savedInstanceState);
			verificandoLogin = savedInstanceState.GetBoolean("verificandoLogin");
		}

        #endregion

        #region Events
        void BotonAceptar_Click(object sender, EventArgs e)
        {
            BotonAceptar.Enabled = false;
			verificandoLogin = true;
			if (string.IsNullOrWhiteSpace(TextoUsuario.Text))
            {
                alerta = HelperMethods.setAlert("Ingrese un Usuario" , this);
                alerta.Show();
                BotonAceptar.Enabled = true;
				verificandoLogin = false;
                return;
            }

			if (string.IsNullOrWhiteSpace(TextoContrasena.Text))
            {
                alerta = HelperMethods.setAlert("Ingrese una Contraseña", this);
                alerta.Show();
                BotonAceptar.Enabled = true;
				verificandoLogin = false;
                return;
            }

            Conexion_Web_Service._client.VerificarLoginAsync(TextoUsuario.Text, TextoContrasena.Text);
            progress.Show();
        }
        #endregion

        #region Methods Completed
        void _client_VerificarLoginCompleted(object sender, VerificarLoginCompletedEventArgs VerificarLoginCompleted)
        {
            if (VerificarLoginCompleted.Error != null)
            {
                alerta = HelperMethods.setAlert(HelperMethods.problemaConexion, this);
                RunOnUiThread(() => {
                    progress.Cancel();
                    alerta.Show();
                    BotonAceptar.Enabled = true;
					verificandoLogin = false;
                });
            }
            else
            {
                if (VerificarLoginCompleted.Result != null)
                {
                    Perfil_Login.miPerfil = VerificarLoginCompleted.Result;
					Conexion_Web_Service._client.ListaEmpleadosAsignadosAsync(Perfil_Login.miPerfil.usr_grupo_encargado_ID);
                }
                else
                {
                    alerta = HelperMethods.setAlert("No es Bienvenido", this);
                    RunOnUiThread(() => {
                        progress.Cancel();
                        alerta.Show();
                        BotonAceptar.Enabled = true;
						verificandoLogin = false;
                    });
                }
            }
        }

        void _client_ListaEmpleadosAsignadosCompleted(object sender, ListaEmpleadosAsignadosCompletedEventArgs ListaEmpleadosAsignadosCompleted)
        {
            if (ListaEmpleadosAsignadosCompleted.Error == null)
            {
                if (ListaEmpleadosAsignadosCompleted.Result != null)
                {
                    Perfil_Login.ListaEmpleadosAsignados = ListaEmpleadosAsignadosCompleted.Result;
                    Perfil_Login.logeado = true;
					RunOnUiThread(() =>
					{
                    	StartActivity(new Intent(Application.Context, typeof(Menu)));
						HelperMethods.makeTransition(this);
                    	Finish();
					});
                }                             
                else
                {
                    alerta = HelperMethods.setAlert("No tienes Empleados Asignados", this);
                    RunOnUiThread(() => {
                        progress.Cancel();
                        alerta.Show();
                        BotonAceptar.Enabled = true;
						verificandoLogin = false;
                    });
                }
            }
            else
            {
                alerta = HelperMethods.setAlert(HelperMethods.problemaConexion, this);
                RunOnUiThread(() => {
                    progress.Hide();
                    alerta.Show();
                    BotonAceptar.Enabled = true;
					verificandoLogin = false;
                });
            }
        }
        #endregion
    }
}