using System;
using System.Collections.Generic;
using System.Data;
using System.Linq;
using System.Runtime.Serialization;
using System.ServiceModel;

namespace ZeusServices
{
    // NOTA: puede usar el comando "Rename" del menú "Refactorizar" para cambiar el nombre de interfaz "IService1" en el código y en el archivo de configuración a la vez.
    [ServiceContract]
    public interface IServiceZeus
    {
        [OperationContract()]
        string ProbarConexionWs();

        [OperationContract()]
        EmpleadoDTO VerificarLogin(string login, string password);

        [OperationContract()]
        void AgregarEmpleado(string login, string password, long fechaPassword, long fechaUltimoIngreso, long fechaCreacionUsuario, string nombres, string apellidos, string direccion, decimal salario, string telefonoMovil, string telefonoFijo, string email, short departamentoID, byte[] foto, string identificacion, short cargoID, short grupoEncargadoID, long fechaNacimiento);

        [OperationContract()]
        List<EmpleadoDTO> ListaEmpleadosAsignados(int ID_Grupo_Encargado);

        [OperationContract()]
        List<EmpleadoDTO> ListaGrupoDeTrabajoConSupervisor(int ID_Grupo_Perteneciente, int loginExcluir);

        [OperationContract()]
        void SubirCoordenadasEmpleados(int ID, decimal Latitud, decimal Longitud, decimal? Velocidad, decimal Precision, decimal Bearing, string tiempo);

        [OperationContract()]
        List<UbicacionDTO> BajarCoordenadasEmpleados(long fechaInicial, long fechaFinal, int[] persona);

        [OperationContract()]
        List<HistorialChat> ListarMensajes(int emisor, int receptor);

        [OperationContract()]
        void guardarMensajes(int emisor, int receptor, string mensaje, DateTime fecha);

    }

    //==================================================================================================
    //       Data Transfer Object(DTO) para retornar Custom Class desde el Servicio hacia el Cliente
    //==================================================================================================
    // Utilice un contrato de datos, como se ilustra en el ejemplo siguiente, para agregar tipos compuestos a las operaciones de servicio.

    [DataContract]
    public class EmpleadoDTO
    {
        public EmpleadoDTO() { }
        public EmpleadoDTO(tbl_login Empleado)
        {
            ID_Login = Empleado.ID_Login;
            usr_login = Empleado.usr_login;
            usr_fecha_creacion_usuario = HelperMethods.ConvertFromUnixTimestamp(Empleado.usr_fecha_creacion_usuario, true);
            usr_fecha_ultimo_ingreso = HelperMethods.ConvertFromUnixTimestamp(Empleado.usr_fecha_ultimo_ingreso, true);
            usr_nombres = Empleado.tbl_informacion_usuarios.usr_nombres;
            usr_apellidos = Empleado.tbl_informacion_usuarios.usr_apellidos;
            usr_direccion = Empleado.tbl_informacion_usuarios.usr_direccion;
            usr_salario = Empleado.tbl_informacion_usuarios.usr_salario;
            usr_telefonoMovil = Empleado.tbl_informacion_usuarios.usr_telefonoMovil;
            usr_telefonoFijo = Empleado.tbl_informacion_usuarios.usr_telefonoFijo;
            usr_email = Empleado.tbl_informacion_usuarios.usr_email;
            usr_departamento_ID = Empleado.tbl_informacion_usuarios.usr_departamento_ID;
            depar_nombre = Empleado.tbl_informacion_usuarios.tbl_departamentos.depar_nombre;
            usr_fotografia = Empleado.tbl_informacion_usuarios.usr_fotografia;
            usr_fechanacimiento = HelperMethods.ConvertFromUnixTimestamp(Empleado.tbl_informacion_usuarios.usr_fechanacimiento, false);
            usr_identificacion = Empleado.tbl_informacion_usuarios.usr_identificacion;
            usr_cargo_ID = Empleado.tbl_informacion_usuarios.usr_cargo_ID;
            grp_nombre_cargo = Empleado.tbl_informacion_usuarios.tbl_grupos.grp_nombre;
            usr_grupo_encargado_ID = Empleado.tbl_informacion_usuarios.usr_grupo_encargado_ID;

            using (zeusEntities context = new zeusEntities())
            {
                var nombreGrupoEncargadoLista = (from tablaGrupos in context.tbl_grupos
                                                 where tablaGrupos.ID_Grupo == Empleado.tbl_informacion_usuarios.usr_grupo_encargado_ID
                                                 select tablaGrupos.grp_nombre).ToList();

                foreach (var nombreGrupoEncargado in nombreGrupoEncargadoLista)
                {
                    grp_nombre_encargado = nombreGrupoEncargado;
                }
            }
        }

