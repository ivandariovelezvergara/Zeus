using System;
using System.Collections.Generic;
using System.Linq;
using System.Data;
using System.Data.SqlClient;
using PubNubMessaging.Core;

namespace ZeusServices
{
    // NOTA: puede usar el comando "Rename" del menú "Refactorizar" para cambiar el nombre de clase "Service1" en el código, en svc y en el archivo de configuración.
    // NOTE: para iniciar el Cliente de prueba WCF para probar este servicio, seleccione Service1.svc o Service1.svc.cs en el Explorador de soluciones e inicie la depuración.
    public class ZeusService : IServiceZeus
    {
        public EmpleadoDTO VerificarLogin(string login, string password)
        {
            using (zeusEntities context = new zeusEntities())
            {
                EmpleadoDTO MiPerfilRetornar = null;

                var miPerfilLista = (from tablaLogin in context.tbl_login
                                     join tablaInformacion in context.tbl_informacion_usuarios
                                     on tablaLogin.ID_Login equals tablaInformacion.usr_login_ID
                                     join tablaGrupos in context.tbl_grupos
                                     on tablaInformacion.usr_cargo_ID equals tablaGrupos.ID_Grupo
                                     join tablaDepartamento in context.tbl_departamentos
                                     on tablaInformacion.usr_departamento_ID equals tablaDepartamento.ID_Departamento
                                     where tablaLogin.usr_login == login && tablaLogin.usr_password == password
                                     select tablaLogin).FirstOrDefault();

                if (miPerfilLista != null)
                {
                    MiPerfilRetornar = new EmpleadoDTO(miPerfilLista);
                    return MiPerfilRetornar;
                }
                else
                {
                    return null;
                }
            }
        }

        public void AgregarEmpleado(string login, string password, long fechaPassword, long fechaUltimoIngreso, long fechaCreacionUsuario, string nombres, string apellidos, string direccion, decimal salario, string telefonoMovil, string telefonoFijo, string email, short departamentoID, byte[] foto, string identificacion, short cargoID, short grupoEncargadoID, long fechaNacimiento)
        {
            using (zeusEntities context = new zeusEntities())
            {
                tbl_informacion_usuarios informacionPersonal = new tbl_informacion_usuarios();
                tbl_login informacionLogin = new tbl_login();            

                informacionLogin.usr_login = login;
                informacionLogin.usr_password = password;
                informacionLogin.usr_fecha_password = fechaPassword;
                informacionLogin.usr_fecha_ultimo_ingreso = fechaUltimoIngreso;
                informacionLogin.usr_fecha_creacion_usuario = fechaCreacionUsuario;

                context.tbl_login.Add(informacionLogin);
                context.SaveChanges();

                var idEmpleadoGuardado = (from tablaLogin in context.tbl_login
                                          where tablaLogin.usr_login == login
                                          select tablaLogin.ID_Login).First();

                informacionPersonal.usr_login_ID = idEmpleadoGuardado;
                informacionPersonal.usr_nombres = nombres;
                informacionPersonal.usr_apellidos = apellidos;
                informacionPersonal.usr_direccion = direccion;
                informacionPersonal.usr_salario = salario;
                informacionPersonal.usr_telefonoMovil = telefonoMovil;
                informacionPersonal.usr_telefonoFijo = telefonoFijo;
                informacionPersonal.usr_email = email;
                informacionPersonal.usr_departamento_ID = departamentoID;
                informacionPersonal.usr_fotografia = foto;
                informacionPersonal.usr_identificacion = identificacion;
                informacionPersonal.usr_cargo_ID = cargoID;
                informacionPersonal.usr_grupo_encargado_ID = grupoEncargadoID;
                informacionPersonal.usr_fechanacimiento = fechaNacimiento;

                context.tbl_informacion_usuarios.Add(informacionPersonal);
                context.SaveChanges();
            }
        }

        public List<EmpleadoDTO> ListaEmpleadosAsignados(int ID_Grupo_Encargado)
        {
            using (zeusEntities context = new zeusEntities())
            {
                List<EmpleadoDTO> ListaUsuariosRetornar = new List<EmpleadoDTO>();

                var ListaUsuarios = (from tablaLogin in context.tbl_login
                                     join tablaInformacion in context.tbl_informacion_usuarios
                                     on tablaLogin.ID_Login equals tablaInformacion.usr_login_ID
                                     join tablaGrupos in context.tbl_grupos
                                     on tablaInformacion.usr_cargo_ID equals tablaGrupos.ID_Grupo
                                     join tablaDepartamento in context.tbl_departamentos
                                     on tablaInformacion.usr_departamento_ID equals tablaDepartamento.ID_Departamento
                                     //where tablaLogin.tbl_informacion_usuarios.usr_cargo_ID == ID_Grupo_Encargado
                                     select tablaLogin).ToList();

                if (ListaUsuarios.Count > 0)
                {
                    foreach (var Usuario in ListaUsuarios)
                    {
                        ListaUsuariosRetornar.Add(new EmpleadoDTO(Usuario));
                    }

                    return ListaUsuariosRetornar;
                }
                else
                {
                    return null;
                }
            }
        }

