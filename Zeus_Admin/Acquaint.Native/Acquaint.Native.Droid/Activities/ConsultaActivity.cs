using System;
using Android.App;
using Android.Content;
using Android.OS;
using Android.Views;
using Android.Widget;
using Toolbar = Android.Support.V7.Widget.Toolbar;
using Android.Support.V7.App;
using Android.Content.PM;

namespace Acquaint.Native.Droid
{
    [Activity(NoHistory = true, ScreenOrientation = ScreenOrientation.Portrait)]
    public class ConsultaActivity : AppCompatActivity
    {
        const byte TIME_DIALOG_ID = 0;
        const byte TIME_DIALOG_ID_FIN = 1;

        Button BotonEnviar;
        TextView time_display;
        Button pick_button;
        TextView timeFinal_display;
        Button pickFinal_button;
        ProgressDialog progress;
        Android.App.AlertDialog.Builder alerta;
        DateTime fechaInicial;
        DateTime fechaFinal;
        int horaInicial;
        int minutoInicial;
        int horaFinal;
        int minutoFinal;
        int idUsuarioSeleccionado = 0;

        #region Lifecycle Implementation
        protected override void OnCreate(Bundle savedInstanceState)
        {
            base.OnCreate(savedInstanceState);

            var consulta = LayoutInflater.Inflate(Resource.Layout.Consulta, null);

            SetContentView(consulta);

			BotonEnviar = FindViewById<Button>(Resource.Id.btnEnviar);
			Spinner spinner = FindViewById<Spinner>(Resource.Id.spinner);
			time_display = FindViewById<TextView>(Resource.Id.txtHora);
			timeFinal_display = FindViewById<TextView>(Resource.Id.txtHoraFin);
			pick_button = FindViewById<Button>(Resource.Id.btnFechaInicial);
			pickFinal_button = FindViewById<Button>(Resource.Id.btnFechaFinal);
			int IdEmpleado = Intent.GetIntExtra(GetString(Resource.String.ConsultaIntentKey), 0);
			time_display.Text = "llegue";
            // setup the action bar
            SetSupportActionBar(FindViewById<Toolbar>(Resource.Id.toolbar));

            // ensure that the system bar color gets drawn
            Window.AddFlags(WindowManagerFlags.DrawsSystemBarBackgrounds);

            SupportActionBar.SetDisplayHomeAsUpEnabled(true);
            SupportActionBar.SetHomeButtonEnabled(true);
            Title = SupportActionBar.Title = "Consulta";

            // Spinner o combo que muestra la lista de empleados disponibles
			ArrayAdapter<EmpleadoDTO> adapter = new ArrayAdapter<EmpleadoDTO>(this, Android.Resource.Layout.SimpleSpinnerItem,  Perfil_Login.ListaEmpleadosAsignados);
            adapter.SetDropDownViewResource(Android.Resource.Layout.SimpleSpinnerDropDownItem);
            spinner.Adapter = adapter;

			if (IdEmpleado != 0)
			{
				EmpleadoDTO empleado = HelperMethods.getUserById(IdEmpleado);
				int spinnerPosition = adapter.GetPosition(empleado);
				spinner.SetSelection(spinnerPosition);
			}

            #region Calendario y Horas          
            // Invoca el fragmento que contiene el calendario de fecha final
            var fragFin = FragmentManager.BeginTransaction();
            var fragFinal = new DatePickerFinFragment();
            fragFin.Add(Resource.Id.fragment_Fecha_Final, fragFinal);
            fragFin.Commit();

            // Invoca el fragmento que contiene el calendario de fecha inicial
            var fragTx = FragmentManager.BeginTransaction();
            var frag = new DatePickerFragment();
            fragTx.Add(Resource.Id.fragment_Fecha_Inicial, frag);
            fragTx.Commit();

            // Get the current time
            horaInicial = DateTime.Now.Hour;
            horaFinal = DateTime.Now.Hour + 1;
            minutoInicial = DateTime.Now.Minute;
            minutoFinal = DateTime.Now.Minute;

            // Display the current date
            UpdateDisplay(time_display, TIME_DIALOG_ID);
            UpdateDisplay(timeFinal_display, TIME_DIALOG_ID_FIN);
			#endregion

			pick_button.Click += (o, e) => ShowDialog(TIME_DIALOG_ID);
			pickFinal_button.Click += (o, e) => ShowDialog(TIME_DIALOG_ID_FIN);
			BotonEnviar.Click += BotonEnviar_Click;
			spinner.ItemSelected += spinner_ItemSelected;
			Conexion_Web_Service._client.BajarCoordenadasEmpleadosCompleted += _client_Consulta_BajarCoordenadasEmpleadosCompleted;
        }

        protected override void OnResume()
        {
            base.OnResume();
        }

        protected override void OnDestroy()
        {
			Conexion_Web_Service._client.BajarCoordenadasEmpleadosCompleted -= _client_Consulta_BajarCoordenadasEmpleadosCompleted;
            base.OnDestroy();
        }

        protected override void OnPause()
        {
            base.OnPause();
        }

        protected override void OnSaveInstanceState(Bundle outState)
        {
            base.OnSaveInstanceState(outState);
        }

        // this override is called when the back button is tapped
        public override bool OnOptionsItemSelected(IMenuItem item)
        {
            Finish();
			HelperMethods.makeTransition(this);
            return true;
        }
        #endregion

