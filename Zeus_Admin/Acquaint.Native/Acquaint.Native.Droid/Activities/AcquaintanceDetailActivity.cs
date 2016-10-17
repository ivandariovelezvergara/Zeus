using System;
using System.Linq;
using System.Threading.Tasks;
using Acquaint.Util;
using Android.App;
using Android.Gms.Maps;
using Android.Gms.Maps.Model;
using Android.OS;
using Android.Support.V7.App;
using Android.Util;
using Android.Views;
using Android.Widget;
using FFImageLoading.Views;
using Plugin.Messaging;
using Toolbar = Android.Support.V7.Widget.Toolbar;
using Android.Graphics;
using Android.Content;
using Android.Text;
using Android.Text.Style;
using System.Collections.Generic;
using Newtonsoft.Json;
using Android.Content.Res;

namespace Acquaint.Native.Droid
{
	/// <summary>
	/// Acquaintance detail activity.
	/// </summary>
	[Activity]			
	public class AcquaintanceDetailActivity : AppCompatActivity, IOnMapReadyCallback
	{
		Marker lastMarkerPubNub;
		Marker lastMarker;
		PolylineOptions mPolylineOptions;
        EmpleadoDTO empleado;
		MapView mapview;
		GoogleMap googleMap;
		Toolbar toolbar;
		LastLocation lastPointMarker1KM;
        static AcquaintanceDetailActivity Instance;
		bool shouldExecuteOnResume;
		string nombreCompletoEmpleado;
        int IdEmpleado;
		bool vengoConsulta;

        #region Lifecycle Implementation
        protected override void OnCreate(Bundle savedInstanceState)
        {
            shouldExecuteOnResume = false;

            base.OnCreate(savedInstanceState);

            View acquaintanceDetailLayout = LayoutInflater.Inflate(Resource.Layout.AcquaintanceDetail, null);

            SetContentView(acquaintanceDetailLayout);
			toolbar = FindViewById<Toolbar>(Resource.Id.toolbar);
            SetSupportActionBar(toolbar);

            // ensure that the system bar color gets drawn
            Window.AddFlags(WindowManagerFlags.DrawsSystemBarBackgrounds);

            // enable the back button in the action bar
            SupportActionBar.SetDisplayHomeAsUpEnabled(true);
            SupportActionBar.SetHomeButtonEnabled(true);

            // extract the acquaintance id fomr the intent
            IdEmpleado = Intent.GetIntExtra(GetString(Resource.String.acquaintanceDetailIntentKey), 0);
			vengoConsulta = Intent.GetBooleanExtra(GetString(Resource.String.ConsultaIntentKey), false);

            empleado = HelperMethods.getUserById(IdEmpleado);
            nombreCompletoEmpleado = HelperMethods.DisplayName(empleado);

            // set the activity title and action bar title
            Title = SupportActionBar.Title = nombreCompletoEmpleado;

            SetupViews(acquaintanceDetailLayout, savedInstanceState);

            HelperMethods.SetupAnimations(this);

			mPolylineOptions = new PolylineOptions();
			mPolylineOptions.InvokeColor(Color.Blue).InvokeWidth(10);

            //Should call this to let the map showing 
            shouldExecuteOnResume = true;
            Instance = this;
            OnResume();
		}

        protected override void OnResume()
        {
            // Must prevent OnResume Interrupt OnCreate or Map gonna explode
            if (shouldExecuteOnResume)
            {
                mapview.OnResume();
            }
            else
            {
                shouldExecuteOnResume = true;
            }
            base.OnResume();
        }

        protected override void OnPause()
        {
            mapview.OnPause();
            base.OnPause();
        }

        protected override void OnDestroy()
        {
			if (vengoConsulta != true)
			{
				HelperMethods.pubnub.Unsubscribe<string>(
					IdEmpleado.ToString(),
					delegate { },
					delegate { },
					delegate { },
					delegate { }
				);
			}
            mapview.OnDestroy();
            base.OnDestroy();           
        }

        protected override void OnSaveInstanceState(Bundle outState)
        {
            mapview.OnSaveInstanceState(outState);
            base.OnSaveInstanceState(outState);
        }

