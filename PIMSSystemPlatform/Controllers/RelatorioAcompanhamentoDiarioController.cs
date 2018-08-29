using Newtonsoft.Json;
using Newtonsoft.Json.Linq;
using Newtonsoft.Json.Converters;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Web.Http;
using System.Web;
using IHM.ResourcesObjects;
using PIMSSystemPlatform.PIWebAPIAccess;
using PIMSSystemPlatform.PIObjects;
using PIMSSystemPlatform.BusinessObjects;
using System.Web.Script.Serialization;
using System.Configuration;

namespace Modelo.Api.Controllers
{
    [RoutePrefix("api/RelatorioAcompanhamentoDiario")]
    [Authorize]
    public class RelatorioAcompanhamentoDiarioController : ApiController
    {
        public static string format = "dd/MM/yyyy HH:mm:ss";
        public IsoDateTimeConverter dateTimeConverter = new IsoDateTimeConverter { DateTimeFormat = format };

        public static string PISystemName = ConfigurationManager.AppSettings["PISystemName"].ToString();
        public static string DatabaseName = ConfigurationManager.AppSettings["DatabaseName"].ToString();
        public static string MasterReportElementName = ConfigurationManager.AppSettings["MasterReportElementName"].ToString();

        public static string BaseUrl = ConfigurationManager.AppSettings["BaseUrl"].ToString();

        public static string user = ConfigurationManager.AppSettings["User"].ToString();
        public static string password = ConfigurationManager.AppSettings["Password"].ToString();

        [HttpGet]
        [Route(nameof(RelatorioAcompanhamentoDiarioController.RecuperarRelatorioAcompanhamentoDiario))]
        public object RecuperarRelatorioAcompanhamentoDiario()
        {
            Resposta resposta = new Resposta();

            try
            {

                string path = @"\\" + PISystemName + @"\" + DatabaseName;

                // Verify if Database exists
                if (!PIWebAPIAccess.GetDatabase(BaseUrl, path))
                {
                    path = @"\\" + PISystemName;
                    PIWebAPIAccess.CreateDatabase(BaseUrl, path, DatabaseName);
                    path = @"\\" + PISystemName + @"\" + DatabaseName;
                }

                path = path + @"\" + MasterReportElementName;
                // Verify if element "Reports" exists
                if (!PIWebAPIAccess.GetElement(BaseUrl, path))
                {
                    path = @"\\" + PISystemName + @"\" + DatabaseName;
                    PIWebAPIAccess.CreateMasterElement(BaseUrl, path, MasterReportElementName);
                    path = path + @"\" + MasterReportElementName;
                }

                List<AFElement> afElements = new List<AFElement>();

                // Get all elements childs
                afElements = PIWebAPIAccess.GetChildsElements(BaseUrl, path);

                // Get all Attributes childs
                foreach (var item in afElements)
                {
                    item.Attributes = PIWebAPIAccess.GetAttributes(BaseUrl, item.Path);
                }
                
                resposta.Dados = afElements;
                resposta.Status = true;
            }
            catch (Exception ex)
            {
                resposta.Status = false;
                resposta.Mensagem = ex.Message;
            }
            return resposta;

            
        }

        [HttpPost]
        [Route(nameof(RelatorioAcompanhamentoDiarioController.SalvarRelatorioAcompanhamentoDiario))]
        public object SalvarRelatorioAcompanhamentoDiario([FromBody] JObject data)
        {
            Resposta resposta = new Resposta();

