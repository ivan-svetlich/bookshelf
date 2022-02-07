using Bookshelf.Models;
using CsvHelper;
using iText.IO.Font.Constants;
using iText.Kernel.Colors;
using iText.Kernel.Font;
using iText.Kernel.Geom;
using iText.Kernel.Pdf;
using iText.Layout;
using iText.Layout.Element;
using iText.Layout.Properties;
using System;
using System.Collections.Generic;
using System.Globalization;
using System.IO;

namespace Bookshelf.Services
{
    public class FileService
    {
        public static byte[] CreateCsv(User user, List<BookToFile> dataList)
        {
            string fileName = System.IO.Path.GetTempPath() + Guid.NewGuid().ToString() + ".csv";

            using (FileStream fs = new FileStream(fileName, FileMode.OpenOrCreate, FileAccess.ReadWrite, FileShare.None,
                4096, FileOptions.RandomAccess))
            {
                using (var writer = new StreamWriter(fs))
                using (var csv = new CsvWriter(writer, CultureInfo.InvariantCulture))
                {
                    csv.WriteRecords(dataList);
                }
                byte[] fileBytes = File.ReadAllBytes(fileName);

                File.Delete(fileName);

                return fileBytes;
            }
            
            
        }

        public static byte[] CreatePdf(User user, List<BookToFile> dataList)
        {
            string fileName = System.IO.Path.GetTempPath() + Guid.NewGuid().ToString() + ".pdf";

            using (FileStream fs = new FileStream(fileName, FileMode.OpenOrCreate, FileAccess.ReadWrite, FileShare.None,
               4096, FileOptions.RandomAccess))
            {
                using (PdfDocument pdfDoc = new PdfDocument(new PdfWriter(fs)))
                using (Document doc = new Document(pdfDoc, PageSize.A4.Rotate()))
                {
                    float[] columnWidths = { 1, 6, 5, 5, 2, 1 };
                    Table table = new Table(UnitValue.CreatePercentArray(columnWidths));

                    PdfFont f = PdfFontFactory.CreateFont(StandardFonts.HELVETICA);
                    Cell cell = new Cell(1, 6)
                            .Add(new Paragraph($"{user.UserName}'s booklist"))
                            .SetFont(f)
                            .SetFontSize(13)
                            .SetFontColor(DeviceGray.WHITE)
                            .SetBackgroundColor(DeviceGray.BLACK)
                            .SetTextAlignment(TextAlignment.CENTER);

                    table.AddHeaderCell(cell);

                    Cell[] headerFooter = new Cell[] 
                    {
                        new Cell().SetTextAlignment(TextAlignment.CENTER).SetBackgroundColor(new DeviceGray(0.75f)).Add(new Paragraph("#")),
                        new Cell().SetTextAlignment(TextAlignment.CENTER).SetBackgroundColor(new DeviceGray(0.75f)).Add(new Paragraph("Title")),
                        new Cell().SetTextAlignment(TextAlignment.CENTER).SetBackgroundColor(new DeviceGray(0.75f)).Add(new Paragraph("Author(s)")),
                        new Cell().SetTextAlignment(TextAlignment.CENTER).SetBackgroundColor(new DeviceGray(0.75f)).Add(new Paragraph("Publisher")),
                        new Cell().SetTextAlignment(TextAlignment.CENTER).SetBackgroundColor(new DeviceGray(0.75f)).Add(new Paragraph("Status")),
                        new Cell().SetTextAlignment(TextAlignment.CENTER).SetBackgroundColor(new DeviceGray(0.75f)).Add(new Paragraph("Score"))
                    };

                    foreach (Cell col in headerFooter)
                    {
                        table.AddHeaderCell(col);
                    }

                    int counter = 0;
                    foreach (BookToFile book in dataList)
                    {
                        table.AddCell(new Cell().SetTextAlignment(TextAlignment.CENTER).Add(new Paragraph((counter + 1).ToString())));
                        table.AddCell(new Cell().SetTextAlignment(TextAlignment.LEFT).Add(new Paragraph(book.Title)));
                        table.AddCell(new Cell().SetTextAlignment(TextAlignment.LEFT).Add(new Paragraph(book.Authors)));
                        table.AddCell(new Cell().SetTextAlignment(TextAlignment.LEFT).Add(new Paragraph(book.Publisher)));
                        table.AddCell(new Cell().SetTextAlignment(TextAlignment.CENTER).Add(new Paragraph(book.Status)));
                        table.AddCell(new Cell().SetTextAlignment(TextAlignment.CENTER).Add(new Paragraph(book.Score)));

                        counter++;
                    }

                    doc.Add(new Paragraph(DateTime.UtcNow.ToString("R", CultureInfo.InvariantCulture)).SetTextAlignment(TextAlignment.RIGHT));
                    doc.Add(new Paragraph());
                    doc.Add(table.SetHorizontalAlignment(HorizontalAlignment.CENTER));
                    doc.Close();
                };

                byte[] fileBytes = File.ReadAllBytes(fileName);
                File.Delete(fileName);

                return fileBytes;
            }
        }

        public static string GetStatusAsString(int? statusNumber)
        {
            switch (statusNumber)
            {
                case 1:
                    return "Reading";
                case 2:
                    return "Completed";
                case 3:
                    return "On-Hold";
                case 4:
                    return "Dropped";
                case 5:
                    return "Plan to Read";
                default:
                    return "-";
            }
        }

        public static string GetScoreAsString(int? score)
        {
            return Convert.ToBoolean(score) ? score.ToString() : "-";
        }
    }
}