        public List<EmpleadoDTO> ListaGrupoDeTrabajoConSupervisor(int ID_Grupo_Perteneciente, int loginExcluir)
        {
            using (zeusEntities context = new zeusEntities())
            {
                List<EmpleadoDTO> ListaUsuariosRetornar = new List<EmpleadoDTO>();

                var ListaUsuarios = (from tablaLogin in context.tbl_login
                                     join tablaInformacion in context.tbl_informacion_usuarios
                                     on tablaLogin.ID_Login equals tablaInformacion.usr_login_ID
                                     join tablaGrupos in context.tbl_grupos
                                     on tablaInformacion.usr_cargo_ID equals tablaGrupos.ID_Grupo
                                     join tablaDepartamento in context.tbl_departamentos
                                     on tablaInformacion.usr_departamento_ID equals tablaDepartamento.ID_Departamento
                                     where tablaLogin.tbl_informacion_usuarios.usr_cargo_ID == ID_Grupo_Perteneciente && 
                                           tablaLogin.ID_Login != loginExcluir ||
                                           tablaLogin.tbl_informacion_usuarios.usr_grupo_encargado_ID == ID_Grupo_Perteneciente
                                     select tablaLogin).ToList();

                if (ListaUsuarios.Count > 0)
                {
                    foreach (var Usuario in ListaUsuarios)
                    {
                        ListaUsuariosRetornar.Add(new EmpleadoDTO(Usuario));
                    }

                    return ListaUsuariosRetornar;
                }
                else
                {
                    return null;
                }
            }
        }

        public void SubirCoordenadasEmpleados(int ID, decimal Latitud, decimal Longitud, decimal? Velocidad, decimal Precision, decimal Bearing, string tiempo)
        { 
            using (zeusEntities context = new zeusEntities())
            {
                tbl_coordenadas coordenadasSubir = new tbl_coordenadas();

                Pubnub DataStream = new Pubnub("pub-c-873c406e-047c-4a4a-a0d9-6d8176a935e8", "sub-c-f076a8c8-2b78-11e6-b700-0619f8945a4f");

                coordenadasSubir.usr_id = ID;
                coordenadasSubir.usr_latitud = Latitud;
                coordenadasSubir.usr_longitud = Longitud;
                coordenadasSubir.usr_velocidad = Velocidad;
                coordenadasSubir.usr_precision = Precision;
                coordenadasSubir.usr_bearing = Bearing; 
                coordenadasSubir.usr_fecha_coordenada = HelperMethods.ConvertToUnixTimestamp(Convert.ToDateTime(tiempo));
                coordenadasSubir.usr_direccion = HelperMethods.GoogleGeoCode(Latitud, Longitud);

                context.tbl_coordenadas.Add(coordenadasSubir);
                context.SaveChanges();

                UbicacionDTO coordenadasPublicar = new UbicacionDTO(coordenadasSubir);

                DataStream.Publish<string>(
                    ID.ToString(),
                    coordenadasPublicar,
                    delegate { }, delegate { });
            }
        }

        public List<UbicacionDTO> BajarCoordenadasEmpleados(long fechaInicial, long fechaFinal, int[] personaArray)
        {
            using (zeusEntities context = new zeusEntities())
            {
                List<UbicacionDTO> coordenadasEnviar = new List<UbicacionDTO>();

                if (fechaFinal == 0 && fechaInicial == 0)
                {
                    foreach (var persona in personaArray)
                    {
                        var Listacoordenadas = (from tablaCoordenada in context.tbl_coordenadas
                                                where tablaCoordenada.usr_id == persona
                                                orderby tablaCoordenada.ID_Coordenada_ descending
                                                select tablaCoordenada).Take(10).ToList();

                        coordenadasEnviar.AddRange(HelperMethods.LlenarCoordenadas(Listacoordenadas));
                    }
                }
                else
                {
                    foreach (var persona in personaArray)
                    {
                        var Listacoordenadas = (from tablaCoordenada in context.tbl_coordenadas
                                               where tablaCoordenada.usr_fecha_coordenada >= fechaInicial && tablaCoordenada.usr_fecha_coordenada <= fechaFinal && tablaCoordenada.usr_id == persona
                                               orderby tablaCoordenada.ID_Coordenada_ descending
                                               select tablaCoordenada).ToList();

                        coordenadasEnviar.AddRange(HelperMethods.LlenarCoordenadas(Listacoordenadas));
                    }
                }

                if (coordenadasEnviar.Count > 0)
                {
                    return coordenadasEnviar;
                }
                else
                {
                    return null;
                }
            }
        }

        public string ProbarConexionWs()
        {
            string Sw_Conexion = "0";

                HelperMethods.OpenConnection_Net();
                SqlConnection cnn = new SqlConnection(HelperMethods.conStr);
                cnn.Open();
                Sw_Conexion = "1 OK";
                HelperMethods.Terminar_Net();
            
            return Sw_Conexion;
        }

        public List<HistorialChat> ListarMensajes(int emisor, int receptor)
        {
            using (zeusEntities context = new zeusEntities())
            {
                List<HistorialChat> ListaHistorial = new List<HistorialChat>();

                var ListaMensajes = (from tablaHistorial in context.tbl_historial_chat
                                     where (tablaHistorial.chat_emisor == emisor  && tablaHistorial.chat_receptor == receptor) 
                                        || (tablaHistorial.chat_emisor == receptor  && tablaHistorial.chat_receptor == emisor)
                                     orderby tablaHistorial.chat_fecha select tablaHistorial).ToList();

                if (ListaMensajes.Count > 0)
                {
                    foreach (var historial in ListaMensajes)
                    {
                        ListaHistorial.Add(new HistorialChat(historial));
                    }

                    return ListaHistorial;
                }
                else
                {
                    return null;
                }
            }
        }

        public void guardarMensajes(int emisor, int receptor, string mensaje, DateTime fecha)
        {
            using (zeusEntities context = new zeusEntities())
            {
                tbl_historial_chat mensajesChat = new tbl_historial_chat();

                mensajesChat.chat_emisor = emisor;
                mensajesChat.chat_receptor = receptor;
                mensajesChat.chat_mensaje = mensaje;
                mensajesChat.chat_fecha = fecha;

                context.tbl_historial_chat.Add(mensajesChat);
                context.SaveChanges();
            }
        }
    }
}
