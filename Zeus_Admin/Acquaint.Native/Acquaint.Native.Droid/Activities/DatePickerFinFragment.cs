using System;
using Android.App;
using Android.OS;
using Android.Views;
using Android.Widget;

namespace Acquaint.Native.Droid
{
    public class DatePickerFinFragment : Fragment, Android.App.DatePickerDialog.IOnDateSetListener
    {
        public override View OnCreateView(LayoutInflater inflater, ViewGroup container, Bundle savedInstanceState)
        {
            var view = inflater.Inflate(Resource.Layout.DatePickerFin, container, false);
            
            view.FindViewById<Button>(Resource.Id.btnCalendario).Click += (sender, args) =>
            {
                var dialog = new DatePickerDialogFin(Activity, DateTime.Now, this);
                dialog.Show(FragmentManager, null);
            };
            return view;
        }

        public void OnDateSet(DatePicker view, int year, int monthOfYear, int dayOfMonth)
        {
            var date = new DateTime(year, monthOfYear + 1, dayOfMonth);
            View.FindViewById<TextView>(Resource.Id.FechaFinal).Text = date.ToString("yyyy-MM-dd");
        }
    }
}