        [DataMember]
        public int ID_Login { get; set; }
        [DataMember]
        public string usr_login { get; set; }
        [DataMember]
        public string usr_fecha_creacion_usuario { get; set; }
        [DataMember]
        public string usr_fecha_ultimo_ingreso { get; set; }
        [DataMember]
        public string usr_nombres { get; set; }
        [DataMember]
        public string usr_apellidos { get; set; }
        [DataMember]
        public string usr_direccion { get; set; }
        [DataMember]
        public decimal? usr_salario { get; set; }
        [DataMember]
        public string usr_telefonoMovil { get; set; }
        [DataMember]
        public string usr_telefonoFijo { get; set; }
        [DataMember]
        public string usr_email { get; set; }
        [DataMember]
        public short usr_departamento_ID { get; set; }
        [DataMember]
        public string depar_nombre { get; set; }
        [DataMember]
        public byte[] usr_fotografia { get; set; }
        [DataMember]
        public string usr_fechanacimiento { get; set; }
        [DataMember]
        public string usr_identificacion { get; set; }
        [DataMember]
        public short usr_cargo_ID { get; set; }
        [DataMember]
        public string grp_nombre_cargo { get; set; }
        [DataMember]
        public short usr_grupo_encargado_ID { get; set; }
        [DataMember]
        public string grp_nombre_encargado { get; set; }
    }

    [DataContract]
    public class UbicacionDTO
    {
        public UbicacionDTO() { }
        public UbicacionDTO(tbl_coordenadas coordenada)
        {
            ID_Usuario_Ubicacion = coordenada.usr_id;
            ID_Coordenada = coordenada.ID_Coordenada_;
            Latitud = coordenada.usr_latitud;
            Longitud = coordenada.usr_longitud;
            Velocidad = coordenada.usr_velocidad;
            Precision = coordenada.usr_precision;
            Bearing = coordenada.usr_bearing;
            Tiempo = HelperMethods.ConvertFromUnixTimestamp(coordenada.usr_fecha_coordenada, true);
            Direccion = coordenada.usr_direccion;
            using (zeusEntities context = new zeusEntities())
            {
                Nombre_Usuario = (from usuario in context.tbl_informacion_usuarios
                                 join usuarioCoordenada in context.tbl_coordenadas
                                 on usuario.usr_login_ID equals usuarioCoordenada.usr_id
                                 where usuario.usr_login_ID == coordenada.usr_id
                                 select usuario.usr_nombres + " " +  usuario.usr_apellidos).FirstOrDefault();
            }
        }

        [DataMember]
        public int ID_Usuario_Ubicacion { get; set; }
        [DataMember]
        public int ID_Coordenada { get; set; }
        [DataMember]
        public string Nombre_Usuario { get; set; }
        [DataMember]
        public string Direccion { get; set; }
        [DataMember]
        public decimal Latitud { get; set; }
        [DataMember]
        public decimal Longitud { get; set; }
        [DataMember]
        public decimal? Velocidad { get; set; }
        [DataMember]
        public decimal Precision { get; set; }
        [DataMember]
        public decimal Bearing { get; set; }
        [DataMember]
        public string Tiempo { get; set; }
    }

    [DataContract]
    public class HistorialChat
    {
        public HistorialChat() { }
        public HistorialChat(tbl_historial_chat historial)
        {
            ID_Chat = historial.ID_Chat;
            Emisor = historial.chat_emisor;
            Receptor = historial.chat_emisor;
            Mensaje = historial.chat_mensaje;
            Fecha = historial.chat_fecha;
        }

        [DataMember]
        public long ID_Chat { get; set; }
        [DataMember]
        public int Emisor { get; set; }
        [DataMember]
        public int Receptor { get; set; }
        [DataMember]
        public string Mensaje { get; set; }
        [DataMember]
        public DateTime Fecha { get; set; }
    }
}
