using Android.App;
using Android.OS;
using Android.Views;
using Android.Widget;
using Syncfusion.SfDataGrid;
using Syncfusion.SfDataGrid.DataPager;
using Syncfusion.SfDataGrid.Exporting;
using System.Reflection;
using System.IO;
using Java.IO;
using Syncfusion.Pdf;
using Syncfusion.Pdf.Graphics;
using Syncfusion.Drawing;
using System;
using Android.Content;
using System.Linq;

namespace Acquaint.Native.Droid
{
    [Activity]
	public class InformesDataGridActivity : Activity
	{
		SfDataGrid sfGrid;
		string intentKey;
		protected override void OnCreate(Bundle savedInstanceState)
		{
			base.OnCreate(savedInstanceState);

            Button exportPdf;
            Button exportExcel;
            SfDataPager sfDataPager;

			intentKey = Intent.GetStringExtra(GetString(Resource.String.InformesIntentKey));
			LinearLayout linearLayout = new LinearLayout(this);
			linearLayout.Orientation = Orientation.Vertical;

			exportPdf = new Button(this);
			exportPdf.Text = "Exportar PDF";
			exportPdf.SetMaxHeight(200);
			exportPdf.SetMaxWidth(100);
			exportPdf.Click += ExportToPdf;
			exportExcel = new Button(this);
			exportExcel.Text = "Exportar Excel";
			exportExcel.SetMaxHeight(200);
			exportExcel.SetMaxWidth(100);
			exportExcel.Click += ExportToExcel;

			sfDataPager = new SfDataPager(this);
			sfGrid = new SfDataGrid(this);
			sfDataPager.PageSize = 10;
			sfDataPager.NumericButtonCount = 20;

			switch (intentKey)
			{
				case "Informe Coordenadas":
					sfDataPager.Source = Perfil_Login.ListaCoordenadasEmpleado;
					break;
				default:
					sfDataPager.Source = Perfil_Login.ListaEmpleadosAsignados;
					break;
			}

			sfGrid.ItemsSource = sfDataPager.PagedSource;
			sfGrid.SelectionMode = SelectionMode.Single;
			sfGrid.AllowSorting = true;
			sfGrid.SelectionChanging += sfGrid_SelectionChanging;

			LinearLayout option = new LinearLayout(this);
			option.SetGravity(GravityFlags.Center);
			option.Orientation = Orientation.Horizontal;
			option.AddView(exportPdf, Convert.ToInt32(150 * sfGrid.Resources.DisplayMetrics.Density), ViewGroup.LayoutParams.WrapContent);
			option.AddView(exportExcel, Convert.ToInt32(150 * sfGrid.Resources.DisplayMetrics.Density), ViewGroup.LayoutParams.WrapContent);
			LinearLayout.LayoutParams layoutparams = new LinearLayout.LayoutParams(ViewGroup.LayoutParams.WrapContent, ViewGroup.LayoutParams.WrapContent);
			layoutparams.SetMargins(0, (int)(20 * sfGrid.Resources.DisplayMetrics.Density), 0, (int)(20 * sfGrid.Resources.DisplayMetrics.Density));
			layoutparams.Gravity = GravityFlags.CenterHorizontal;
			option.LayoutParameters = layoutparams;

			linearLayout.AddView(sfDataPager, new ViewGroup.LayoutParams(ViewGroup.LayoutParams.MatchParent,(int)SfDataGridHelpers.ConvertDpToPixels(sfGrid, 75)));
			linearLayout.AddView(option);
			linearLayout.AddView(sfGrid);
			SetContentView(linearLayout);
		}