            try
            {
                AFElement afElement = data.ToObject<AFElement>();

                string path = @"\\" + PISystemName + @"\" + DatabaseName;

                // Verify if Database exists
                if (!PIWebAPIAccess.GetDatabase(BaseUrl, path))
                {
                    throw new Exception(string.Format("Database {0} does not existis!", DatabaseName));
                }

                path = path + @"\" + MasterReportElementName;
                // Verify if element "Reports" exists
                if (!PIWebAPIAccess.GetElement(BaseUrl, path))
                {
                    throw new Exception(string.Format("Element {0} does not existis!", MasterReportElementName));
                }

                path = @"\\" + PISystemName + @"\" + DatabaseName + @"\" + MasterReportElementName + @"\" + afElement.Name;
                // Verify if current "Relatorio de Acompanhameto Diario" exists
                if (PIWebAPIAccess.GetElementByWebId(BaseUrl, afElement.WebId))
                {
                    PIWebAPIAccess.DeleteElementByWebId(BaseUrl, afElement.WebId);
                }

                path = @"\\" + PISystemName + @"\" + DatabaseName + @"\" + MasterReportElementName;
                // Create current "Relatorio de Acompanhameto Diario" element
                PIWebAPIAccess.CreateElement(BaseUrl, path, ref afElement);

                // Create each attribute for the "Relatorio de Acompanhameto Diario" element
                foreach (var item in afElement.Attributes)
                {
                    PIWebAPIAccess.CreateAttribute(BaseUrl, afElement.Path, item.Name, item.Value);
                }


                resposta.Dados = afElement;
                resposta.Status = true;
            }
            catch (Exception ex)
            {
                resposta.Status = false;
                resposta.Mensagem = ex.Message;
            }
            return resposta;
        }

        [HttpPost]
        [Route(nameof(RelatorioAcompanhamentoDiarioController.ExcluirRelatorioAcompanhamentoDiario))]
        public object ExcluirRelatorioAcompanhamentoDiario([FromBody] JObject data)
        {
            Resposta resposta = new Resposta();

            try
            {
                AFElement afElement = data.ToObject<AFElement>();

                string path = @"\\" + PISystemName + @"\" + DatabaseName;
                // Verify if Database exists
                if (!PIWebAPIAccess.GetDatabase(BaseUrl, path))
                {
                    throw new Exception(string.Format("Database {0} does not existis!", DatabaseName));
                }

                path = path + @"\" + MasterReportElementName;
                // Verify if element "Reports" exists
                if (!PIWebAPIAccess.GetElement(BaseUrl, path))
                {
                    throw new Exception(string.Format("Element {0} does not existis!", MasterReportElementName));
                }

                path = path + @"\" + afElement.Name;

                PIWebAPIAccess.DeleteElement(BaseUrl, path);

                resposta.Status = true;
            }
            catch (Exception ex)
            {
                resposta.Status = false;
                resposta.Mensagem = ex.Message;
            }
            return resposta;
        }

        [HttpPost]
        [Route(nameof(RelatorioAcompanhamentoDiarioController.RecuperarDadosRelatorioAcompanhamentoDiario))]
        public object RecuperarDadosRelatorioAcompanhamentoDiario([FromBody] JObject data)
        {
            Resposta resposta = new Resposta();

            try
            {

                AFElement afElement = JsonConvert.DeserializeObject<AFElement>(data.GetValue("RelatorioAcompanhamentoDiario").ToString(), dateTimeConverter);
                DateTime dataInicial = DateTime.Parse(data.GetValue("Data").ToString()).Date;
                DateTime dataFinal = dataInicial.AddDays(1);


                string path = @"\\" + PISystemName + @"\" + DatabaseName;


                RelatorioAcompanhamentoDiario relatorioAcompanhamentoDiario = new RelatorioAcompanhamentoDiario();

                foreach (AFAttribute item in afElement.Attributes)
                {
                    RelatorioAcompanhamentoDiario.InformacaoAttributo dados = new RelatorioAcompanhamentoDiario.InformacaoAttributo();

                    dados.AFAttribute = item;
                    dados.Summary.MediaDiaria = PIWebAPIAccess.GetSummaryData(BaseUrl,item.Path, dataInicial,dataFinal,"Average");
                    dados.Summary.DesvioPadrao = PIWebAPIAccess.GetSummaryData(BaseUrl, item.Path, dataInicial, dataFinal, "StdDev");
                    dados.Summary.MediaHoraria = PIWebAPIAccess.GetSummaryData(BaseUrl, item.Path, dataInicial, dataFinal, "Average", "1h");

                    //dados.Summary.MediaHoraria = new List<double>(new double[] { 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 00});

                    relatorioAcompanhamentoDiario.Informacao.Add(dados);

                }
                              

                resposta.Dados = relatorioAcompanhamentoDiario;
                resposta.Status = true;
            }
            catch (Exception ex)
            {
                resposta.Status = false;
                resposta.Mensagem = ex.Message;
            }
            return resposta;


        }

    }
}
