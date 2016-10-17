using System;
using System.Linq;
using Android.Support.V7.App;
using FFImageLoading.Views;
using Android.App;
using Android.Content;
using Android.OS;
using Android.Views;
using Android.Widget;
using Microsoft.AspNet.SignalR.Client;
using Android.Graphics;
using Toolbar = Android.Support.V7.Widget.Toolbar;

namespace Acquaint.Native.Droid
{
    [Activity(WindowSoftInputMode = SoftInput.StateHidden)]
    public class ChatActivity : AppCompatActivity, ViewTreeObserver.IOnGlobalLayoutListener
    {
        EmpleadoDTO empleado;
        View _ContentLayout;
		ScrollView sv;
        EditText editText;
        ScrollView _activityRootView;
		ImageViewAsync profilePhotoImageView;
		HistorialChat[] ListarMensajesChat;
        int BackgroundColor;
        string destinatario;
        string IdDestinatario;

        #region Lifecycle Implementation
        protected override void OnCreate(Bundle savedInstanceState)
        {
            base.OnCreate(savedInstanceState);
            
            View Chat = LayoutInflater.Inflate(Resource.Layout.Chat, null);
			IdDestinatario = Intent.GetStringExtra(GetString(Resource.String.idChat));
			destinatario = Intent.GetStringExtra(GetString(Resource.String.NombreDestinatarioChat));
			empleado = HelperMethods.getUserById(Convert.ToInt32(IdDestinatario));
          
            SetContentView(Chat);
			            
            Conexion_Web_Service._client.ListarMensajesAsync(Perfil_Login.miPerfil.ID_Login, Convert.ToInt32(IdDestinatario));
            Conexion_Web_Service._client.ListarMensajesCompleted += _client_ListarMensajesCompleted;

            SetSupportActionBar(FindViewById<Toolbar>(Resource.Id.toolbar));

            // ensure that the system bar color gets drawn
            Window.AddFlags(WindowManagerFlags.DrawsSystemBarBackgrounds);

            // enable the back button in the action bar
            SupportActionBar.SetDisplayHomeAsUpEnabled(true);
            SupportActionBar.SetHomeButtonEnabled(true);

            // set the activity title and action bar title
            Title = SupportActionBar.Title = destinatario;

            SetupViews(Chat, savedInstanceState);

			editText = FindViewById<EditText>(Resource.Id.forms_centralfragments_chat_chat_editText);
			sv = FindViewById<ScrollView>(Resource.Id.chatScroll);

			HelperMethods.SetupAnimations(this);

            GetInfo_OnGetInfoComplete();

            editText.Click += ((sender, e) =>
			{
				_activityRootView = FindViewById<ScrollView>(Resource.Id.chatScroll);
				_activityRootView.ViewTreeObserver.AddOnGlobalLayoutListener(this);
			});

			profilePhotoImageView.Click += ((sender, e) => {
				Intent detailIntent = new Intent(this , typeof(InformacionPersonal));
				detailIntent.PutExtra(Resources.GetString(Resource.String.InformacionPersonalIntentKey), int.Parse(IdDestinatario));
				HelperMethods.startIntent(detailIntent, this, Chat, profilePhotoImageView);
			});;
        }

        public void OnGlobalLayout()
        {
            var focusedControl = Window.CurrentFocus;
            _activityRootView.FullScroll(FocusSearchDirection.Down);
            if (focusedControl != null)
                focusedControl.RequestFocus();
            else if (Window.CurrentFocus != null)
                Window.CurrentFocus.ClearFocus();
        }