		protected override void OnDestroy()
		{
			sfGrid.Dispose();
			sfGrid = null;
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


		void sfGrid_SelectionChanging(object sender, GridSelectionChangingEventArgs e)
		{
			switch (intentKey)
			{
				case "Informe Coordenadas":
					createModalView((UbicacionDTO)e.AddedItems[0]);
					break;
				default:
					createModalView((EmpleadoDTO)e.AddedItems[0]);
					break;
			}
		}

		void createModalView<T>(T dataRow)
		{
			Type m_tipo = null;
			PropertyInfo[] m_propiedades = null;
			m_tipo = dataRow.GetType();
			m_propiedades = m_tipo.GetProperties();

			ScrollView scroll = new ScrollView(this);
			scroll.LayoutParameters = new ViewGroup.LayoutParams(ViewGroup.LayoutParams.WrapContent, ViewGroup.LayoutParams.WrapContent);

			GridLayout contentModal = new GridLayout(this);
			contentModal.RowCount = m_propiedades.Count();
			contentModal.ColumnCount = 2;
			GridLayout.LayoutParams hola = new GridLayout.LayoutParams();
			hola.SetMargins(10,10,10,10);
			hola.SetGravity(GravityFlags.Center);
			contentModal.LayoutParameters = hola;

			foreach (PropertyInfo propiedad in m_propiedades)
			{
				TextView campoNombreModal = new TextView(this);
				campoNombreModal.Text = propiedad.Name;
				campoNombreModal.TextAlignment = TextAlignment.Center;

				TextView campoValorModal = new TextView(this);
				campoValorModal.Text = propiedad.GetValue(dataRow, null).ToString();
				campoValorModal.TextAlignment = TextAlignment.Center;

				contentModal.AddView(campoNombreModal);
				contentModal.AddView(campoValorModal);
			}

			scroll.AddView(contentModal);

			AlertDialog.Builder ventanaModalAlert = new AlertDialog.Builder(this);
			ventanaModalAlert.SetView(scroll);
			ventanaModalAlert.SetNegativeButton("Aceptar", delegate { });
			ventanaModalAlert.Create().Show();
		}

		void ExportToExcel(object sender, EventArgs e)
		{
			DataGridExcelExportingController excelExport = new DataGridExcelExportingController();
			var excelEngine = excelExport.ExportToExcel(this.sfGrid, new DataGridExcelExportingOption() { ExportRowHeight = false, ExportColumnWidth = false, DefaultColumnWidth = 100, DefaultRowHeight = 60 });
			var workbook = excelEngine.Excel.Workbooks[0];
			using (MemoryStream stream = new MemoryStream())
			{
				workbook.SaveAs(stream);
				workbook.Close();
				excelEngine.Dispose();
				Save("DataGrid.xlsx", "application/msexcel", stream, sfGrid.Context);
			}
		}

		void ExportToPdf(object sender, EventArgs e)
		{
			DataGridPdfExportingController pdfExport = new DataGridPdfExportingController();
			pdfExport.HeaderAndFooterExporting += pdfExport_HeaderAndFooterExporting;
			using (MemoryStream stream = new MemoryStream())
			{
				var doc = pdfExport.ExportToPdf(sfGrid);
				doc.Save(stream);
				doc.Close(true);
				Save("DataGrid.pdf", "application/pdf", stream, sfGrid.Context);
			}
		}

		void pdfExport_HeaderAndFooterExporting(object sender, PdfHeaderFooterEventArgs e)
		{
			var width = e.PdfPage.GetClientSize().Width;

			PdfPageTemplateElement header = new PdfPageTemplateElement(width, 60);
			var assmbely = Assembly.GetExecutingAssembly();
			using (Stream imagestream = assmbely.GetManifestResourceStream("SampleBrowser.Resources.drawable.SyncfusionLogo.jpg"))
			{
				if (imagestream != null)
				{
					PdfImage pdfImage = PdfImage.FromStream(imagestream);
					header.Graphics.DrawImage(pdfImage, new RectangleF(0, 0, width, 50));
					e.PdfDocumentTemplate.Top = header;
				}
			}
		}

		public void Save(string fileName, string contentType, MemoryStream stream, Context context)
		{
			string exception = string.Empty;
			string root = null;
			if (Android.OS.Environment.IsExternalStorageEmulated)
			{
				root = Android.OS.Environment.ExternalStorageDirectory.ToString();
			}
			else
				root = System.Environment.GetFolderPath(System.Environment.SpecialFolder.MyDocuments);

			Java.IO.File myDir = new Java.IO.File(root + "/Syncfusion");
			myDir.Mkdir();

			Java.IO.File file = new Java.IO.File(myDir, fileName);

			if (file.Exists())
			{
				file.Delete();
				file.CreateNewFile();
			}
			try
			{
				using (FileOutputStream outs = new FileOutputStream(file, false))
				{
					outs.Write(stream.ToArray());
					outs.Flush();
					outs.Close();
				}
			}
			catch (Exception e)
			{
				exception = e.ToString();
				AlertDialog.Builder alerta = HelperMethods.setAlert(exception, this);
			}
			if (file.Exists() && contentType != "application/html")
			{
				Android.Net.Uri path = Android.Net.Uri.FromFile(file);
				string extension = Android.Webkit.MimeTypeMap.GetFileExtensionFromUrl(Android.Net.Uri.FromFile(file).ToString());
				string mimeType = Android.Webkit.MimeTypeMap.Singleton.GetMimeTypeFromExtension(extension);
				Intent intent = new Intent(Intent.ActionView);
				intent.SetDataAndType(path, mimeType);
				context.StartActivity(Intent.CreateChooser(intent, "Choose App"));

			}
		}

	}


}