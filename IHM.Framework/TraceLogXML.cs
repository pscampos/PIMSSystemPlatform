using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.Configuration;
using System.Xml;
using System.Xml.Linq;

namespace IHM.Log.Xml
{
    public static class TraceLog
    {
        
        public const string NOME_ARQUIVO_LOG = "LogFile.xml";

        public static string GetLogDiretory()
        {
            return System.Configuration.ConfigurationManager.AppSettings["LogDiretory"].ToString();
        }

        public static string GetLogDays()
        {
            return System.Configuration.ConfigurationManager.AppSettings["LogDays"].ToString();
        }

        public enum TipoLog
        {
            Informacao,
            Alerta,
            Erro
        }

        /// <summary>
        /// Loga operação
        /// </summary>
        /// <param name="mensagem"></param>
        /// <param name="tipoLog"></param>
        public static void LogEvent(string mensagem, TipoLog tipoLog)
        {            
            string dateLog = DateTime.Now.ToShortDateString().ToString() + " " + DateTime.Now.ToLongTimeString().ToString();

            string fullLocation = GetCurrentFileLogName();
            
            XDocument doc = XDocument.Load(fullLocation);
            XElement root = new XElement("LOG");
            root.Add(new XAttribute("tipo", tipoLog.ToString()));
            root.Add(new XAttribute("mensagem", mensagem));
            root.Add(new XAttribute("data", dateLog));
            doc.Element("LOGS").Add(root);
            doc.Save(fullLocation);
            
        }

        public static void DeleteOldLogFiles()
        {

        }



        public static string GetCurrentFileLogName()
        {

            string logFileTime;

            string sYear = DateTime.Now.Year.ToString();
            string sMonth = DateTime.Now.Month.ToString();
            string sDay = DateTime.Now.Day.ToString();
            logFileTime = sYear + sMonth + sDay;

            string logFileName = logFileTime + NOME_ARQUIVO_LOG;

            string directory = GetLogDiretory();

            string fullLocation = System.IO.Path.Combine(directory, logFileName);
            

            // Verifica se existe o arquivo de log para o dia de hoje
            if (!System.IO.File.Exists(fullLocation)) {
                if (!Directory.Exists(directory))
                {
                    Directory.CreateDirectory(directory);
                }

                XmlWriter xmlWriter = XmlWriter.Create(fullLocation);

                xmlWriter.WriteStartDocument();
                xmlWriter.WriteStartElement("LOGS");
                xmlWriter.WriteEndDocument();
                xmlWriter.Close();

                DeleteOldLogFiles();
            }
            return fullLocation;
        }
        

    }
}
