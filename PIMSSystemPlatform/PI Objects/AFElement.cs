using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace PIMSSystemPlatform.PIObjects
{
    public class AFElement
    {
        public string Path { get; set; }
        public string Name { get; set; }
        public string WebId { get; set; }
        public List<AFAttribute> Attributes { get; set; }
    }
}