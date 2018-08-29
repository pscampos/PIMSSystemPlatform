using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace IHM.Login
{
    public class Login
    {

        /// <summary>
        /// Verifica se é o login da IHM
        /// </summary>
        /// <param name="usuario"></param>
        /// <param name="senha"></param>
        /// <returns></returns>
        public static Boolean TryLoginIHM(string usuario, string senha)
        {
            if(usuario == "ihm" && senha == "ihm123!@#")
            {                
                return true;
            }

            return false;
        }

    }
}
