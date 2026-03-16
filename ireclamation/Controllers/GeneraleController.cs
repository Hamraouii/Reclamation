using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace iReclamation.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class GeneraleController : ControllerBase
    {
        
        [HttpGet("DownloadFile")]
        public IActionResult DownloadFile(string filePath)
        {
            //Remove first /
            filePath = filePath.TrimStart('/');

            // Ensure the filePath is valid and exists, you may want to implement security checks here.
            var _filePath = Path.Combine(Directory.GetCurrentDirectory(), filePath);

            // Determine the file name from the path
            var fileName = Path.GetFileName(_filePath);

            // Check if the file exists
            if (!System.IO.File.Exists(_filePath))
            {
                return NotFound("File not found"); // Return a 404 Not Found response
            }
            
            // Determine the content type based on the file extension
            var contentType = GetContentType(_filePath);

            // Return the file for download
            return File(System.IO.File.OpenRead(_filePath), contentType, fileName);
        }
        
        

        private string GetContentType(string filePath)
        {
            var ext = Path.GetExtension(filePath)?.ToLowerInvariant();

            switch (ext)
            {
                case ".pdf":
                    return "application/pdf";
                case ".doc":
                    return "application/msword";
                case ".jpg":
                case ".jpeg":
                    return "image/jpeg";
                case ".png":
                    return "image/png";
                case ".gif":
                    return "image/gif";
                case ".ico":
                    return "image/x-icon";
                // Add more mappings for other file types as needed
                default:
                    return "application/octet-stream";
            }
        }
    }
}
