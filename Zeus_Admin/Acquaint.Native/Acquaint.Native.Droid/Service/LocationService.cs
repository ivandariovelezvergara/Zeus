using System;
using Android.App;
using Android.Util;
using Android.Content;
using Android.OS;
using Android.Locations;

namespace Acquaint.Native.Droid
{
	[Service]
	public class LocationService : Service, ILocationListener
	{
		public event EventHandler<LocationChangedEventArgs> LocationChanged = delegate { };
		public event EventHandler<ProviderDisabledEventArgs> ProviderDisabled = delegate { };
		public event EventHandler<ProviderEnabledEventArgs> ProviderEnabled = delegate { };
		public event EventHandler<StatusChangedEventArgs> StatusChanged = delegate { };

		public LocationService() { }
		// Set our location manager as the system location service
		protected LocationManager LocMgr = Android.App.Application.Context.GetSystemService ("location") as LocationManager;

		readonly string logTag = "LocationService";
		IBinder binder;

		public override void OnCreate ()
		{
			base.OnCreate ();
			Log.Debug (logTag, "OnCreate called in the Location Service");
		}

        // This gets called when StartService is called in our App class
        [Obsolete("deprecated in base class")]
        public override StartCommandResult OnStartCommand (Intent intent, StartCommandFlags flags, int startId)
		{
			Log.Debug (logTag, "LocationService started");

			return StartCommandResult.Sticky;
		}

		// This gets called once, the first time any client bind to the Service
		// and returns an instance of the LocationServiceBinder. All future clients will
		// reuse the same instance of the binder
		public override IBinder OnBind (Intent intent)
		{
			Log.Debug (logTag, "Client now bound to service");

			binder = new LocationServiceBinder (this);
			return binder;
		}

		// Handle location updates from the location manager
		public void StartLocationUpdates () 
		{
            //we can set different location criteria based on requirements for our app -
            //for example, we might want to preserve power, or get extreme accuracy
            var locationCriteria = new Criteria();

            locationCriteria.PowerRequirement = Power.High;
            locationCriteria.Accuracy = Accuracy.Fine;
            locationCriteria.HorizontalAccuracy = Accuracy.High;
			
            locationCriteria.AltitudeRequired = false;

			// get provider: GPS, Network, etc.
			var locationProvider = LocMgr.GetBestProvider(locationCriteria, true);
			Log.Debug (logTag, string.Format ("You are about to get location updates via {0}", locationProvider));

			// Get an initial fix on location
			LocMgr.RequestLocationUpdates(locationProvider, 5000, 10, this);

            Log.Debug (logTag, "Now sending location updates");
		}

		public override void OnDestroy ()
		{
			base.OnDestroy ();
			Log.Debug (logTag, "Service has been terminated");
		}

        #region ILocationListener implementation
        // ILocationListener is a way for the Service to subscribe for updates
        // from the System location Service

        public void OnLocationChanged(Location location)
        {
			try
			{
				if (location == null)
				{
					return;
				}

	            UbicacionDTO coordenadasSubir = new UbicacionDTO();

	            coordenadasSubir.ID_Usuario_Ubicacion = Perfil_Login.miPerfil.ID_Login;
	            coordenadasSubir.Latitud = (decimal)location.Latitude;
	            coordenadasSubir.Longitud = (decimal)location.Longitude;
	            coordenadasSubir.Velocidad = (decimal?)location.Speed;
	            coordenadasSubir.Precision = (decimal)location.Accuracy;
	            coordenadasSubir.Bearing = (decimal)location.Bearing;
				try
				{
					coordenadasSubir.Tiempo = HelperMethods.ConvertFromUnixTimestamp((location.Time / 1000) - 18000, true);
				}
				catch (Exception)
				{
					coordenadasSubir.Tiempo = " ";
				}

	            Conexion_Web_Service._client.SubirCoordenadasEmpleadosAsync(coordenadasSubir.ID_Usuario_Ubicacion, coordenadasSubir.Latitud, coordenadasSubir.Longitud, coordenadasSubir.Velocidad, coordenadasSubir.Precision, coordenadasSubir.Bearing, coordenadasSubir.Tiempo);
	            Conexion_Web_Service._client.SubirCoordenadasEmpleadosCompleted += _client_SubirCoordenadasEmpleadosCompleted;
			}
			catch (Exception)
			{
				return;
			}
		}

        void _client_SubirCoordenadasEmpleadosCompleted(object sender, System.ComponentModel.AsyncCompletedEventArgs e)
        {
            if (e.Error == null)
            {
                Log.Debug(logTag, "Coordenada Subida");
            }                
        }

        public void OnProviderDisabled (string provider)
		{
			this.ProviderDisabled (this, new ProviderDisabledEventArgs (provider));
		}

		public void OnProviderEnabled (string provider)
		{
			this.ProviderEnabled (this, new ProviderEnabledEventArgs (provider));
		}

		public void OnStatusChanged (string provider, Availability status, Bundle extras)
		{
			this.StatusChanged (this, new StatusChangedEventArgs (provider, status, extras));
		} 
		#endregion
	}
}

