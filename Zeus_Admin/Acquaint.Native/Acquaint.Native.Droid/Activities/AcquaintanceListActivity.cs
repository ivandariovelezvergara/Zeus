using System.Collections.Generic;
using System.Linq;
using Android.App;
using Android.Content;
using Android.OS;
using Android.Support.V7.App;
using Android.Support.V7.Widget;
using Android.Views;
using Android.Widget;
using FFImageLoading.Views;
using Toolbar = Android.Support.V7.Widget.Toolbar;
using SearchView = Android.Support.V7.Widget.SearchView;
using Android.Support.V4.View;
using System;
using Android.Graphics;
using Android.Content.PM;

namespace Acquaint.Native.Droid
{
	/// <summary>
	/// Acquaintance list activity.
	/// </summary>
	[Activity(ConfigurationChanges = ConfigChanges.Orientation | ConfigChanges.ScreenSize)]
	public class AcquaintanceListActivity : AppCompatActivity , SearchView.IOnQueryTextListener
	{
		Toolbar toolbar;
		AcquaintanceCollectionAdapter acquaintanceCollectionAdapter;
		RecyclerView recyclerView;

        #region Lifecycle Implementation
        // This override is called only once during the activity's lifecycle, when it is created.
        protected override void OnCreate(Bundle savedInstanceState)
		{
			base.OnCreate(savedInstanceState);

			// instantiate adapter
			acquaintanceCollectionAdapter = new AcquaintanceCollectionAdapter(this);

			// instantiate the layout manager
			LinearLayoutManager layoutManager = new LinearLayoutManager(this);

			// set the content view
			SetContentView(Resource.Layout.Main);

			toolbar = FindViewById<Toolbar>(Resource.Id.toolbar);

			// setup the action bar
			SetSupportActionBar(toolbar);

			// ensure that the system bar color gets drawn
			Window.AddFlags(WindowManagerFlags.DrawsSystemBarBackgrounds);

			// set the title of both the activity and the action bar
			Title = SupportActionBar.Title = "Lista de Contactos";

            SupportActionBar.SetDisplayHomeAsUpEnabled(true);
            SupportActionBar.SetHomeButtonEnabled(true);

			HelperMethods.SetupAnimations(this);

            // instantiate/inflate the RecyclerView
            recyclerView = FindViewById<RecyclerView>(Resource.Id.acquaintanceRecyclerView);

			// set RecyclerView's layout manager 
			recyclerView.SetLayoutManager(layoutManager);

			// set RecyclerView's adapter
			recyclerView.SetAdapter(acquaintanceCollectionAdapter);
		}

		public override bool OnCreateOptionsMenu(IMenu menu)
		{
			toolbar.InflateMenu(Resource.Menu.MenuSearchView);
			IMenuItem item = toolbar.Menu.FindItem(Resource.Id.action_search);

			SearchView searchView = (SearchView)MenuItemCompat.GetActionView(item);
			searchView.SetOnQueryTextListener(this);

			return base.OnCreateOptionsMenu(menu);
		} 

		public bool OnQueryTextChange(string query)
		{
			var newModel = (from newModelQuery in Perfil_Login.ListaEmpleadosAsignados where newModelQuery.ToString().ToLower().Contains(query.ToLower()) select newModelQuery).ToList();
			acquaintanceCollectionAdapter.animateTo(newModel);
			recyclerView.ScrollToPosition(0);
			return false;
		}

		public bool OnQueryTextSubmit(string query)
		{
			return false;
		}

        protected override void OnResume()
        {
            base.OnResume();
        }

        protected override void OnDestroy()
        {
			Conexion_Web_Service._client.BajarCoordenadasEmpleadosCompleted -= acquaintanceCollectionAdapter._client_Lista_BajarCoordenadasEmpleadosCompleted;
            base.OnDestroy();
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

        // this override is called when the back button is tapped
        public override bool OnOptionsItemSelected(IMenuItem item)
        {
            // execute a back navigation and destroy activitylist        
            Finish();
            return true;
        }
    }
    #endregion

    #region AcquaintanceViewHolder
    /// <summary>
    /// Acquaintance view holder. Used in conjunction with RecyclerView's view holder methods to improve performance by not re-inflating views each time they're needed.
    /// </summary>
    internal class AcquaintanceViewHolder : RecyclerView.ViewHolder
	{
		public View AcquaintanceRow { get; }

		public TextView NameTextView { get; }

		public TextView PhoneTextView { get; }

		public TextView JobTitleTextView { get; }

