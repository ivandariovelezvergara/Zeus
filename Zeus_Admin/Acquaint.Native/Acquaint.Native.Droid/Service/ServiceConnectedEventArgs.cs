using System;
using Android.OS;

namespace Acquaint.Native.Droid
{
	public class ServiceConnectedEventArgs : EventArgs
	{
		public IBinder Binder { get; set; }
	}
}