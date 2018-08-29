using System;
using System.Collections.Generic;
using System.Linq;
using System.Net.Http;
using System.Text;
using System.Web;
using System.Net.Http.Headers;
using System.Threading.Tasks;
using Newtonsoft.Json.Linq;
using PIMSSystemPlatform.PIObjects;
using System.Net;
using System.IO;
using Newtonsoft.Json;
using Modelo.Api.Controllers;

namespace PIMSSystemPlatform.PIWebAPIAccess
{
    public class PIWebAPIAccess
    {
        
        public static bool GetDatabase(string baseUrl, string path)
        {
            try
            {
                GetRequest(baseUrl + @"assetdatabases?path=" + path);
                return true;
            }
            catch (Exception ex)
            {
                return false;
            }
        }

        public static void CreateDatabase(string baseUrl, string path, string afDatabaseName)
        {
            string piSystemWebId = GetWebId(baseUrl, "assetservers", path);

            string url = baseUrl + "assetservers/" + piSystemWebId + "/assetdatabases";
            string postData = "{\"Name\": \"" + afDatabaseName + "\"}";

            PostRequest(url, postData);
        }

        public static bool GetElement(string baseUrl, string path)
        {
            try
            {
                GetRequest(baseUrl + @"elements?path=" + path);
                return true;
            }
            catch(Exception ex)
            {
                return false;
            }
        }

        public static bool GetElementByWebId(string baseUrl, string webId)
        {
            try
            {
                GetRequest(baseUrl + @"elements/" + webId + "/elements");
                return true;
            }
            catch (Exception ex)
            {
                return false;
            }
        }

        public static void CreateMasterElement(string baseUrl, string path, string afElementName)
        {
            string webId = GetWebId(baseUrl, "assetdatabases", path);

            string url = baseUrl + "assetdatabases/" + webId + "/elements";
            string postData = "{\"Name\": \"" + afElementName + "\"}";
            
            PostRequest(url, postData);
        }

        public static void CreateElement(string baseUrl, string path, ref AFElement afElement)
        {
            string masterWebId = GetWebId(baseUrl, "elements", path);
            
            string url = baseUrl + "elements/" + masterWebId + "/elements";
            string postData = "{\"Name\": \"" + afElement.Name + "\"}";
                        
            PostRequest(url, postData);

            afElement.Path = path + @"\" + afElement.Name;
            afElement.WebId = GetWebId(baseUrl, "elements", afElement.Path);   
        }

        public static List<AFElement> GetChildsElements(string baseUrl, string path)
        {
            string elementWebId = GetWebId(baseUrl, "elements", path);

            dynamic jsonObj = GetRequest(baseUrl + @"elements/" + elementWebId + @"/elements");
            
            List<AFElement> afElements = new List<AFElement>();

            foreach (var item in jsonObj.Items)
            {
                AFElement afElement = new AFElement();
                afElement.Name = item.Name.Value;
                afElement.Path = item.Path.Value;
                afElement.WebId = item.WebId.Value;

                afElements.Add(afElement);
            }

            return afElements;
        }