        protected override void OnDestroy()
        {
            Conexion_Web_Service._client.ListarMensajesCompleted -= _client_ListarMensajesCompleted;
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

		protected override void OnRestoreInstanceState(Bundle savedInstanceState)
		{
			base.OnRestoreInstanceState(savedInstanceState);
		}

        // this override is called when the back button is tapped
        public override bool OnOptionsItemSelected(IMenuItem item)
        {
            Finish();
			HelperMethods.makeTransition(this);
            return true;
        }

        #endregion

        #region Metodos
        void _client_ListarMensajesCompleted(object sender, ListarMensajesCompletedEventArgs e)
        {
            if (e.Result != null)
            {
                ListarMensajesChat = e.Result;
				RunOnUiThread(() =>
				{
                    for (int i = 0; i < ListarMensajesChat.Count(); i++)
                    {
                        string mensaje = ListarMensajesChat[i].Mensaje;
                        int emisor = ListarMensajesChat[i].Emisor;
                        int receptor = ListarMensajesChat[i].Receptor;
                        mostrarMensajes(emisor, receptor, mensaje);
                    }
                    scrollDownScrollView();
            	});
			}
        }
 
        async void GetInfo_OnGetInfoComplete()
        {
            BackgroundColor = Color.Black;
            var hubConnection = new HubConnection("http://folkend-001-site2.atempurl.com:80");
            var chatHubProxy = hubConnection.CreateHubProxy("ChatHub");
            
            chatHubProxy.On<string, int, string>("UpdateChatMessage", (message, color, user) =>
            {
                //UpdateChatMessage has been called from server
                RunOnUiThread(() =>
                {
                    mostrarMensajes(Convert.ToInt32(user), 0, message);
                    scrollDownScrollView();
                });
            });

            try { await hubConnection.Start(); } catch(Exception ex){ Console.WriteLine(ex.ToString()); }
            
            FindViewById<Button>(Resource.Id.forms_centralfragments_chat_chat_sendButton).Click += async (o, e2) =>
            {
                var editText = FindViewById<EditText>(Resource.Id.forms_centralfragments_chat_chat_editText);
                int usr_Id = Perfil_Login.miPerfil.ID_Login;
                var message = usr_Id.ToString() + "-" + IdDestinatario + ": " + editText.Text;
                int destino = Convert.ToInt32(IdDestinatario);
                string mensaje = editText.Text;
                DateTime fecha = DateTime.Now;
                Conexion_Web_Service._client.guardarMensajesAsync(usr_Id, destino, mensaje , fecha);
                editText.Text = "";
                await chatHubProxy.Invoke("SendMessage", new object[] { message, BackgroundColor, usr_Id });
            };
        }

        void mostrarMensajes(int emisor, int receptor, string mensaje)
        {
            TextView txt = new TextView(this);
            txt.Text = mensaje;
            txt.SetTextSize(Android.Util.ComplexUnitType.Sp, 20);
            txt.SetPadding(10, 5, 10, 10);
            txt.SetTextColor(Color.Black);

            if (emisor == Perfil_Login.miPerfil.ID_Login)
            {
                txt.Text = mensaje.Replace(Perfil_Login.miPerfil.ID_Login + "-" + IdDestinatario + ": ", "");
                txt.LayoutParameters = new LinearLayout.LayoutParams(ViewGroup.LayoutParams.WrapContent, ViewGroup.LayoutParams.WrapContent)
                { TopMargin = 10, BottomMargin = 10, LeftMargin = 10, RightMargin = 10, Gravity = GravityFlags.Right };
                txt.SetBackgroundResource(Resource.Drawable.BurbujaChat);
            }
            else if (mensaje.Contains(IdDestinatario + "-" + Perfil_Login.miPerfil.ID_Login + ": "))
            {
                txt.Text = mensaje.Replace(IdDestinatario + "-" + Perfil_Login.miPerfil.ID_Login + ": ", "");
                txt.LayoutParameters = new LinearLayout.LayoutParams(ViewGroup.LayoutParams.WrapContent, ViewGroup.LayoutParams.WrapContent)
                { TopMargin = 10, BottomMargin = 10, LeftMargin = 10, RightMargin = 10, Gravity = GravityFlags.Left };
                txt.SetBackgroundResource(Resource.Drawable.BurbujaChatBlanca);
            }
            else if (receptor != 0)
            {
                txt.LayoutParameters = new LinearLayout.LayoutParams(ViewGroup.LayoutParams.WrapContent, ViewGroup.LayoutParams.WrapContent)
                { TopMargin = 10, BottomMargin = 10, LeftMargin = 10, RightMargin = 10, Gravity = GravityFlags.Left };
                txt.SetBackgroundResource(Resource.Drawable.BurbujaChatBlanca);
            }
            
            FindViewById<LinearLayout>(Resource.Id.forms_centralfragments_chat_chat_listView).AddView(txt);
        }

        void SetupViews(View layout, Bundle savedInstanceState)
        {
            // inflate the content layout
            _ContentLayout = layout.FindViewById<LinearLayout>(Resource.Id.contentLayout);
			profilePhotoImageView = _ContentLayout.FindViewById<ImageViewAsync>(Resource.Id.profilePhotoImageView);
            
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
                profilePhotoImageView.SetImageBitmap(HelperMethods.redondearImagen(image, 200, 200));
				image.Dispose();
				image = null;
            }
        }

        void scrollDownScrollView()
        {
            sv = (ScrollView)FindViewById(Resource.Id.chatScroll);

            RunOnUiThread(() =>
            {
                sv.Post(new Java.Lang.Runnable(scrollDown));
            });
        }

        void scrollDown()
        {
            sv = (ScrollView)FindViewById(Resource.Id.chatScroll);
            sv.FullScroll(FocusSearchDirection.Down);
        }
        #endregion
    }
}