        #region -> Dialog Hours - Events
        [Obsolete]
        protected override Dialog OnCreateDialog(int id)
        {
            if (id == TIME_DIALOG_ID)
                return new TimePickerDialog(this, TimePickerCallback, horaInicial, minutoInicial, false);
            if (id == TIME_DIALOG_ID_FIN)
                return new TimePickerDialog(this, TimePickerCallbackFin, horaFinal, minutoFinal, false);

            return null;
        }

        void TimePickerCallback(object sender, TimePickerDialog.TimeSetEventArgs e)
        {
            horaInicial = e.HourOfDay;
            minutoInicial = e.Minute;
            UpdateDisplay(time_display, TIME_DIALOG_ID);          
        }

        void TimePickerCallbackFin(object sender, TimePickerDialog.TimeSetEventArgs e)
        {
            horaFinal = e.HourOfDay;
            minutoFinal = e.Minute;
            UpdateDisplay(timeFinal_display, TIME_DIALOG_ID_FIN);
        }

        void spinner_ItemSelected(object sender, AdapterView.ItemSelectedEventArgs e)
        {
            Spinner spinner = (Spinner)sender;
            var obj = spinner.Adapter.GetItem(e.Position);
            var propertyInfo = obj.GetType().GetProperty("Instance").GetValue(obj);

            EmpleadoDTO cls = (EmpleadoDTO)propertyInfo;
            idUsuarioSeleccionado = Convert.ToInt32(cls.ID_Login);
        }

        void BotonEnviar_Click(object sender, EventArgs e)
        {
            BotonEnviar.Enabled = false;
			int[] ID_UsuariosConsultar = { idUsuarioSeleccionado };

            if (!FindViewById<TextView>(Resource.Id.FechaInicial).Text.Equals("HOY"))
               fechaInicial = Convert.ToDateTime(FindViewById<TextView>(Resource.Id.FechaInicial).Text + " " + horaInicial + ":" + minutoInicial);
			else
 			   fechaInicial = DateTime.Now;
					
            if (!FindViewById<TextView>(Resource.Id.FechaFinal).Text.Equals("HOY"))
                fechaFinal = Convert.ToDateTime(FindViewById<TextView>(Resource.Id.FechaFinal).Text + " " + horaFinal + ":" + minutoFinal);
			else
				fechaFinal = DateTime.Now;

            progress = HelperMethods.setSpinnerDialog("Cargando Coordenadas...", this);

            Conexion_Web_Service._client.BajarCoordenadasEmpleadosAsync(HelperMethods.ConvertToUnixTimestamp(fechaInicial), HelperMethods.ConvertToUnixTimestamp(fechaFinal), ID_UsuariosConsultar);
            progress.Show();
        }
        #endregion

        #region Method Completed
        void _client_Consulta_BajarCoordenadasEmpleadosCompleted(object sender, BajarCoordenadasEmpleadosCompletedEventArgs CoordenadasBajadas)
        {
			Intent detailIntent = null;

            if (CoordenadasBajadas.Error != null)
            {
                alerta = HelperMethods.setAlert(HelperMethods.problemaConexion , this);
                                    
                RunOnUiThread(() =>
                {
                    progress.Hide();
                    alerta.Show();
                    BotonEnviar.Enabled = true;
                });
            }
            else
            {
                if (CoordenadasBajadas.Result != null)
                {
                    Perfil_Login.ListaCoordenadasEmpleado = CoordenadasBajadas.Result;

					switch (Intent.GetStringExtra(GetString(Resource.String.ConsultaIntentKey)))
				 	{
						 case "InformesActivity":
							 detailIntent = new Intent(Application.Context, typeof(InformesDataGridActivity));
							 detailIntent.PutExtra(Resources.GetString(Resource.String.InformesIntentKey), Intent.GetStringExtra(GetString(Resource.String.TipoInforme)));
							break;
						 default:
							 detailIntent = new Intent(Application.Context, typeof(AcquaintanceDetailActivity));
							 detailIntent.PutExtra(Resources.GetString(Resource.String.acquaintanceDetailIntentKey), idUsuarioSeleccionado);
							 detailIntent.PutExtra(Resources.GetString(Resource.String.ConsultaIntentKey), true);
							 AcquaintanceDetailActivity.getInstance().Finish();
							 break;
				 	}

					RunOnUiThread(() =>
					{
                    	StartActivity(detailIntent);						 
						HelperMethods.makeTransition(this);
                    	Finish();
					});
                }
                else
                {
                    alerta = HelperMethods.setAlert("No se Encontraron Registros", this);

                    RunOnUiThread(() =>
                    {
                        progress.Hide();
                        alerta.Show();
                        BotonEnviar.Enabled = true;
                    });
                }
            }
        }
        #endregion

        #region HelperMethods
        void UpdateDisplay(TextView timeDisplay, int cualTimeDisplay)
        {
            string time;
            if (cualTimeDisplay == TIME_DIALOG_ID)
            {
                time = string.Format("{0}:{1}", horaInicial, minutoInicial.ToString().PadLeft(2, '0'));
                timeDisplay.Text = time;
            }
            else
            {
                time = string.Format("{0}:{1}", horaFinal, minutoFinal.ToString().PadLeft(2, '0'));
                timeFinal_display.Text = time;
            }            
        }
        #endregion
    }
}