        public static List<AFAttribute>  GetAttributes(string baseUrl, string path)
        {
            string elementWebId = GetWebId(baseUrl, "elements", path);

            dynamic jsonObj = GetRequest(baseUrl + @"elements/" + elementWebId + @"/attributes");

            List<AFAttribute> afAttributes = new List<AFAttribute>();

            foreach (var item in jsonObj.Items)
            {
                AFAttribute afAttribute = new AFAttribute();
                afAttribute.Name = item.Name.Value;

                dynamic jsonObjPoin = GetRequest(item.Links.Point.Value);

                afAttribute.Value = jsonObjPoin.Path.Value.Replace(@"\\" + RelatorioAcompanhamentoDiarioController.PISystemName.ToUpper() + @"\", "");
                afAttribute.Path = item.Path.Value;

                afAttributes.Add(afAttribute);
            }

            return afAttributes;
        }


        public static object GetSummaryData(string baseUrl, string path, DateTime startTime, DateTime endTime, string summaryType)
        {
            string webId = GetWebId(baseUrl, "attributes", path);

            dynamic jsonObj = GetRequest(baseUrl + @"streams/" + webId + @"/summary?starttime=" + startTime.ToString("yyyy'-'MM'-'dd'T'HH':'mm':'ss'.'fff'Z'") + @"&endtime=" + endTime.ToString("yyyy'-'MM'-'dd'T'HH':'mm':'ss'.'fff'Z'") + @"&summarytype=" + summaryType);
            
            return jsonObj.Items[0].Value.Value.Value;
        }

        public static List<object> GetSummaryData(string baseUrl, string path, DateTime startTime, DateTime endTime, string summaryType, string summaryDuration = "")
        {
            string webId = GetWebId(baseUrl, "attributes", path);

            dynamic jsonObj = GetRequest(baseUrl + @"streams/" + webId + @"/summary?starttime=" + startTime.ToUniversalTime().ToString("yyyy'-'MM'-'dd'T'HH':'mm':'ss'.'fff'Z'") + @"&endtime=" + endTime.ToUniversalTime().ToString("yyyy'-'MM'-'dd'T'HH':'mm':'ss'.'fff'Z'") + @"&summarytype=" + summaryType + @"&summaryDuration=" + summaryDuration);

            List<object> lista = new List<object>();

            foreach (var item in jsonObj.Items)
            {
                lista.Add(item.Value.Value.Value);
            }

            return lista;
        }

        public static void DeleteElement(string baseUrl, string path)
        {
            string webId = GetWebId(baseUrl, "elements", path);
            
            string url = baseUrl + "elements/" + webId;

            DeleteRequest(url);
        }

        public static void DeleteElementByWebId(string baseUrl, string webId)
        {
            string url = baseUrl + "elements/" + webId;

            DeleteRequest(url);
        }

        public static void CreateAttribute(string baseUrl, string path, string attributeName, string value)
        {

            string webId = GetWebId(baseUrl, "elements", path);
            
            string url = baseUrl + "elements/" + webId + "/attributes";
            string postData = "{\"Name\": \"" + attributeName + "\", \"ConfigString\": \"" + value + "\", \"Type\": \"Double\", \"DataReferencePlugIn\": \"PI Point\"}";
            
            PostRequest(url, postData);
        }


        public static string GetWebId(string base_url, string type, string path)
        {
            dynamic jsonObj = GetRequest(base_url + type + @"?path=" + path);
            return jsonObj.WebId.Value;
        }


        internal static dynamic GetRequest(string url)
        {
            WebRequest request = WebRequest.Create(url);
            request.Credentials = new NetworkCredential(RelatorioAcompanhamentoDiarioController.user, RelatorioAcompanhamentoDiarioController.password);
            
            WebResponse response = null;

            response = request.GetResponse();
            
            using (StreamReader sw = new StreamReader(response.GetResponseStream()))
            {
                using (JsonTextReader reader = new JsonTextReader(sw))
                {
                    return JObject.ReadFrom(reader);
                }
            }
        }

        internal static void PostRequest(string url,string postData)
        {
            WebRequest request = WebRequest.Create(url);
            request.Method = "POST";

            request.Credentials = new NetworkCredential(RelatorioAcompanhamentoDiarioController.user, RelatorioAcompanhamentoDiarioController.password);
            
            request.ContentType = "application/json";
            byte[] byteArray = Encoding.UTF8.GetBytes(postData);
            request.ContentLength = byteArray.Length;
            Stream dataStream = request.GetRequestStream();
            dataStream.Write(byteArray, 0, byteArray.Length);
            dataStream.Close();
            WebResponse response = request.GetResponse();
        }

        internal static void DeleteRequest(string url)
        {
            WebRequest request = WebRequest.Create(url);
            request.Method = "DELETE";

            request.Credentials = new NetworkCredential(RelatorioAcompanhamentoDiarioController.user, RelatorioAcompanhamentoDiarioController.password);
            
            request.ContentType = "application/json";
            Stream dataStream = request.GetRequestStream();
            dataStream.Close();
            WebResponse response = request.GetResponse();
        }


    }
}