        public override bool OnOptionsItemSelected(IMenuItem item)
        {
			LinearLayout contentLayout = FindViewById<LinearLayout>(Resource.Id.HidingToolbar);

			if (item.ItemId == Resource.Id.MenuInfoMap)
			{
				if (contentLayout.Visibility == ViewStates.Gone)
				{

					contentLayout.Visibility = ViewStates.Visible;
				}
				else
				{
					contentLayout.Visibility = ViewStates.Gone;
				}
			}
			else
			{
				Finish();
				HelperMethods.makeTransition(this);
			}
            return true;
        }

		public override bool OnCreateOptionsMenu(IMenu menu)
		{
			toolbar.InflateMenu(Resource.Menu.MenuMap);

			return base.OnCreateOptionsMenu(menu);
		}
		#endregion

		#region Implementations IOnMapReadyCallback
		public async void OnMapReady(GoogleMap googleMap)
		{
			this.googleMap = googleMap;
            googleMap.SetInfoWindowAdapter(new CustomInfoWindowAdapter(this));

			// enable the compass on the map
			googleMap.UiSettings.CompassEnabled = false;

			// enable the my location button
			googleMap.UiSettings.MyLocationButtonEnabled = true;

			// disable the map toolbar
			googleMap.UiSettings.MapToolbarEnabled = false;

            // enable Zoom Funcionality
            googleMap.UiSettings.ZoomGesturesEnabled = true;
            googleMap.UiSettings.ZoomControlsEnabled = true;
                      
            if (Perfil_Login.ListaCoordenadasEmpleado != null && Perfil_Login.ListaCoordenadasEmpleado.Count() > 0)
			{
				// display the map region that contains the point. (the zoom level has been defined on the map layout in AcquaintanceDetail.axml)
				googleMap.MoveCamera(CameraUpdateFactory.NewLatLng(new LatLng((double)Perfil_Login.ListaCoordenadasEmpleado.First().Latitud, (double)Perfil_Login.ListaCoordenadasEmpleado.First().Longitud)));

				await setCustomizeIcon(Perfil_Login.ListaCoordenadasEmpleado.Reverse().ToArray(), false);

				// 			WAY TO ZOOM DINAMICALLY TO VIEW ALL ICONS YOU DEFINE IN A RANGE (MUST CREATE ICONS BEFORE OR WILL CRASH)
				//LatLng lastPoint = new LatLng((double)Perfil_Login.ListaCoordenadasEmpleado.First().Latitud, (double)Perfil_Login.ListaCoordenadasEmpleado.First().Longitud);
				//LatLng firtPoint = new LatLng((double)Perfil_Login.ListaCoordenadasEmpleado.Last().Latitud, (double)Perfil_Login.ListaCoordenadasEmpleado.Last().Longitud);
				//LatLngBounds centerCamera = new LatLngBounds(firtPoint, lastPoint);
				//googleMap.AnimateCamera(CameraUpdateFactory.NewLatLngBounds(centerCamera, 0));
            }
            else
            {
                Android.App.AlertDialog.Builder alerta = HelperMethods.setAlert("No se encontraron registros", this);
                alerta.Show();
				googleMap.MoveCamera(CameraUpdateFactory.NewLatLngZoom(new LatLng(3.863315, -73.433309),6));
            }

			if (vengoConsulta != true)
			{
				HelperMethods.pubnub.Subscribe<string>(
					IdEmpleado.ToString(),
					DisplaySubscribeReturnMessage,
					delegate { },
					delegate { }
				);
			}
        }
        #endregion

        #region Custom Info Window Class
        /** Demonstrates customizing the info window and/or its contents. */
        class CustomInfoWindowAdapter : Java.Lang.Object, GoogleMap.IInfoWindowAdapter
        {
            AcquaintanceDetailActivity parent;

            // These a both viewgroups containing an ImageView with id "badge" and two TextViews with id
            // "title" and "snippet".
            readonly View mWindow;

            internal CustomInfoWindowAdapter(AcquaintanceDetailActivity parent)
            {
                this.parent = parent;
                mWindow = parent.LayoutInflater.Inflate(Resource.Layout.custom_info_window, null);
            }

            public View GetInfoWindow(Marker marker)
            {
                Render(marker, mWindow);
                return mWindow;
            }

            public View GetInfoContents(Marker marker) => null;

