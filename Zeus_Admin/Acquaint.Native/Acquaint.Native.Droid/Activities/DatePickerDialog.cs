using System;
using Android.App;
using Android.Content;
using Android.OS;

namespace Acquaint.Native.Droid
{
    class DatePickerDialog : DialogFragment
    {
        readonly Context _context;
        DateTime _date;
        readonly Android.App.DatePickerDialog.IOnDateSetListener _listener;

        public DatePickerDialog(Context context, DateTime date, Android.App.DatePickerDialog.IOnDateSetListener listener)
        {
            _context = context;
            _date = date;
            _listener = listener;
        }

        public override Dialog OnCreateDialog(Bundle saveState)
        {
            var dialog = new Android.App.DatePickerDialog(_context, _listener, _date.Year, _date.Month - 1, _date.Day);
            return dialog;
        }
    }
}