		public ImageViewAsync ProfilePhotoImageView { get; }

		public AcquaintanceViewHolder(View itemView) : base(itemView)
		{
			AcquaintanceRow = itemView;

			NameTextView = AcquaintanceRow.FindViewById<TextView>(Resource.Id.nameTextView);
			PhoneTextView = AcquaintanceRow.FindViewById<TextView>(Resource.Id.companyTextView);
			JobTitleTextView = AcquaintanceRow.FindViewById<TextView>(Resource.Id.jobTitleTextView);
            ProfilePhotoImageView = AcquaintanceRow.FindViewById<ImageViewAsync>(Resource.Id.profilePhotoImageView);
        }
	}
    #endregion

    #region AcquaintanceCollectionAdapter
    /// <summary>
    /// Acquaintance collection adapter. Coordinates data the child views of RecyclerView.
    /// </summary>
    class AcquaintanceCollectionAdapter : RecyclerView.Adapter, View.IOnClickListener
	{
        Activity currentActivity;
		View vista;
		EmpleadoDTO empleado;
        ProgressDialog progress;
		List<EmpleadoDTO> empleadoModel;
		View profileImageView;

        public AcquaintanceCollectionAdapter(Activity current)
		{
            currentActivity = current;
			empleadoModel = Perfil_Login.ListaEmpleadosAsignados.ToList();
			Conexion_Web_Service._client.BajarCoordenadasEmpleadosCompleted += _client_Lista_BajarCoordenadasEmpleadosCompleted;
        }

		// when a RecyclerView itemView is requested, the OnCreateViewHolder() is called
		public override RecyclerView.ViewHolder OnCreateViewHolder(ViewGroup parent, int viewType)
		{
			// instantiate/inflate a view
			var itemView = LayoutInflater.From(parent.Context).Inflate(Resource.Layout.AcquaintanceRow, parent, false);

			// Create a ViewHolder to find and hold these view references, and 
			// register OnClick with the view holder:
			var viewHolder = new AcquaintanceViewHolder(itemView);

			return viewHolder;
		}

		// populates the properties of the child views of the itemView
		public override void OnBindViewHolder(RecyclerView.ViewHolder holder, int position)
		{
            Bitmap image = null;
            byte[] imagenProvisional = null;
			// instantiate a new view holder
			var viewHolder = holder as AcquaintanceViewHolder;

			// get an item by position (index)
			empleado = empleadoModel[position];

			// assign values to the views' text properties
		    if (viewHolder == null) return;

		    viewHolder.NameTextView.Text = HelperMethods.DisplayName(empleado);
		    viewHolder.PhoneTextView.Text = empleado.usr_telefonoMovil;
		    viewHolder.JobTitleTextView.Text = empleado.grp_nombre_cargo;

            if (empleado.usr_fotografia != null)
                image = BitmapFactory.DecodeByteArray(empleado.usr_fotografia, 0, empleado.usr_fotografia.Length);
            else
            {
                imagenProvisional = Convert.FromBase64String(HelperMethods.base64DefaultImage);
                image = BitmapFactory.DecodeByteArray(imagenProvisional, 0, imagenProvisional.Length);
                imagenProvisional = null;
            }

			viewHolder.ProfilePhotoImageView.SetImageBitmap(HelperMethods.redondearImagen(image, 200, 200));
			image.Dispose();
			image = null;

            // set the Tag property of the AcquaintanceRow view to the position (index) of the item that is currently being bound. We'll need it later in the OnClick() implementation.
            viewHolder.AcquaintanceRow.Tag = position;

		    // set OnClickListener of AcquaintanceRow
		    viewHolder.AcquaintanceRow.SetOnClickListener(this);
        }