            void Render(Marker marker, View view)
            {
                TextView titleUi = view.FindViewById<TextView>(Resource.Id.title);
				TextView latitudText = view.FindViewById<TextView>(Resource.Id.LatitudMarker);
				TextView longitudText = view.FindViewById<TextView>(Resource.Id.LongitudMarker);
                TextView velocidadText = view.FindViewById<TextView>(Resource.Id.velocidadMarker);
                TextView tiempoText = view.FindViewById<TextView>(Resource.Id.tiempoMarker);
                TextView direccionText = view.FindViewById<TextView>(Resource.Id.direccionMarker);
                string title = marker.Title;

                if (title != null)
                {
                    // Spannable string allows us to edit the formatting of the text.
                    SpannableString titleText = new SpannableString(title);
                    SpanTypes st = (SpanTypes)0;
                    titleText.SetSpan(new ForegroundColorSpan(Color.Red), 0, titleText.Length(), st);
                    titleUi.TextFormatted = (titleText);
                }
                else
                {
                    titleUi.Text = ("");
                }

                string snippet = marker.Snippet;
                string[] texto = snippet.Split('*');

				tiempoText.Text = texto[0];
				latitudText.Text = texto[1];
				longitudText.Text = texto[2];
                velocidadText.Text = texto[3];
                direccionText.Text = texto[4];
            }
        }
        #endregion

        #region Helper Methods
        void SetupViews(View layout, Bundle savedInstanceState)
        {
            // inflate the map view
            mapview = FindViewById<MapView>(Resource.Id.map);

            // create the map view with the context
            mapview.OnCreate(savedInstanceState);

            // get the map, which calls the OnMapReady() method below (by virtue of the IOnMapReadyCallback interface that this class implements)
            mapview.GetMapAsync(this);

            Android.App.AlertDialog.Builder alerta;

            // inflate the content layout
            View _ContentLayout = layout.FindViewById<LinearLayout>(Resource.Id.contentLayoutMap);

            // inflate and set the profile image view
            var profilePhotoImageView = _ContentLayout.FindViewById<ImageViewAsync>(Resource.Id.profilePhotoImageView);

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

            // infliate and set the name text view
            _ContentLayout.InflateAndBindTextView(Resource.Id.nameTextView, nombreCompletoEmpleado);

            // inflate and set the company name text view
            _ContentLayout.InflateAndBindTextView(Resource.Id.companyTextView, empleado.usr_identificacion);

            // inflate and set the job title text view
            _ContentLayout.InflateAndBindTextView(Resource.Id.jobTitleTextView, empleado.grp_nombre_cargo);

            _ContentLayout.InflateAndBindTextView(Resource.Id.streetAddressTextView, empleado.usr_direccion);

            _ContentLayout.InflateAndBindTextView(Resource.Id.phoneTextView, empleado.usr_telefonoMovil);

            _ContentLayout.InflateAndBindTextView(Resource.Id.emailTextView, empleado.usr_email);

            var consultaActionImageView = _ContentLayout.InflateAndBindLocalImageViewByResource(Resource.Id.consultaActionImageView, Resource.Drawable.consultar);
            consultaActionImageView.Click += (sender, e) =>
            {
                // Start Query Activity
                Intent consultaIntent = new Intent(Application.Context, typeof(ConsultaActivity));
                consultaIntent.PutExtra(Resources.GetString(Resource.String.ConsultaIntentKey), IdEmpleado);

                StartActivity(consultaIntent);
				HelperMethods.makeTransition(this);
            };

            var messageActionImageView = _ContentLayout.InflateAndBindLocalImageViewByResource(Resource.Id.messageActionImageView, Resource.Mipmap.message);
            messageActionImageView.Click += (sender, e) =>
            {
                // we're using the Messaging plugin from Carel Lotz here (included as a NuGet)
                var smsTask = MessagingPlugin.SmsMessenger;
                if (smsTask.CanSendSms)
                {
                    if (empleado.usr_telefonoMovil != null && empleado.usr_telefonoMovil != "")
                    {
                        smsTask.SendSms(empleado.usr_telefonoMovil.SanitizePhoneNumber(), "");
                    }
                    else
                    {
                        alerta = HelperMethods.setAlert("No hay telefono registrado", this);
                        alerta.Show();
                    }
                }
                else
                {
                    alerta = HelperMethods.setAlert("Imposible mandar SMS por problemas del celular", this);
                    alerta.Show();
                }
            };

            var phoneActionImageView = _ContentLayout.InflateAndBindLocalImageViewByResource(Resource.Id.phoneActionImageView, Resource.Mipmap.phone);
            phoneActionImageView.Click += (sender, e) =>
            {
                // we're using the Messaging plugin from Carel Lotz here (included as a NuGet)
                var phoneCallTask = MessagingPlugin.PhoneDialer;
                if (phoneCallTask.CanMakePhoneCall)
                {
                    if (empleado.usr_telefonoMovil != null && empleado.usr_telefonoMovil != "")
                    {
                        phoneCallTask.MakePhoneCall(empleado.usr_telefonoMovil.SanitizePhoneNumber());
                    }
                    else
                    {
                        alerta = HelperMethods.setAlert("No hay telefono registrado", this);
                        alerta.Show();
                    }
                }
                else
                {
                    alerta = HelperMethods.setAlert("Imposible llamar por problemas del celular", this);
                    alerta.Show();
                }
            };

            var emailActionImageView = _ContentLayout.InflateAndBindLocalImageViewByResource(Resource.Id.emailActionImageView, Resource.Mipmap.email);
            emailActionImageView.Click += (sender, e) =>
            {
                // we're using the Messaging plugin from Carel Lotz here (included as a NuGet)
                var emailTask = MessagingPlugin.EmailMessenger;
                if (emailTask.CanSendEmail)
                {
                    if (empleado.usr_email != null && empleado.usr_email != "")
                    {
                        emailTask.SendEmail(empleado.usr_email, "");
                    }
                    else
                    {
                        alerta = HelperMethods.setAlert("No hay email registrado", this);
                        alerta.Show();
                    }
                }
                else
                {
                    alerta = HelperMethods.setAlert("Imposible mandar EMAIL por problemas del celular", this);
                    alerta.Show();
                }
            };
        }
               
