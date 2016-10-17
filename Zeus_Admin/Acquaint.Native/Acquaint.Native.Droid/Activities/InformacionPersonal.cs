using Android.App;
using Android.Content;
using Android.OS;
using Android.Support.V7.App;
using Android.Views;
using Android.Widget;
using Toolbar = Android.Support.V7.Widget.Toolbar;
using System;
using Android.Graphics;

namespace Acquaint.Native.Droid
{
    [Activity]
    public class InformacionPersonal : AppCompatActivity
    {
        TextView nombres;
        TextView apellidos;
        TextView nDocumento;
        TextView fechaNacimiento;
        TextView telefonoMovil;
        TextView telefonoFijo;
        TextView direccion;
        TextView email;
        TextView fechaIngreso;
		TextView departamento;
		Button Tareas;
		Button Ubicacion;
		Button Mensajeria;
		ProgressDialog progress;
        ImageView profilePhotoImageView;
		EmpleadoDTO empleadoConsulta;
		View Layout;
		int IdEmpleado;

        #region Lifecycle Implementation
        protected override void OnCreate(Bundle savedInstanceState)
        {
            base.OnCreate(savedInstanceState);
			Layout = LayoutInflater.Inflate(Resource.Layout.InformacionPersonal, null);
            SetContentView(Layout);

            nombres = FindViewById<TextView>(Resource.Id.Nombre);
            apellidos = FindViewById<TextView>(Resource.Id.Apellido);
            nDocumento = FindViewById<TextView>(Resource.Id.NDocumento);
            fechaNacimiento = FindViewById<TextView>(Resource.Id.FechaNacimiento);
            telefonoMovil = FindViewById<TextView>(Resource.Id.TelefonoMovil);
            telefonoFijo = FindViewById<TextView>(Resource.Id.TelefonoFijo);
            direccion = FindViewById<TextView>(Resource.Id.Direccion);
            email = FindViewById<TextView>(Resource.Id.Email);
            fechaIngreso = FindViewById<TextView>(Resource.Id.FechaIngreso);
            departamento = FindViewById<TextView>(Resource.Id.Departamento);
            profilePhotoImageView = FindViewById<ImageView>(Resource.Id.ImagenPerfil);
			Tareas = FindViewById<Button>(Resource.Id.TareasPersonal);
			Ubicacion = FindViewById<Button>(Resource.Id.UbicacionPersonal);
			Mensajeria = FindViewById<Button>(Resource.Id.MensajeriaPersonal);
			progress = HelperMethods.setSpinnerDialog("Cargando Coordenadas...", this);

			var toolbar = FindViewById<Toolbar>(Resource.Id.toolbar);
            SetSupportActionBar(toolbar);

            Window.AddFlags(WindowManagerFlags.DrawsSystemBarBackgrounds);
			SupportActionBar.SetHomeButtonEnabled(true);
            SupportActionBar.SetDisplayHomeAsUpEnabled(true);

			// set the activity title and action bar title
			Title = SupportActionBar.Title = "Informacion Personal";

			HelperMethods.SetupAnimations(this);

            // extract the acquaintance id fomr the intent
            IdEmpleado = Intent.GetIntExtra(GetString(Resource.String.InformacionPersonalIntentKey), 0);

			if (IdEmpleado != 0)
			{
				empleadoConsulta = HelperMethods.getUserById(IdEmpleado);
				informacionPerfil(empleadoConsulta);
			}
            else
			{
                informacionPerfil(Perfil_Login.miPerfil);
				IdEmpleado = Perfil_Login.miPerfil.ID_Login;
				Tareas.Visibility = ViewStates.Invisible;
				Ubicacion.Visibility = ViewStates.Invisible;
				Mensajeria.Visibility = ViewStates.Invisible;
            }
			Conexion_Web_Service._client.BajarCoordenadasEmpleadosCompleted += _client_Lista_BajarCoordenadasEmpleadosCompletedPersonal;

			Ubicacion.Click += delegate {
				Layout.Enabled = false;
				long fechaFinal = HelperMethods.ConvertToUnixTimestamp(DateTime.Now);
				long fechaInicial = fechaFinal - 3600;
				int[] ID_UsuariosConsultar = { IdEmpleado };

				Conexion_Web_Service._client.BajarCoordenadasEmpleadosAsync(fechaInicial, fechaFinal, ID_UsuariosConsultar);
				progress.Show();
			};
        }

