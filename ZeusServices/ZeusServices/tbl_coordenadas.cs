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
    
    public partial class tbl_coordenadas
    {
        public int usr_id { get; set; }
        public decimal usr_latitud { get; set; }
        public decimal usr_longitud { get; set; }
        public decimal usr_bearing { get; set; }
        public Nullable<decimal> usr_velocidad { get; set; }
        public decimal usr_precision { get; set; }
        public long usr_fecha_coordenada { get; set; }
        public int ID_Coordenada_ { get; set; }
        public string usr_direccion { get; set; }
    
        public virtual tbl_login tbl_login { get; set; }
    }
}