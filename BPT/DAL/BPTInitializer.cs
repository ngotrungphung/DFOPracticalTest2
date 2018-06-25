using BPT.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace BPT.DAL
{
    public class BPTInitializer : System.Data.Entity.DropCreateDatabaseIfModelChanges<BPTContext>
    {
        protected override void Seed(BPTContext context)
        {
            var users = new List<User>
            {
            new User{Name="Carson",Address="Alexander",Age=20},
            new User{Name="Meredith",Address="Alonso",Age=20},
            new User{Name="Arturo",Address="Anand",Age=20},
            new User{Name="Gytis",Address="Barzdukas",Age=20},
            new User{Name="Yan",Address="Li",Age=20},
            new User{Name="Peggy",Address="Justice",Age=20},
            new User{Name="Laura",Address="Norman",Age=20},
            new User{Name="Nino",Address="Olivetto",Age=20}
            };

            users.ForEach(s => context.Users.Add(s));
            context.SaveChanges();

        }
    }
}