        public void OnClick(View v)
		{
            Intent detailIntent = null;
			vista = v;
			vista.Enabled = false;
            empleado = empleadoModel[(int)v.Tag];
			profileImageView = currentActivity.FindViewById(Resource.Id.profilePhotoImageView);

            switch (currentActivity.Intent.GetStringExtra(currentActivity.GetString(Resource.String.acquaintanceListIntentKey)))
            {
                case "PerfilContactosActivity":
                    detailIntent = new Intent(currentActivity, typeof(InformacionPersonal));

                    // Add some identifying item data to the intent. In this case, the id of the empelado for which we're about to display the Informacion Personal screen.
                    detailIntent.PutExtra(currentActivity.Resources.GetString(Resource.String.InformacionPersonalIntentKey), empleado.ID_Login);
					HelperMethods.startIntent(detailIntent, currentActivity, vista, profileImageView);
					vista.Enabled = true;
                    break;
                case "MapaActivity":
					int[] ID_UsuariosConsultar = { empleado.ID_Login};

					if (progress == null)
					{
						progress = HelperMethods.setSpinnerDialog("Cargando Coordenadas...", currentActivity);
					}

                    Conexion_Web_Service._client.BajarCoordenadasEmpleadosAsync(0, 0, ID_UsuariosConsultar);
                    progress.Show();
                    break;
                case "ChatActivity":
                    detailIntent = new Intent(currentActivity, typeof(ChatActivity));
                    detailIntent.PutExtra(currentActivity.Resources.GetString(Resource.String.idChat), empleado.ID_Login.ToString());
                    detailIntent.PutExtra(currentActivity.Resources.GetString(Resource.String.NombreDestinatarioChat), HelperMethods.DisplayName(empleado));
					HelperMethods.startIntent(detailIntent, currentActivity, vista, profileImageView);
					vista.Enabled = true;
					break;
            }      
        }

        #region Method Completed
        public void _client_Lista_BajarCoordenadasEmpleadosCompleted(object sender, BajarCoordenadasEmpleadosCompletedEventArgs BajarCoordenadasEmpleadosCompleted)
        {
            Intent detailIntent = null;

            if (BajarCoordenadasEmpleadosCompleted.Error == null)
            {
                Perfil_Login.ListaCoordenadasEmpleado = BajarCoordenadasEmpleadosCompleted.Result;  
                detailIntent = new Intent(currentActivity, typeof(AcquaintanceDetailActivity));

                // Add some identifying item data to the intent. In this case, the id of the acquaintance for which we're about to display the detail screen.
                detailIntent.PutExtra(currentActivity.Resources.GetString(Resource.String.acquaintanceDetailIntentKey), empleado.ID_Login);

                currentActivity.RunOnUiThread(() => {
					vista.Enabled = true;
                    progress.Hide();
					currentActivity.StartActivity(detailIntent);
					HelperMethods.makeTransition(currentActivity);
                });
            }
			else
			{
				Android.App.AlertDialog.Builder alerta = HelperMethods.setAlert(HelperMethods.problemaConexion, currentActivity);
				currentActivity.RunOnUiThread(() =>
				{
					vista.Enabled = true;
					progress.Hide();
					alerta.Show();
				});
			}
        }
        #endregion

        #region HelperMethods
        // Return the number of items
        public override int ItemCount => empleadoModel.Count();

		public void animateTo(List<EmpleadoDTO> models)
		{
			applyAndAnimateRemovals(models);
			applyAndAnimateAdditions(models);
			applyAndAnimateMovedItems(models);
			NotifyDataSetChanged();
			GC.Collect(0);
		}

		void applyAndAnimateRemovals(List<EmpleadoDTO> newModels)
		{
			for (int i = empleadoModel.Count() - 1; i >= 0; i--)
			{
				EmpleadoDTO model = empleadoModel[i];
				if (!newModels.Contains(model))
				{
					removeItem(i);
				}
			}
		}

		void applyAndAnimateAdditions(List<EmpleadoDTO> newModels)
		{
			for (int i = 0, count = newModels.Count(); i < count; i++)
			{
				EmpleadoDTO model = newModels[i];
				if (!empleadoModel.Contains(model))
				{
					addItem(i, model);
				}
			}
		}

		void applyAndAnimateMovedItems(List<EmpleadoDTO> newModels)
		{
			for (int toPosition = newModels.Count() - 1; toPosition >= 0; toPosition--)
			{
				EmpleadoDTO model = newModels[toPosition];
				int fromPosition = empleadoModel.IndexOf(model);
				if (fromPosition >= 0 && fromPosition != toPosition)
				{
					moveItem(fromPosition, toPosition);
				}
			}
		}

		EmpleadoDTO removeItem(int position)
		{
			EmpleadoDTO model = empleadoModel[position];
			empleadoModel.RemoveAt(position);
			NotifyItemRemoved(position);
			return model;
		}

		void addItem(int position, EmpleadoDTO model)
		{			
			empleadoModel.Insert(position,model);
			NotifyItemInserted(position);
		}

		void moveItem(int fromPosition, int toPosition)
		{
			EmpleadoDTO model = empleadoModel[fromPosition];
			empleadoModel.RemoveAt(fromPosition);
			empleadoModel.Insert(toPosition, model);
			NotifyItemMoved(fromPosition, toPosition);
		}
		#endregion
	}
    #endregion
}