//------------------------------------------------------------------------------
// <auto-generated>
//     This code was generated from a template.
//
//     Manual changes to this file may cause unexpected behavior in your application.
//     Manual changes to this file will be overwritten if the code is regenerated.
// </auto-generated>
//------------------------------------------------------------------------------

namespace ZeusServices
{
    using System;
    using System.Collections.Generic;
    
    public partial class tbl_historial_chat
    {
        public long ID_Chat { get; set; }
        public int chat_emisor { get; set; }
        public int chat_receptor { get; set; }
        public string chat_mensaje { get; set; }
        public System.DateTime chat_fecha { get; set; }
    
        public virtual tbl_login tbl_login { get; set; }
        public virtual tbl_login tbl_login1 { get; set; }
    }
}
