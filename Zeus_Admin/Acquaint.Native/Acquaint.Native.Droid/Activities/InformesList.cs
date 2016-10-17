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
using Android.Graphics;
using System;
using System.Collections.Generic;
using Android.Content.PM;

namespace Acquaint.Native.Droid
{
	[Activity(ConfigurationChanges = ConfigChanges.Orientation | ConfigChanges.ScreenSize)]
	public class InformesList : AppCompatActivity , SearchView.IOnQueryTextListener
	{
		Toolbar toolbar;
		InformesCollectionAdapter informesCollectionAdapter;
		RecyclerView recyclerView;
		List<Informes> listaInformes = new InformesColeccion().ListaInformes;

		#region Lifecycle Implementation
		protected override void OnCreate(Bundle savedInstanceState)
		{
			base.OnCreate(savedInstanceState);

			// instantiate adapter
			informesCollectionAdapter = new InformesCollectionAdapter(this);

			// instantiate the layout manager
			LinearLayoutManager layoutManager = new LinearLayoutManager(this);

			// set the content view
			SetContentView(Resource.Layout.InformesList);

			toolbar = FindViewById<Toolbar>(Resource.Id.toolbar);

			// setup the action bar
			SetSupportActionBar(toolbar);

			// ensure that the system bar color gets drawn
			Window.AddFlags(WindowManagerFlags.DrawsSystemBarBackgrounds);

			// set the title of both the activity and the action bar
			Title = SupportActionBar.Title = "Informes";

			SupportActionBar.SetDisplayHomeAsUpEnabled(true);
			SupportActionBar.SetHomeButtonEnabled(true);

			// instantiate/inflate the RecyclerView
			recyclerView = (RecyclerView)FindViewById(Resource.Id.InformesRecyclerView);

			// set RecyclerView's layout manager 
			recyclerView.SetLayoutManager(layoutManager);

			// set RecyclerView's adapter
			recyclerView.SetAdapter(informesCollectionAdapter);
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
			var newModel = (from newModelQuery in listaInformes where newModelQuery.NombreInforme.ToLower().Contains(query.ToLower()) select newModelQuery).ToList();
			informesCollectionAdapter.animateTo(newModel);
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

	#region InformesViewHolder
	class InformesViewHolder : RecyclerView.ViewHolder
	{
		public View InformeRow { get; }

		public TextView NombreInforme { get; }

		public TextView DescripcionInformeView { get; }

		public ImageViewAsync InformesPhotoImageView { get; }

		public InformesViewHolder(View itemView) : base(itemView)
		{
			InformeRow = itemView;

			NombreInforme = InformeRow.FindViewById<TextView>(Resource.Id.NombreInformeView);
			DescripcionInformeView = InformeRow.FindViewById<TextView>(Resource.Id.DescripcionInformeView);
			InformesPhotoImageView = InformeRow.FindViewById<ImageViewAsync>(Resource.Id.InformesImageView);
		}
	}
	#endregion

	#region InformesCollectionAdapter
	class InformesCollectionAdapter : RecyclerView.Adapter, View.IOnClickListener
	{
		Activity currentActivity;
		View vista;
		List<Informes> informesColeccion;	                                                      

		public InformesCollectionAdapter(Activity current)
		{
			currentActivity = current;
			informesColeccion = new InformesColeccion().ListaInformes;
		}

		// when a RecyclerView itemView is requested, the OnCreateViewHolder() is called
		public override RecyclerView.ViewHolder OnCreateViewHolder(ViewGroup parent, int viewType)
		{
			// instantiate/inflate a view
			var itemView = LayoutInflater.From(parent.Context).Inflate(Resource.Layout.InformesRowView, parent, false);

			// Create a ViewHolder to find and hold these view references, and 
			// register OnClick with the view holder:
			var viewHolder = new InformesViewHolder(itemView);

			return viewHolder;
		}

		// populates the properties of the child views of the itemView
		public override void OnBindViewHolder(RecyclerView.ViewHolder holder, int position)
		{
			// instantiate a new view holder
			var viewHolder = holder as InformesViewHolder;

			// get an item by position (index)
			Informes informe = informesColeccion[position];

			// assign values to the views' text properties
			if (viewHolder == null) return;

			viewHolder.NombreInforme.Text = informe.NombreInforme;
			viewHolder.DescripcionInformeView.Text = informe.DescripcionInforme;

			using (Bitmap imagenCircular = HelperMethods.redondearImagen(BitmapFactory.DecodeResource(currentActivity.Resources, Resource.Mipmap.Informe_Lista), 200, 200))
			{
				viewHolder.InformesPhotoImageView.SetImageBitmap(imagenCircular);
			}

			// set the Tag property of the AcquaintanceRow view to the position (index) of the item that is currently being bound. We'll need it later in the OnLick() implementation.
			viewHolder.InformeRow.Tag = position;

			// set OnClickListener of AcquaintanceRow
			viewHolder.InformeRow.SetOnClickListener(this);
		}

		public void OnClick(View v)
		{
			vista = v;
			vista.Enabled = false;
			Intent informeIntent = null;
			string informeNombre = informesColeccion[(int)v.Tag].NombreInforme;

			switch (informeNombre)
			{
				case "Informe Coordenadas":
					informeIntent = new Intent(currentActivity, typeof(ConsultaActivity));
					informeIntent.PutExtra(currentActivity.GetString(Resource.String.TipoInforme), informeNombre);
					informeIntent.PutExtra(currentActivity.GetString(Resource.String.ConsultaIntentKey), currentActivity.GetString(Resource.String.InformesActivity));
					break;
				case "Informe Personal Asignado":
					informeIntent = new Intent(currentActivity, typeof(InformesDataGridActivity));
					break;
			}
			try
			{
				vista.Enabled = true;
				currentActivity.StartActivity(informeIntent);
				HelperMethods.makeTransition(currentActivity);
			}
			catch (Exception)
			{
				vista.Enabled = true;
				Android.App.AlertDialog.Builder alerta = HelperMethods.setAlert("Sin Implementar", currentActivity);
				alerta.Show();
			}
		}

		// Return the number of items
		public override int ItemCount => informesColeccion.Count();

		public void animateTo(List<Informes> models)
		{
			applyAndAnimateRemovals(models);
			applyAndAnimateAdditions(models);
			applyAndAnimateMovedItems(models);
			NotifyDataSetChanged();
			GC.Collect(0);
		}

		void applyAndAnimateRemovals(List<Informes> newModels)
		{
			for (int i = informesColeccion.Count() - 1; i >= 0; i--)
			{
				Informes model = informesColeccion[i];
				if (!newModels.Contains(model))
				{
					removeItem(i);
				}
			}
		}

		void applyAndAnimateAdditions(List<Informes> newModels)
		{
			for (int i = 0, count = newModels.Count(); i < count; i++)
			{
				Informes model = newModels[i];
				if (!informesColeccion.Contains(model))
				{
					addItem(i, model);
				}
			}
		}

		void applyAndAnimateMovedItems(List<Informes> newModels)
		{
			for (int toPosition = newModels.Count() - 1; toPosition >= 0; toPosition--)
			{
				Informes model = newModels[toPosition];
				int fromPosition = informesColeccion.IndexOf(model);
				if (fromPosition >= 0 && fromPosition != toPosition)
				{
					moveItem(fromPosition, toPosition);
				}
			}
		}

		Informes removeItem(int position)
		{
			Informes model = informesColeccion[position];
			informesColeccion.RemoveAt(position);
			NotifyItemRemoved(position);
			return model;
		}

		void addItem(int position, Informes model)
		{
			informesColeccion.Insert(position, model);
			NotifyItemInserted(position);
		}

		void moveItem(int fromPosition, int toPosition)
		{
			Informes model = informesColeccion[fromPosition];
			informesColeccion.RemoveAt(fromPosition);
			informesColeccion.Insert(toPosition, model);
			NotifyItemMoved(fromPosition, toPosition);
		}
	}
	#endregion
}