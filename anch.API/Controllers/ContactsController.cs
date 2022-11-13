using anch.API.Models;
using Microsoft.AspNetCore.Mvc;

namespace anch.API.Controllers
{
    [ApiController]
    [Route("[controller]")]
    public class ContactsController : ControllerBase
    {
        private readonly AnchContext _context;

        public ContactsController(AnchContext context)
        {
            _context = context;
        }

        [HttpGet]
        public IEnumerable<Contact> Get()
        {
            return _context.Contacts.ToList();
        }
    }
}