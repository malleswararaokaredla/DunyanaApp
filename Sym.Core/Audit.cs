using System;

namespace Sym.Core
{
    public class Audit : TrackEntity<Audit, int>
    {

		private string _source;
		private string _action;
		private string _notes;
		private string _createdby;
		private DateTime _createddate;
		private string _hostName;
		private string _ipaddress;

		
		public string Source
		{
			get { return _source; }
			set { _source = value; }
		}

		public string Action
		{
			get { return _action; }
			set { _action = value; }
		}

		public string Notes
		{
			get { return _notes; }
			set { _notes = value; }
		}

		public new string CreatedBy
		{
			get { return _createdby; }
			set { _createdby = value; }
		}

		public new DateTime CreatedDate
		{
			get { return _createddate; }
			set { _createddate = value; }
		}
 

		public string HostName
		{
			get { return _hostName; }

			set { _hostName = value; }
		}

		public string IPAddress
		{
			get { return _ipaddress; }
			set { _ipaddress = value; }
		}





	}
}
