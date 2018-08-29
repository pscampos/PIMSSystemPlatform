using PIMSSystemPlatform.PIObjects;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace PIMSSystemPlatform.BusinessObjects
{
    public class RelatorioAcompanhamentoDiario
    {

        public List<InformacaoAttributo> Informacao { get; set; }
        public List<string> Hora { get; set; }

        public RelatorioAcompanhamentoDiario()
        {
            Informacao = new List<InformacaoAttributo>();
            Hora = new List<string>(new string[] { "01:00", "02:00", "03:00", "04:00", "05:00", "06:00", "07:00", "08:00", "09:00", "10:00", "11:00", "12:00", "13:00", "14:00", "15:00", "16:00", "17:00", "18:00", "19:00", "20:00", "21:00", "22:00", "23:00", "00:00" });
        }

        public class Summary
        {
            public List<object> MediaHoraria { get; set; }
            public object MediaDiaria { get; set; }
            public object DesvioPadrao { get; set; }
        }

        public class InformacaoAttributo
        {
            public InformacaoAttributo()
            {
                AFAttribute = new AFAttribute();
                Summary = new Summary();
            }

            public AFAttribute AFAttribute { get; set; }
            public Summary Summary { get; set; }
        }
    }
}