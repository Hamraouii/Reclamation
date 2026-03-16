using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using DinkToPdf;
using DinkToPdf.Contracts;
using iReclamation.BuisnessLayers;
using iReclamation.Dtos;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using OfficeOpenXml; // For Excel export
using PdfSharp;
using Wkhtmltopdf.NetCore; // For PDF export

namespace iReclamation.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class ExportController : ControllerBase
    {

        private readonly IGeneratePdf _generatePdf;

        public ExportController(RazorViewRenderer viewRenderer, IConverter pdfConverter,IGeneratePdf generatePdf)
        {
            _generatePdf = generatePdf;
        }
        
        [HttpPost("generateReclamationPdf")]
        public async Task<IActionResult> GeneratePdf(List<ReclamationDto> viewModel)
        {
            try
            {
                var options = new ConvertOptions
                {
                    PageSize = Wkhtmltopdf.NetCore.Options.Size.A4,
                    PageOrientation = Wkhtmltopdf.NetCore.Options.Orientation.Portrait,
                    PageMargins = new Wkhtmltopdf.NetCore.Options.Margins { Left = 5, Right = 5, Top = 5, Bottom = 10 },
                };

                _generatePdf.SetConvertOptions(options);
                var pdfBytes = await _generatePdf.GetByteArray("CanvaPdf/PdfReclamationWithFilter.cshtml", viewModel);

                // Create a memory stream from the PDF bytes
                using (var pdfStream = new MemoryStream(pdfBytes))
                {
                    return new FileStreamResult(pdfStream, "application/pdf");
                }
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"An error occurred: {ex.Message}");
            }
        }
        
        
        
        [HttpPost("pdf")]
        
    
        
                    

        [HttpPost("excel")]
        public IActionResult ExportToExcel(List<ReclamationDto> reclamationWithFilter)
        {
            using (ExcelPackage package = new ExcelPackage())
            {
                ExcelWorksheet worksheet = package.Workbook.Worksheets.Add("Reclamations");
                worksheet.Cells.LoadFromCollection(reclamationWithFilter, true);

                byte[] fileContents = package.GetAsByteArray();
                return File(fileContents, "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet", "reclamations.xlsx");
            }
        }
    }
}
