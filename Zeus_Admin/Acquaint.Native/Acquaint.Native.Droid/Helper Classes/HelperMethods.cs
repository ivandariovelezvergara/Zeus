using System;
using System.Linq;
using Android.App;
using Android.Content;
using Android.Graphics;
using PubNubMessaging.Core;
using System.Collections.Generic;
using Android.OS;
using Android.Views;
using Android.Transitions;
using Android.Locations;
using Android.Gms.Maps.Model;

namespace Acquaint.Native.Droid
{
    public static class HelperMethods
    {
        public static readonly string problemaConexion = "Problemas de Conexion, revisa si tienes conexion";
        public static readonly string canceledRequest = "Request was cancelled.";
        public static readonly string base64DefaultImage = @"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";
		public static Pubnub pubnub = new Pubnub("pub-c-873c406e-047c-4a4a-a0d9-6d8176a935e8", "sub-c-f076a8c8-2b78-11e6-b700-0619f8945a4f");
		static readonly string empleadoNulo = "Empleado no esta asignado es nulo";

        public static long ConvertToUnixTimestamp(DateTime date)
        {
            DateTime origin = new DateTime(1970, 1, 1, 0, 0, 0, 0, DateTimeKind.Utc);
            try
            {
                TimeSpan diff = date - origin;
                return (long)Math.Floor(diff.TotalSeconds);
            }
            catch (Exception)
            {
                return 0;
            }
        }

        public static string ConvertFromUnixTimestamp(long timestamp, bool horas)
        {
            try
            {
                DateTime origin = new DateTime(1970, 1, 1, 0, 0, 0, 0, DateTimeKind.Utc);
                var timeSpan = TimeSpan.FromSeconds(timestamp);
                var localDateTime = origin.Add(timeSpan);

                if (horas)
                {
					return string.Format("{0:yyyy/MM/dd HH:mm}", localDateTime);
                }
                else
                {
					return string.Format("{0:yyyy/MM/dd}", localDateTime);
                }
            }
            catch (Exception)
            {
                return " ";
            }
        }

        public static Bitmap redondearImagen(Bitmap scaleBitmapImage, int ancho, int largo)
        {
            try
            {
                int targetWidth = ancho;
                int targetHeight = largo;
                Bitmap targetBitmap = Bitmap.CreateBitmap(targetWidth, targetHeight, Bitmap.Config.Argb8888);
                Canvas canvas = new Canvas(targetBitmap);
                Path path = new Path();
                path.AddCircle(((float)targetWidth - 1) / 2, ((float)targetHeight - 1) / 2, (Math.Min((targetWidth), (targetHeight)) / 2), Path.Direction.Ccw);
                canvas.ClipPath(path);
                canvas.DrawBitmap(scaleBitmapImage, new Rect(0, 0, scaleBitmapImage.Width, scaleBitmapImage.Height), new Rect(0, 0, targetWidth, targetHeight), null);
				scaleBitmapImage.Dispose();
                return targetBitmap;
            }
            catch (Exception)
            {
                return null;
            }
           
        }

        public static EmpleadoDTO getUserById(int id)
        {
            try
            {
                EmpleadoDTO user = (from Persona in Perfil_Login.ListaEmpleadosAsignados where Persona.ID_Login == id select Persona).First();
                return user;
            }
            catch (Exception)
            {
                throw new Exception(empleadoNulo);
            }
            
        }

        public static string DisplayName(EmpleadoDTO empleado)
        {
            if (empleado != null)
                return empleado.usr_nombres + " " + empleado.usr_apellidos;
            else
                throw new Exception(empleadoNulo);
        }

        public static Android.App.AlertDialog.Builder setAlert(string mensaje, Context contexto)
        {
            Android.App.AlertDialog.Builder alerta = new Android.App.AlertDialog.Builder(contexto);
            alerta.SetTitle("Notificacion");
            alerta.SetMessage(mensaje);
			alerta.SetPositiveButton("OK", (enviador, evento) => { alerta.Dispose();});

            return alerta;
        }

        public static ProgressDialog setSpinnerDialog(string mensaje, Context contexto)
        {
            ProgressDialog progress = new ProgressDialog(contexto);
            progress.Indeterminate = true;
            progress.SetProgressStyle(ProgressDialogStyle.Spinner);
            progress.SetMessage(mensaje);
            progress.SetCancelable(false);

            return progress;
        }

		public static void makeTransition(Activity activityToTransition)
		{
			activityToTransition.OverridePendingTransition(Android.Resource.Animation.SlideInLeft, Android.Resource.Animation.SlideOutRight);
		}

		public static void startIntent(Intent detailIntent, Activity currentActivity, View vista, View profileImageView)
		{
			// shared element transitions are only supported on Android 5.0+
			if (Build.VERSION.SdkInt >= BuildVersionCodes.Lollipop)
			{
				// define transitions 
				var transitions = new List<Android.Util.Pair>() {
								Android.Util.Pair.Create(profileImageView, currentActivity.Resources.GetString(Resource.String.profilePhotoTransition)),
						};

				// create an activity options instance and bind the above-defined transitions to the current activity
				var transistionOptions = ActivityOptions.MakeSceneTransitionAnimation(currentActivity, transitions.ToArray());

				// start (navigate to) the detail activity, passing in the activity transition options we just created
				vista.Enabled = true;
				currentActivity.StartActivity(detailIntent, transistionOptions.ToBundle());
			}
			else
			{
				// if not support transitions start activy as always
				vista.Enabled = true;
				currentActivity.StartActivity(detailIntent);
				makeTransition(currentActivity);
			}
		}

		public static void SetupAnimations(Activity currentActivity)
		{
			if (Build.VERSION.SdkInt >= BuildVersionCodes.Lollipop)
			{
				var enterTransition = TransitionInflater.From(currentActivity).InflateTransition(Resource.Transition.acquaintanceDetailActivityEnter);

				currentActivity.Window.SharedElementEnterTransition = enterTransition;
			}
		}
    }

	public class LastLocation : Location
	{
		public LastLocation(Location location) : base(location){ }

		public LastLocation(string provider, LatLng ubicacion) : base(provider) 
		{
			Longitude = ubicacion.Longitude;
			Latitude = ubicacion.Latitude;	
		}
	}
}