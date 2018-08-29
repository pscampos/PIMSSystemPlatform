using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.Configuration;


namespace IHM.Log.Txt
{
    public static class TraceLog
    {
        
        public const string NOME_ARQUIVO_LOG = "LogFile.txt";

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
            string sLogFormat;

            sLogFormat = DateTime.Now.ToShortDateString().ToString() + " " + DateTime.Now.ToLongTimeString().ToString() + " ==> ";
            
            StreamWriter sw = new StreamWriter(GetCurrentFileLogName(), true);
            sw.WriteLine(sLogFormat + mensagem);
            sw.Flush();
            sw.Close();
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

            string fullFolder = System.IO.Path.Combine(directory, logFileName);
            

            // Verifica se existe o arquivo de log para o dia de hoje
            if (!System.IO.File.Exists(fullFolder)) {
                if (!Directory.Exists(directory))
                {
                    Directory.CreateDirectory(directory);
                }
                System.IO.File.Create(fullFolder);
                DeleteOldLogFiles();
            }
            return fullFolder;
        }
        

    }
}