        public static AcquaintanceDetailActivity getInstance()
        {
            return Instance;
        }

		async void DisplaySubscribeReturnMessage(string result)
		{
			if (!string.IsNullOrEmpty(result) && !string.IsNullOrEmpty(result.Trim()))
			{
				List<object> deserializedMessage = HelperMethods.pubnub.JsonPluggableLibrary.DeserializeToListOfObject(result);
				if (deserializedMessage != null && deserializedMessage.Count > 0)
				{
					object subscribedObject = deserializedMessage[0];
					if (subscribedObject != null)
					{
						string resultActualMessage = HelperMethods.pubnub.JsonPluggableLibrary.SerializeToJsonString(subscribedObject);
						UbicacionDTO[] ubicacionPubNub = { JsonConvert.DeserializeObject<UbicacionDTO>(resultActualMessage)};
						try
						{
							await setCustomizeIcon(ubicacionPubNub, true);
						}
						catch (Exception)
						{
							return;
						}
					}
				}
			}
		}

		async Task setCustomizeIcon(UbicacionDTO[] coordenadasArray, bool pubnubResponse)
		{
			await Task.Run(() => {
			int contador = 1;
			foreach (var coordenadas in coordenadasArray)
			{
				LatLng ubicacion = new LatLng((double)coordenadas.Latitud, (double)coordenadas.Longitud);
				LastLocation newPoint = new LastLocation("", ubicacion);
				bool mustLeaveIcon1KM = (lastMarkerPubNub != null && lastPointMarker1KM.DistanceTo(newPoint) > 500); 
				int ResourceIDFlechas;
				int ResourceIDCarro;
				var marker = new MarkerOptions();

				if (coordenadas.Velocidad > 90)
				{
					ResourceIDFlechas = Resource.Drawable.Flecha_Marron;
					ResourceIDCarro = Resource.Drawable.icono_rojo;
				}
				else if (coordenadas.Velocidad <= 90 && coordenadas.Velocidad > 70)
				{
					ResourceIDFlechas = Resource.Drawable.Flecha_Rosada;
					ResourceIDCarro = Resource.Drawable.icono_rosado;
				}
				else if (coordenadas.Velocidad <= 70 && coordenadas.Velocidad > 40)
				{
					ResourceIDFlechas = Resource.Drawable.Flecha_Verde;
					ResourceIDCarro = Resource.Drawable.icono_verde;
				}
				else if (coordenadas.Velocidad <= 40 && coordenadas.Velocidad > 10)
				{
					ResourceIDFlechas = Resource.Drawable.Flecha_Aqua;
					ResourceIDCarro = Resource.Drawable.icono_azul_claro;
				}
				else if (coordenadas.Velocidad <= 10 && coordenadas.Velocidad > 1)
				{
					ResourceIDFlechas = Resource.Drawable.Flecha_Azul;
					ResourceIDCarro = Resource.Drawable.icono_azul_oscuro;
				}
				else
				{
					ResourceIDFlechas = Resource.Drawable.Flecha_Morada;
					ResourceIDCarro = Resource.Drawable.icono_morado;
				}

				marker.SetPosition(ubicacion);
				marker.SetRotation((float)coordenadas.Bearing);
				marker.Anchor(0.5f, 0.5f);
				marker.SetTitle(coordenadas.Nombre_Usuario);
				marker.SetSnippet("Tiempo: " + coordenadas.Tiempo + "*Latitud: " + coordenadas.Latitud + "*Longitud: " + coordenadas.Longitud + "*Velocidad: " + string.Format("{0:0.##}", coordenadas.Velocidad) + "*Direccion: " + coordenadas.Direccion);

				if (pubnubResponse == false)
				{
					using (Bitmap icon = BitmapFactory.DecodeResource(Resources, ResourceIDFlechas))
					{
						using (Bitmap bhalfsize = Bitmap.CreateScaledBitmap(icon, (int)convertDpToPixel(23, this), (int)convertDpToPixel(33, this), false))
						{
							marker.SetIcon(BitmapDescriptorFactory.FromBitmap(bhalfsize));
						}
					}
				}

				if (coordenadasArray.Count() == contador || pubnubResponse == true)
				{
					using (Bitmap icon = BitmapFactory.DecodeResource(Resources, ResourceIDCarro))
					{
						using (Bitmap bhalfsize = Bitmap.CreateScaledBitmap(icon, (int)convertDpToPixel(27, this), (int)convertDpToPixel(37, this), false))
						{
							marker.SetIcon(BitmapDescriptorFactory.FromBitmap(bhalfsize));
						}
					}
				}

				if (pubnubResponse)
				{
					RunOnUiThread(() =>
					{
						googleMap.AddPolyline(mPolylineOptions.Add(ubicacion));

						if (mustLeaveIcon1KM)
						{
							using (Bitmap icon = BitmapFactory.DecodeResource(Resources, ResourceIDFlechas))
							{
								using (Bitmap bhalfsize = Bitmap.CreateScaledBitmap(icon, (int)convertDpToPixel(23, this), (int)convertDpToPixel(33, this), false))
								{
									lastMarkerPubNub.SetIcon(BitmapDescriptorFactory.FromBitmap(bhalfsize));
									lastPointMarker1KM = newPoint;
								}
							}

						}
						else if (lastMarkerPubNub != null)
						{
							lastMarkerPubNub.Remove();
						}
						else
						{
							lastPointMarker1KM = new LastLocation("", ubicacion);
							using (Bitmap icon = BitmapFactory.DecodeResource(Resources, ResourceIDFlechas))
							{
								using (Bitmap bhalfsize = Bitmap.CreateScaledBitmap(icon, (int)convertDpToPixel(23, this), (int)convertDpToPixel(33, this), false))
								{
									lastMarker.SetIcon(BitmapDescriptorFactory.FromBitmap(bhalfsize));									
								}
							}
						}
						googleMap.AnimateCamera(CameraUpdateFactory.NewLatLng(ubicacion));
						lastMarkerPubNub = googleMap.AddMarker(marker);
					});
				}
				else
				{
					RunOnUiThread(() =>
					{
						lastMarker = googleMap.AddMarker(marker);
					});
				}
				contador += 1;
			}
			});
		}

		public float convertDpToPixel(float dp, Activity context)
		{
			Resources resources = context.Resources;
			DisplayMetrics metrics = resources.DisplayMetrics;
			float px = dp * ((int)metrics.DensityDpi / 160f);
			return px;
		}
        #endregion
    }
}