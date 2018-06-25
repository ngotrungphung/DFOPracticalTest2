using System;
using System.Collections.Generic;
using System.Linq;
using System.ComponentModel;
using System.ComponentModel.DataAnnotations;
using System.Web;
using System.ComponentModel.DataAnnotations.Schema;

namespace BPT.Models
{
    public class User
    {
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        public int ID { get; set; }
        [Required(ErrorMessage = "An Name is required")]
        [StringLength(50)]
        public string Name { get; set; }
        [Required(ErrorMessage = "An Age is required")]
        public int Age { get; set; }
        [StringLength(50)]
        public string Address { get; set; }
    }
}