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
    
    public partial class tbl_informacion_usuarios
    {
        public int usr_login_ID { get; set; }
        public string usr_nombres { get; set; }
        public string usr_apellidos { get; set; }
        public string usr_direccion { get; set; }
        public Nullable<decimal> usr_salario { get; set; }
        public string usr_telefonoMovil { get; set; }
        public string usr_telefonoFijo { get; set; }
        public string usr_email { get; set; }
        public short usr_departamento_ID { get; set; }
        public byte[] usr_fotografia { get; set; }
        public string usr_identificacion { get; set; }
        public short usr_cargo_ID { get; set; }
        public short usr_grupo_encargado_ID { get; set; }
        public long usr_fechanacimiento { get; set; }
    
        public virtual tbl_departamentos tbl_departamentos { get; set; }
        public virtual tbl_grupos tbl_grupos { get; set; }
        public virtual tbl_grupos tbl_grupos1 { get; set; }
        public virtual tbl_login tbl_login { get; set; }
    }
}