        protected override void OnResume()
        {
            base.OnResume();
        }

        protected override void OnDestroy()
        {
			Conexion_Web_Service._client.BajarCoordenadasEmpleadosCompleted -= _client_Lista_BajarCoordenadasEmpleadosCompletedPersonal;
            base.OnDestroy();
        }

        protected override void OnPause()
        {
            base.OnPause();
        }

        // this override is called when the back button is tapped
        public override bool OnOptionsItemSelected(IMenuItem item)
        {
            Finish();
			HelperMethods.makeTransition(this);
            return true;
        }

        protected override void OnSaveInstanceState(Bundle outState)
        {
            base.OnSaveInstanceState(outState);
        }
		#endregion

		#region  Helper Methods      
		void _client_Lista_BajarCoordenadasEmpleadosCompletedPersonal(object sender, BajarCoordenadasEmpleadosCompletedEventArgs BajarCoordenadasEmpleadosCompleted)
		{
			Intent detailIntent = null;

			if (BajarCoordenadasEmpleadosCompleted.Error == null)
			{
				Perfil_Login.ListaCoordenadasEmpleado = BajarCoordenadasEmpleadosCompleted.Result;
				detailIntent = new Intent(this, typeof(AcquaintanceDetailActivity));

				// Add some identifying item data to the intent. In this case, the id of the acquaintance for which we're about to display the detail screen.
				detailIntent.PutExtra(Resources.GetString(Resource.String.acquaintanceDetailIntentKey), IdEmpleado);

				RunOnUiThread(() =>
				{
					Layout.Enabled = true;
					progress.Hide();
					StartActivity(detailIntent);
					HelperMethods.makeTransition(this);
				});
			}
			else
			{
				RunOnUiThread(() =>
				{
					Layout.Enabled = true;
					progress.Hide();
					Android.App.AlertDialog.Builder alerta = HelperMethods.setAlert(HelperMethods.problemaConexion, this);
					alerta.Show();
				});
			}
		}

        void informacionPerfil(EmpleadoDTO empleado)
        {
            // inflate and set the profile image view
            if (profilePhotoImageView != null)
            {
                Bitmap image = null;
                byte[] imagenProvisional = null;

                if (empleado.usr_fotografia != null)
                    image = BitmapFactory.DecodeByteArray(empleado.usr_fotografia, 0, empleado.usr_fotografia.Length);
                else
                {
                    imagenProvisional = Convert.FromBase64String(HelperMethods.base64DefaultImage);
                    image = BitmapFactory.DecodeByteArray(imagenProvisional, 0, imagenProvisional.Length);
                    imagenProvisional = null;
                }
                profilePhotoImageView.SetImageBitmap(HelperMethods.redondearImagen(image, 500, 500));
				image.Dispose();
				image = null;
            }

            // Test all properties of EmpleadoDTO agains null, if is null put " " instead;
            nombres.Text = empleado.usr_nombres ?? " ";
            apellidos.Text = empleado.usr_apellidos ?? " ";
            nDocumento.Text = empleado.usr_identificacion ?? " ";
            fechaNacimiento.Text = empleado.usr_fechanacimiento ?? " ";

            telefonoMovil.Text = empleado.usr_telefonoMovil ?? " ";
            telefonoFijo.Text = empleado.usr_telefonoFijo ?? " ";
            direccion.Text = empleado.usr_direccion ?? " ";
            email.Text = empleado.usr_email ?? " ";       
            departamento.Text = empleado.grp_nombre_cargo ?? " ";
			fechaIngreso.Text = empleado.usr_fecha_creacion_usuario ?? " ";
        }
    }
    #endregion
}